import { param, query } from "express-validator";

export const userIdValidation = [
    param("userId").isMongoId().withMessage("Invalid user id")
];

export const getAllUsersValidation = [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive number"),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100")
];