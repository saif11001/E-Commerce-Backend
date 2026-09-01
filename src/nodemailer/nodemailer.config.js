import dotenv from "dotenv";
import { BrevoClient } from "@getbrevo/brevo";

dotenv.config();

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    if (!to || !subject || !html) {
      throw new Error("Missing email fields");
    }

    const result = await brevo.transactionalEmails.sendTransacEmail({
      sender: { name: "E-Commerce Store", email: process.env.BREVO_SENDER_EMAIL },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });

    console.log("Email sent:", result.messageId || result);

    return result;
  } catch (err) {
    console.error("sendEmail failed:", err.message);
    throw new Error(err.message);
  }
};