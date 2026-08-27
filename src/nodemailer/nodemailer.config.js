import dotenv from 'dotenv';
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS
  }
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    if (!to || !subject || !html) {
      throw new Error("Missing email fields");
    }
    
    const info = await transporter.sendMail({
      from: `"E-Commerce Store" <${process.env.NODEMAILER_USER}>`,
      // from: `"E-Commerce Store"`,
      to,
      subject,
      html
    });

    console.log("Email sent:", info.messageId);

    return info;
  } catch (err) {
    throw new Error(err.message);
  }
};