import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

export const sendOutOfStockEmail = async (productName, variantName) => {
  await transporter.sendMail({
    from: process.env.USER,
    to: process.env.USER,
    subject: "Stock Finished Alert",
    html: `
      <h2>Stock Alert</h2>
      <p><strong>${productName}</strong> has finished for variant:</p>
      <h3>${variantName}</h3>
    `,
  });
};