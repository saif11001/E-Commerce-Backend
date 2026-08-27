import { body } from "express-validator";

export const updateProfileValidation = [
    body("name").optional().trim()
        .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
    body("newPassword").optional()
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
    body("currentPassword")
        .if(body("newPassword").exists())
        .notEmpty().withMessage("Current password is required to set a new password")
];