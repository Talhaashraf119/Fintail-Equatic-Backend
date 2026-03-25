import Stripe from "stripe";
import order from "../Model/order.js";
import product from "../Model/product.js";
import { createInvoice } from "../services/invoiceService.js";
import { sendOrderEmails } from "../services/emailService.js";
import { sendOutOfStockEmail } from "../services/stockAlertService.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhook = async (req, res) => {
  let event;

  try {
    const sig = req.headers["stripe-signature"];

    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object;
      const cartProducts = JSON.parse(session.metadata.products);
      const shippingAddress = JSON.parse(session.metadata.shippingAddress);

      let finalOrderProducts = [];
      let total = 0;

      for (const item of cartProducts) {
        const foundProduct = await product.findById(item._id);

        if (!foundProduct) {
          console.log("Product not found:", item._id);
          continue;
        }

        const selectedVariant = foundProduct.variants[item.variant];

        if (!selectedVariant) {
          console.log("Variant not found:", item.variant);
          continue;
        }

        if (selectedVariant.stock < item.quantity) {
          console.log(`Insufficient stock for ${foundProduct.name} - ${item.variant}`);
          continue;
        }

        selectedVariant.stock -= item.quantity;

        const unitPrice = selectedVariant.price;
        total += unitPrice * item.quantity;

        finalOrderProducts.push({
          productId: foundProduct._id,
          name: foundProduct.name,
          variant: item.variant,
          quantity: item.quantity,
          price: unitPrice,
        });

        if (selectedVariant.stock === 0 && !selectedVariant.outOfStockNotified) {
          await sendOutOfStockEmail(foundProduct.name, item.variant);
          selectedVariant.outOfStockNotified = true;
        }

        if (selectedVariant.stock > 0) {
          selectedVariant.outOfStockNotified = false;
        }

        await foundProduct.save();
      }

      const orderDoc = await order.create({
        customerEmail: session.customer_email,
        shippingAddress,
        products: finalOrderProducts,
        total,
        paymentStatus: "Paid",
      });

      const invoicePath = createInvoice(orderDoc);

      await sendOrderEmails(
        orderDoc.customerEmail,
        invoicePath,
        finalOrderProducts,
        shippingAddress,
        total
      );

      console.log("Order completed successfully");
    } catch (err) {
      console.error("Order Processing Error:", err);
    }
  }

  res.json({ received: true });
};