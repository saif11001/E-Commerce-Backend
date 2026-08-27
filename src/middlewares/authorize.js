import AppError from "../utils/AppError.js";
import { findUserById } from "../repositories/user.repository.js";

export const authorize = (...roles) => {
    return async (req, res, next) => {
        try {
            const user = await findUserById(req.userId);

            if (!user || !roles.includes(user.role)) {
                throw new AppError("You are not authorized to perform this action", 403);
            }

            req.userRole = user.role;
            next();
        } catch (error) {
            next(error);
        }
    };
};