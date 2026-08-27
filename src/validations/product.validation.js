import { body, param, query } from "express-validator";

const VALID_SIZES = ['One Size', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48', '50'];

export const createProductValidation = [
    body("name").trim().notEmpty().withMessage("Product name is required"),
    body("shortDescription").trim().notEmpty().withMessage("Short description is required")
        .isLength({ max: 300 }).withMessage("Short description cannot exceed 300 characters"),
    body("longDescription").trim().notEmpty().withMessage("Long description is required"),
    body("price").notEmpty().withMessage("Price is required")
        .isFloat({ min: 0 }).withMessage("Price must be a positive number"),
    body("discountPrice").optional()
        .isFloat({ min: 0 }).withMessage("Discount price must be a positive number"),
    body("images").isArray({ min: 1 }).withMessage("At least one image is required"),
    body("category").notEmpty().withMessage("Category is required")
        .isMongoId().withMessage("Invalid category id"),
    body("stock").notEmpty().withMessage("Stock is required")
        .isInt({ min: 0 }).withMessage("Stock must be a positive number"),
    body("sizes").isArray({ min: 1 }).withMessage("At least one size is required"),
    body("sizes.*").isIn(VALID_SIZES).withMessage("Invalid size provided"),
    body("colors").optional().isArray(),
    body("isFeatured").optional().isBoolean().withMessage("isFeatured must be true or false")
];

export const updateProductValidation = [
    param("id").isMongoId().withMessage("Invalid product id"),
    body("price").optional().isFloat({ min: 0 }).withMessage("Price must be a positive number"),
    body("discountPrice").optional().isFloat({ min: 0 }).withMessage("Discount price must be a positive number"),
    body("category").optional().isMongoId().withMessage("Invalid category id"),
    body("stock").optional().isInt({ min: 0 }).withMessage("Stock must be a positive number"),
    body("sizes").optional().isArray({ min: 1 }).withMessage("At least one size is required"),
    body("sizes.*").optional().isIn(VALID_SIZES).withMessage("Invalid size provided"),
    body("isFeatured").optional().isBoolean().withMessage("isFeatured must be true or false"),
    body("isActive").optional().isBoolean().withMessage("isActive must be true or false")
];

export const productIdValidation = [
    param("id").isMongoId().withMessage("Invalid product id")
];

export const productSlugValidation = [
    param("slug").trim().notEmpty().withMessage("Slug is required")
];

export const getAllProductsValidation = [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive number"),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
    query("minPrice").optional().isFloat({ min: 0 }).withMessage("minPrice must be a positive number"),
    query("maxPrice").optional().isFloat({ min: 0 }).withMessage("maxPrice must be a positive number")
];

export const categoryIdParamValidation = [
    param("categoryId").isMongoId().withMessage("Invalid category id")
];