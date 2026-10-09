import { body, param } from "express-validator";

export const signupValidation = [
    body("name").trim().notEmpty().withMessage("Name is required")
        .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
    body("email").trim().notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
];

export const loginValidation = [
    body("email").trim().notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required")
];

export const verifyEmailValidation = [
    body("email").trim().notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please provide a valid email"),
    body("token").trim().notEmpty().withMessage("Verification code is required")
        .isLength({ min: 6, max: 6 }).withMessage("Verification code must be 6 digits")
];

export const forgetPasswordValidation = [
    body("email").trim().notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please provide a valid email")
];

export const resetPasswordValidation = [
    param("token").trim().notEmpty().withMessage("Reset token is required"),
    body("password").notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
];