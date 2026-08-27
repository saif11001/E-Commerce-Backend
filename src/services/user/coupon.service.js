import { findCouponByCode } from "../../repositories/coupon.repository.js";
import AppError from "../../utils/AppError.js";

export const applyCoupon = async ({ code, userId, email, orderAmount }) => {
    if(!code) {
        throw new AppError("Coupon code is required", 400);
    }

    const coupon = await findCouponByCode(code);
    if(!coupon) {
        throw new AppError("Invalid coupon code", 404);
    }

    if(!coupon.isActive) {
        throw new AppError("This coupon is no longer active", 400);
    }

    if (coupon.expiresAt < Date.now()) {
        throw new AppError("This coupon has expired", 400);
    }

    if (coupon.usedCount >= coupon.usageLimit) {
        throw new AppError("This coupon has reached its usage limit", 400);
    }

    if (orderAmount !== undefined && orderAmount < coupon.minOrderAmount) {
        throw new AppError(`Minimum order amount for this coupon is ${coupon.minOrderAmount}`, 400);
    }
    
    const alreadyUsed = coupon.usedBy.some((entry) => {
        if (userId && entry.userId) {
            return entry.userId.toString() === userId;
        }
        if (email && entry.email) {
            return entry.email === email.toLowerCase();
        }
        return false;
    });

    if (alreadyUsed) {
        throw new AppError("You have already used this coupon", 400);
    }

    return coupon;
};