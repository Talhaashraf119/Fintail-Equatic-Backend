import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user:'rksfintailaquatic@gmail.com',
    pass:'iqib cibr mehf zdsq',
  },
});

export const sendOrderEmails = async (
  customerEmail,
  pdfPath,
  products,
  shippingAddress,
  total
) => {

  // ✅ CUSTOMER EMAIL
  await transporter.sendMail({
    from:'rksfintailaquatic@gmail.com',
    to: customerEmail,
    subject: "Thank You For Your Order - Fintail Aquatic",
    html: `<h2>Thank You!</h2><p>Your order was successful.</p>`,
    attachments: [{ path: pdfPath }],
  });

  // ✅ OWNER EMAIL WITH FULL ADDRESS
  await transporter.sendMail({
    from:'rksfintailaquatic@gmail.com',
    to:'rksfintailaquatic@gmail.com',
    subject: "🚨 New Paid Order Received",
    html: `
      <h2>New Order Received</h2>

      <h3>Customer Email:</h3>
      <p>${customerEmail}</p>

      <h3>Shipping Address:</h3>
      <p>
        ${shippingAddress.firstName} ${shippingAddress.lastName}<br>
        ${shippingAddress.address}, ${shippingAddress.apartment || ""}<br>
        ${shippingAddress.state} - ${shippingAddress.postalCode}<br>
        ${shippingAddress.country}<br>
        Phone: ${shippingAddress.phone}
      </p>

      <h3>Products:</h3>
      <pre>${JSON.stringify(products, null, 2)}</pre>

      <h3>Total Amount:</h3>
      <h2>$${total}</h2>
    `,
  });
};
