import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import { createUser, findUserByEmail, findUserByResetToken, findUserByVerificationToken, updateUserPassword, verifyUserById } from "../repositories/user.repository.js";
import { generateTokens } from "../utils/generateTokens.js";
import { deleteRefreshToken, storeRefreshToken } from "../utils/storeRefreshToken.js";
import { sendPasswordChangedEmail, sendResetPasswordEmail, sendVerificationEmail, sendWelcomeEmail } from "../nodemailer/emails.js";
import AppError from "../utils/AppError.js";
import { mergeGuestCartIntoUserService } from "./user/cart.service.js";

export const signupService = async ({name, email, password, cartId }) => {
    const existingUser = await findUserByEmail(email);
    if(existingUser) {
        throw new AppError("User Already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await createUser({
        email,
        name,
        password: hashedPassword,
        role: "user",
        verificationToken,
        verificationExpiresAt: Date.now() + 15 * 60 * 1000
    });

    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);
    try {
        await sendVerificationEmail({ email, name, token: verificationToken });
    } catch (emailError) {
        console.error("Failed to send verification email:", emailError.message);
    }

    try {
        await mergeGuestCartIntoUserService({ userId: user._id.toString(), cartId });
    } catch (mergeError) {
        console.log("Failed to merge guest cart:", mergeError.message);
    }
    return {user, accessToken, refreshToken};
}

export const verifyEmailService = async (token) => {
    const user = await findUserByVerificationToken(token);
    if(!user) {
        throw new AppError("Invalid or expired verification code", 400);
    }

    const verifiedUser = await verifyUserById(user._id);
    try {
        await sendWelcomeEmail({ email: verifiedUser.email, name: verifiedUser.name});
    } catch (emailError) {
        console.error("Failed to send send welcome email:", emailError.message);
    }

    return verifiedUser;
}

export const loginService = async ({email, password, cartId}) => {
    const user = await findUserByEmail(email);
    if(!user) {
        throw new AppError("Email not found", 401);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect) {
        throw new AppError("Wrong password", 401);
    }

    if (!user.isVerified) {
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        user.verificationToken = verificationToken;
        user.verificationExpiresAt = Date.now() + 15 * 60 * 1000
        await user.save();

        try {
            await sendVerificationEmail({ email, name: user.name, token: verificationToken });
        } catch (emailError) {
            console.error("Failed to send verification email:", emailError.message);
        }

        return { needsVerification: true, user };
    }

    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);
    user.lastLogin = Date.now();
    await user.save();

    try {
        await mergeGuestCartIntoUserService({ userId: user._id.toString(), cartId });
    } catch (mergeError) {
        console.log("Failed to merge guest cart:", mergeError.message);
    }
    
    return { needsVerification: false, user, accessToken, refreshToken };
}

export const logoutService = async (userId) => {
    if(!userId) {
        return;
    }
    try {
        await deleteRefreshToken(userId);
    } catch (error) {
        return;
    }
}

export const forgetPasswordService = async(email) => {
    const user = await findUserByEmail(email);
    if(!user) {
        throw new AppError("No account found with this email", 404);
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiresAt = Date.now() + 15 * 60 * 1000;
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt

    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    
    try {
        await sendResetPasswordEmail({ email: user.email, name: user.name, resetLink });
    } catch (emailError) {
        console.error("Failed to send reset password email:", emailError.message);
    }
}

export const resetPasswordService = async({ token, password }) => {
    const user = await findUserByResetToken(token);
    if(!user) {
        throw new AppError("Invalid or expired reset link", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const updatedUser = await updateUserPassword(user._id, hashedPassword);
    await deleteRefreshToken(user._id.toString());
    
    try {
        await sendPasswordChangedEmail({ email: updatedUser.email, name: updatedUser.name });    
    } catch (emailError) {
        console.error("Failed to send password changed email:", emailError.message);
    }

    return updatedUser;
}

export const generateChatTokenService = (userId) => {
    const chatToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN, { expiresIn: '1h' });
    return chatToken;
}