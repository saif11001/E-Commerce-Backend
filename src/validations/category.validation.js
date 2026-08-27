import { body, param } from "express-validator";

export const createCategoryValidation = [
    body("name").trim().notEmpty().withMessage("Category name is required")
        .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
    body("image").notEmpty().withMessage("Category image is required"),
    body("description").trim().notEmpty().withMessage("Description is required")
        .isLength({ max: 300 }).withMessage("Description cannot exceed 300 characters")
];

export const updateCategoryValidation = [
    param("id").isMongoId().withMessage("Invalid category id"),
    body("name").optional().trim()
        .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
    body("description").optional().trim()
        .isLength({ max: 300 }).withMessage("Description cannot exceed 300 characters"),
    body("isActive").optional().isBoolean().withMessage("isActive must be true or false")
];

export const categoryIdValidation = [
    param("id").isMongoId().withMessage("Invalid category id")
];