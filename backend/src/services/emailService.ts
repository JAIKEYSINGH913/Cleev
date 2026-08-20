import nodemailer from "nodemailer";
import { env } from "../config/env";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export const sendOTP = async (email: string, otp: string) => {
  if (!env.SMTP_USER || !env.SMTP_PASS) {
    console.log(`⚠️ SMTP not configured. Mocking OTP send: [${otp}] to ${email}`);
    return;
  }

  const mailOptions = {
    from: `"Cleev" <${env.SMTP_USER}>`,
    to: email,
    subject: "Your Cleev Verification Code",
    text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};
