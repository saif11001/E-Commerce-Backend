import { body, param } from "express-validator";

export const createShippingZoneValidation = [
    body("governorate").trim().notEmpty().withMessage("Governorate is required"),
    body("shippingCost").notEmpty().withMessage("Shipping cost is required")
        .isFloat({ min: 0 }).withMessage("Shipping cost must be a positive number")
];

export const updateShippingZoneValidation = [
    param("id").isMongoId().withMessage("Invalid shipping zone id"),
    body("governorate").optional().trim().notEmpty().withMessage("Governorate cannot be empty"),
    body("shippingCost").optional().isFloat({ min: 0 }).withMessage("Shipping cost must be a positive number"),
    body("isActive").optional().isBoolean().withMessage("isActive must be true or false")
];

export const shippingZoneIdValidation = [
    param("id").isMongoId().withMessage("Invalid shipping zone id")
];