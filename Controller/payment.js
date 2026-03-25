import Stripe from 'stripe';
import nodemailer from 'nodemailer';

// Replace with your actual secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// Create a transporter for sending emails (using Gmail for this example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rksfintailaquatic@gmail.com', // your email address
    pass: 'iqib cibr mehf zdsq',  // your email password or app-specific password
  }
});

const payment = async (req, res) => {
    try {
        const { products, email } = req.body; // Make sure to capture the email from the client

        const lineItems = products.map((product) => {
            // Extract numeric value from price string
            const numericPrice = Number(product.price.replace(/[^0-9.-]+/g, ""));
            
            // Check if the price is valid
            if (isNaN(numericPrice)) {
                console.error(`Invalid price format for product ${product._id}: ${product.price}`);
                throw new Error(`Invalid price format for product ${product._id}: ${product.price}`);
            }
            
            // Convert price to cents
            const unitAmount = Math.round(numericPrice * 100);
            
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.name,
                    },
                    unit_amount: unitAmount,
                },
                quantity: product.quantity,
            };
        });

        // Create the checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: 'http://localhost:5500/success.html',
            cancel_url: 'http://localhost:5500/cancel.html',
        });

        // Send Thank You Email to Customer after Successful Payment
        const emailSubject = 'Thank You for Your Purchase!';
        const emailBody = `
            <h1>Thank You for Your Order!</h1>
            <p>Dear customer,</p>
            <p>We’ve received your order and will process it shortly.</p>
            <h3>Order Details:</h3>
            <ul>
                ${products.map(product => `
                    <li>${product.name} x ${product.quantity} - ${product.price}</li>
                `).join('')}
            </ul>
            <p>Total: Rs ${lineItems.reduce((acc, item) => acc + (item.price_data.unit_amount / 100) * item.quantity, 0)}</p>
            <p>We appreciate your business! You will receive another email once your order has shipped.</p>
            <p>Best regards,</p>
            <p>Your Company Name</p>
        `;

        const mailOptions = {
            from: 'rksfintailaquatic@gmail.com', // sender address
            to: email,  // customer’s email address
            subject: emailSubject,
            html: emailBody, // the HTML content of the email
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        // Send the session ID back to the frontend to redirect to Stripe Checkout
        res.json({ id: session.id });

    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
};

export default payment;
