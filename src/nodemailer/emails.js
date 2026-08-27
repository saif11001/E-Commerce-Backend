import { sendEmail } from "./nodemailer.config.js";
import {
  verifyEmailTemplate,
  welcomeEmailTemplate,
  resetPasswordTemplate,
  passwordChangedTemplate,
  orderConfirmationTemplate,
  adminNewCouponTemplate,
  adminNewProductTemplate,
  adminProductUpdatedTemplate,
  trackOrdersTemplate,
} from "./emailTemplates.js";

export const sendVerificationEmail = async ({ email, name, token }) => {
  const html = verifyEmailTemplate(name, token);
  await sendEmail({ to: email, subject: "Verify your email", html });
};

export const sendWelcomeEmail = async ({ email, name }) => {
  const html = welcomeEmailTemplate(name);
  await sendEmail({ to: email, subject: "Welcome to E-Commerce Store", html });
};

export const sendResetPasswordEmail = async ({ email, name, resetLink }) => {
  const html = resetPasswordTemplate(name, resetLink);
  await sendEmail({ to: email, subject: "Reset Your Password", html });
};

export const sendPasswordChangedEmail = async ({ email, name }) => {
  const html = passwordChangedTemplate(name);
  await sendEmail({ to: email, subject: "Your Password Has Been Changed", html });
};

export const sendOrderConfirmationEmail = async ({ email, name, order }) => {
  const html = orderConfirmationTemplate(name, order);
  await sendEmail({
    to: email,
    subject: `Order Confirmed — #${order._id.toString().slice(-8).toUpperCase()}`,
    html,
  });
};

export const sendAdminNewCouponEmail = async ({ email, coupon }) => {
  const html = adminNewCouponTemplate(coupon);
  await sendEmail({ to: email, subject: `New Coupon: ${coupon.code}`, html });
};

export const sendAdminNewProductEmail = async ({ email, product }) => {
  const html = adminNewProductTemplate(product);
  await sendEmail({ to: email, subject: `New Product: ${product.name}`, html });
};

export const sendAdminProductUpdatedEmail = async ({ email, product }) => {
  const html = adminProductUpdatedTemplate(product);
  await sendEmail({ to: email, subject: `Product Updated: ${product.name}`, html });
};

export const sendTrackOrdersEmail = async ({ email, trackLink }) => {
  const html = trackOrdersTemplate(trackLink);
  await sendEmail({ to: email, subject: "Track Your Orders", html });
};