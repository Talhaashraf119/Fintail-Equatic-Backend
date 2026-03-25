import nodemailer from "nodemailer";

export const email = (req, res) => {
    const { 
        email, 
        city, 
        country, 
        firstName, 
        lastName, 
        address, 
        postalcode, 
        phone, 
        products 
    } = req.body;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        }
    });

    // Generate HTML for product details
    const productHTML = products.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.price}</td>
            <td>${item.quantity}</td>
        </tr>
    `).join("");

    const options = {
        from: process.env.USER,
        to: email,
        subject: "Order Confirmation",
        html: `
            <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            color: #333;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 20px;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            background: #fff;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        h2 {
                            color: #007BFF;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }
                        table, th, td {
                            border: 1px solid #ddd;
                        }
                        th, td {
                            padding: 8px;
                            text-align: left;
                        }
                        th {
                            background-color: #f4f4f4;
                        }
                        .footer {
                            font-size: 14px;
                            color: #888;
                            text-align: center;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>Order Confirmation</h2>
                        <p>Dear ${firstName} ${lastName},</p>
                        <p>Thank you for your order. Here are the details:</p>
                        
                        <h3>Shipping Information</h3>
                        <p><strong>Address:</strong> ${address}, ${city}, ${country}, ${postalcode}</p>
                        <p><strong>Phone:</strong> ${phone}</p>
                        
                        <h3>Order Details</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${productHTML}
                            </tbody>
                        </table>
                        
                        <div class="footer">
                            <p>Thank you for shopping with us!</p>
                            <p>&copy; ${new Date().getFullYear()} Nishat Linen</p>
                        </div>
                    </div>
                </body>
            </html>`
    };

    transporter.sendMail(options, (error, info) => {
        if (error) {
            return res.status(500).send({ message: "The email could not be sent", error });
        } else {
            return res.status(200).send({ message: "Email sent successfully", info: info.response });
        }
    });
};
