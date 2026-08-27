import { validationResult } from "express-validator";
import AppError from "../utils/AppError.js";

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array()[0];
        throw new AppError(firstError.msg, 400);
    }
    next();
};