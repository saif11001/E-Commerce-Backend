import { body, param } from "express-validator";

const VALID_SIZES = ['One Size', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48', '50'];

export const addItemToCartValidation = [
    body("productId").notEmpty().withMessage("Product id is required")
        .isMongoId().withMessage("Invalid product id"),
    body("size").trim().notEmpty().withMessage("Size is required")
        .isIn(VALID_SIZES).withMessage("Invalid size")
];

export const updateItemQuantityValidation = [
    param("itemId").isMongoId().withMessage("Invalid item id"),
    body("action").trim().notEmpty().withMessage("Action is required")
        .isIn(["increase", "decrease"]).withMessage("Action must be 'increase' or 'decrease'")
];

export const cartItemIdValidation = [
    param("itemId").isMongoId().withMessage("Invalid item id")
];

export const applyCartCouponValidation = [
    body("code").trim().notEmpty().withMessage("Coupon code is required")
];