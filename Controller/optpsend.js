import nodemailer from "nodemailer";
import user from "../Model/model.js";

export const optpsend = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const checkemail = await user.findOne({ email });

        if (!checkemail) {
            return res.status(404).json({
                success: false,
                message: "Email is not registered"
            });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        });

        const option = {
            from: process.env.USER,
            to: email,
            subject: "OTP Verification",
            html: `<h3>Your OTP is: ${otp}</h3>`
        };

        await transporter.sendMail(option);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Email sending failed"
        });
    }
};