import { Coupon } from "../models/coupon.model.js"

export const findCouponByCode = (code) => {
    const coupon = Coupon.findOne({ code: code.toUpperCase() });
    return coupon;
};

export const createCoupon = ({ code, discountType, discountValue, minOrderAmount, expiresAt, usageLimit }) => {
    const coupon = Coupon.create({ code, discountType, discountValue, minOrderAmount, expiresAt, usageLimit });
    return coupon;
}

export const findAllCoupons = () => {
    const coupons = Coupon.find().sort({ createdAt: -1 });
    return coupons;
}

export const findCouponById = (id) => {
    const coupon = Coupon.findById(id);
    return coupon;
}

export const deleteCouponById = (id) => {
    const coupon = Coupon.findByIdAndDelete(id);
    return coupon;
}

export const registerCouponUsage = (couponId, { userId, email }) => {
    return Coupon.findByIdAndUpdate(
        couponId,
        {
            $inc: { usedCount: 1 },
            $push: { usedBy: { userId: userId || null, email: email || null } }
        },
        { new: true }
    );
}