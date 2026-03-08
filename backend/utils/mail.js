import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true, // Use true for port 465, false for port 587
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

export const sendOtpMail = async (to,otp) => {
  
  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject: "Reset Your Password",
    html:`<p>Your OTP for password reset is <b> ${otp} </b>.
    It expires in 5 minutes.</p>`
  });
};
// utils/mail.js mein ye add karein
export const sendDeliveryOtpMail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "📦 Delivery Verification - Your OTP",
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #ff4d2d;">Order Delivery Verification</h2>
        <p>Hello,</p>
        <p>Your delivery boy is at your location. Please provide this OTP to verify and receive your order:</p>
        <h1 style="color: #333; letter-spacing: 5px; font-size: 40px;">${otp}</h1>
        <p style="color: #777; font-size: 12px;">This OTP is only for delivery verification. Do not share it with anyone else.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
