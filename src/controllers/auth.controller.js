import { forgetPasswordService, loginService, logoutService, resetPasswordService, signupService, verifyEmailService } from "../services/auth.service.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";
import { setCookies } from "../utils/setCookies.js";

export const signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const { user, accessToken, refreshToken } = await signupService({ name, email, password })
        setCookies(res, accessToken, refreshToken);
        res.clearCookie("cartId");
        res.status(201).json({ success: true, user: sanitizeUser(user) })
    } catch (error) {
        next(error);
    }
};

export const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.body;
        const user = await verifyEmailService(token);
        res.status(200).json({ success: true, user: sanitizeUser(user) });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { cartId } = req.cookies;
        const { needsVerification, user, accessToken, refreshToken } = await loginService({ email, password, cartId });
        if(needsVerification) {
            return res.status(200).json({ 
                success: true,
                needsVerification: true,
                message: "Please verify your email first. A new code has been sent.",
                user: sanitizeUser(user)
            })
        }
        setCookies(res, accessToken, refreshToken);
        res.clearCookie("cartId");
        res.status(200).json({ success: true, user: sanitizeUser(user) });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        await logoutService(req.userId);

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        next(error);
    }
};

export const forgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        await forgetPasswordService(email);
        res.status(200).json({ success: true,  message: "Reset link sent to your email" });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const user = await resetPasswordService({ token, password });
        res.status(200).json({ success: true, message: "Password reset successful", user: sanitizeUser(user) })
    } catch (error) {
        next(error);
    }
}