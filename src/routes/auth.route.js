import express from "express";
import { forgetPassword, login, logout, resetPassword, signup, verifyEmail } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { authLimiter } from "../middlewares/rateLimiter.js";
import { validate } from "../middlewares/validate.js";
import { signupValidation, loginValidation, verifyEmailValidation, forgetPasswordValidation, resetPasswordValidation } from "../validations/auth.validation.js";

const router = express.Router();

router.post('/signup', authLimiter, signupValidation, validate, signup);

router.post('/verify-email', authLimiter, verifyEmailValidation, validate, verifyEmail);

router.post('/login', authLimiter, loginValidation, validate, login);

router.post('/logout', verifyToken, logout);

router.post('/forget-password', authLimiter, forgetPasswordValidation, validate, forgetPassword);

router.post('/reset-password/:token', authLimiter, resetPasswordValidation, validate, resetPassword);

export default router;