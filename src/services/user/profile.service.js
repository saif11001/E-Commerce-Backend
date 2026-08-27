import bcrypt from "bcryptjs";
import AppError from "../../utils/AppError.js"
import { findUserById } from "../../repositories/user.repository.js"
import { deleteRefreshToken } from "../../utils/storeRefreshToken.js";

export const getProfileService = async (userId) => {
    const user = await findUserById(userId);
    if(!user) {
        throw new AppError("User not found", 404);
    }
    return user;
}

export const updateProfileService = async (userId, { name, currentPassword, newPassword }) => {
    if (!name && !newPassword) {
        throw new AppError("Please provide at least one field to update", 400);
    }
    
    const user = await findUserById(userId);
    if(!user) {
        throw new AppError("User not found", 404);
    }

    if(name !== undefined) {user.name = name};
    
    if(newPassword !== undefined) {
        if(!currentPassword) {
            throw new AppError("Current password is required to set a new password", 400);
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            throw new AppError("Current password is incorrect", 401);
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;
        await deleteRefreshToken(userId);
    }
    
    await user.save();
    return user;
}