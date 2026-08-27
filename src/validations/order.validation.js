import { body, param, query } from "express-validator";

export const orderIdValidation = [
    param("id").isMongoId().withMessage("Invalid order id")
];

export const updateOrderStatusValidation = [
    param("id").isMongoId().withMessage("Invalid order id"),
    body("orderStatus").trim().notEmpty().withMessage("Order status is required")
        .isIn(["pending", "confirmed", "shipped", "delivered", "cancelled"]).withMessage("Invalid order status")
];

export const getOrdersValidation = [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive number"),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100")
];

export const requestTrackingLinkValidation = [
    body("email").trim().notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please provide a valid email")
];

export const trackingTokenValidation = [
    param("token").trim().notEmpty().withMessage("Token is required")
];