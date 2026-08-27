import { body } from "express-validator";

export const checkoutValidation = [
    body("paymentMethod").trim().notEmpty().withMessage("Payment method is required")
        .isIn(["cod", "stripe"]).withMessage("Payment method must be 'cod' or 'stripe'"),
    body("shippingInfo.fullName").trim().notEmpty().withMessage("Full name is required"),
    body("shippingInfo.email").trim().notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please provide a valid email"),
    body("shippingInfo.phone").trim().notEmpty().withMessage("Phone number is required")
        .isMobilePhone("ar-EG").withMessage("Please provide a valid Egyptian phone number"),
    body("shippingInfo.address").trim().notEmpty().withMessage("Address is required"),
    body("shippingInfo.city").trim().notEmpty().withMessage("City is required"),
    body("shippingInfo.governorate").trim().notEmpty().withMessage("Governorate is required"),
    body("shippingInfo.notes").optional().trim()
];