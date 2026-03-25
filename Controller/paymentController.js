import Stripe from "stripe";
import product from "../Model/product.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const createCheckout = async (req, res) => {
  try {
    const { products, email, shippingAddress } = req.body;

    const lineItems = [];

    for (const item of products) {
      const foundProduct = await product.findById(item._id);

      if (!foundProduct) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }

      const selectedVariant = foundProduct.variants[item.variant];

      if (!selectedVariant) {
        return res.status(400).json({ message: `Invalid variant for ${item.name}` });
      }

      if (selectedVariant.stock < item.quantity) {
        const variantMessages = {
          packOf10: "No pack of 10 available",
          packOf20: "No pack of 20 available",
          breederOnly: "No breeder pack available",
          maleOnly: "No male only available",
        };

        return res.status(400).json({
          message:
            selectedVariant.stock <= 0
              ? variantMessages[item.variant]
              : `Only ${selectedVariant.stock} ${item.variant} available`,
        });
      }

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: `${foundProduct.name} - ${item.variant}`,
          },
          unit_amount: Math.round(selectedVariant.price * 100),
        },
        quantity: item.quantity,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: email,
      metadata: {
        products: JSON.stringify(products),
        shippingAddress: JSON.stringify(shippingAddress),
      },
      success_url: "http://localhost:5500/success.html",
      cancel_url: "http://localhost:5500/cancel.html",
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({
      message: "Checkout creation failed",
      error: error.message,
    });
  }
};