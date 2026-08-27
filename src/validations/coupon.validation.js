import { body, param } from "express-validator";

export const createCouponValidation = [
    body("code").trim().notEmpty().withMessage("Coupon code is required")
        .isLength({ min: 3, max: 20 }).withMessage("Code must be between 3 and 20 characters"),
    body("discountType").notEmpty().withMessage("Discount type is required")
        .isIn(["percentage", "fixed"]).withMessage("Discount type must be 'percentage' or 'fixed'"),
    body("discountValue").notEmpty().withMessage("Discount value is required")
        .isFloat({ min: 0 }).withMessage("Discount value must be a positive number"),
    body("minOrderAmount").optional().isFloat({ min: 0 }).withMessage("Minimum order amount must be a positive number"),
    body("expiresAt").notEmpty().withMessage("Expiry date is required")
        .isISO8601().withMessage("Expiry date must be a valid date")
        .custom((value) => new Date(value) > new Date()).withMessage("Expiry date must be in the future"),
    body("usageLimit").notEmpty().withMessage("Usage limit is required")
        .isInt({ min: 1 }).withMessage("Usage limit must be at least 1")
];

export const updateCouponValidation = [
    param("id").isMongoId().withMessage("Invalid coupon id"),
    body("code").optional().trim().isLength({ min: 3, max: 20 }).withMessage("Code must be between 3 and 20 characters"),
    body("discountType").optional().isIn(["percentage", "fixed"]).withMessage("Discount type must be 'percentage' or 'fixed'"),
    body("discountValue").optional().isFloat({ min: 0 }).withMessage("Discount value must be a positive number"),
    body("minOrderAmount").optional().isFloat({ min: 0 }).withMessage("Minimum order amount must be a positive number"),
    body("expiresAt").optional().isISO8601().withMessage("Expiry date must be a valid date"),
    body("usageLimit").optional().isInt({ min: 1 }).withMessage("Usage limit must be at least 1"),
    body("isActive").optional().isBoolean().withMessage("isActive must be true or false")
];

export const couponIdValidation = [
    param("id").isMongoId().withMessage("Invalid coupon id")
];

export const applyCouponValidation = [
    body("code").trim().notEmpty().withMessage("Coupon code is required")
];