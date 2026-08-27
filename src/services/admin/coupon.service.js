import { createCoupon, deleteCouponById, findAllCoupons, findCouponByCode, findCouponById } from "../../repositories/coupon.repository.js";
import AppError from "../../utils/AppError.js";

export const createCouponService = async ({ code, discountType, discountValue, minOrderAmount, expiresAt, usageLimit }) => {
    const couponExists = await findCouponByCode(code);
    if(couponExists) {
        throw new AppError("Coupon code already exists", 400);
    }

    if(discountType === 'percentage' && ( discountValue <= 0 || discountValue > 100 )) {
        throw new AppError("Percentage discount must be between 1 and 100", 400);
    }
    
    if(discountType === 'fixed' && discountValue <= 0) {
        throw new AppError("Fixed discount must be greater than 0", 400);
    }
    
    const coupon = await createCoupon({ code, discountType, discountValue, minOrderAmount, expiresAt, usageLimit });

    return coupon;
}

export const getAllCouponsService = async () => {
    const coupons = await findAllCoupons();
    return coupons;
}

export const getCouponService = async (id) => {
    const coupon = await findCouponById(id);
    if(!coupon) {
        throw new AppError("Coupon not found", 404);
    }
    return coupon;
}

export const updateCouponService = async (id, { code, discountType, discountValue, minOrderAmount, expiresAt, usageLimit, isActive }) => {
    const coupon = await findCouponById(id);
    if(!coupon) {
        throw new AppError("Coupon not found", 404);
    }

    if(discountType && discountType !== coupon.discountType && discountValue === undefined) {
        throw new AppError("Please provide discountValue when changing discountType", 400);
    }

    if(code && code.toUpperCase() !== coupon.code ) {
        const existingCoupon = await findCouponByCode(code);
        if(existingCoupon) {
            throw new AppError("Coupon code already exists", 400);
        }
        coupon.code = code
    }

    if(discountType) coupon.discountType = discountType;
    if(discountValue !== undefined) coupon.discountValue = discountValue;
    if(minOrderAmount !== undefined) coupon.minOrderAmount = minOrderAmount;
    if(expiresAt) coupon.expiresAt = expiresAt;
    if(usageLimit !== undefined) coupon.usageLimit = usageLimit;
    if(isActive !== undefined) coupon.isActive = isActive;

    await coupon.save();
    return coupon;
}

export const deleteCouponService = async (id) => {
    const coupon = await deleteCouponById(id);
    if(!coupon) {
        throw new AppError("Coupon not found", 404);
    };
    return coupon;
}