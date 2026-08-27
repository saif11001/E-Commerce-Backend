import { createCouponService, deleteCouponService, getAllCouponsService, getCouponService, updateCouponService } from "../../services/admin/coupon.service.js";

export const createCoupon = async (req, res, next) => {
    try {
        const { code, discountType, discountValue, minOrderAmount, expiresAt, usageLimit } = req.body;
        const coupon = await createCouponService({ code, discountType, discountValue, minOrderAmount, expiresAt, usageLimit });
        res.status(201).json({ success: true, coupon });
    } catch (error) {
        next(error);
    }
}

export const getAllCoupons = async (req, res, next) => {
    try {
        const coupons = await getAllCouponsService();
        res.status(200).json({ success: true, coupons});
    } catch (error) {
        next(error);
    }
}

export const getCoupon = async (req, res, next) => {
    try {
        const { id } = req.params;
        const coupon = await getCouponService(id);
        res.status(200).json({ success: true, coupon });
    } catch (error) {
        next(error);
    }
}

export const updateCoupon = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { code, discountType, discountValue, minOrderAmount, expiresAt, usageLimit, isActive } = req.body || {};
        const coupon = await updateCouponService(id, { code, discountType, discountValue, minOrderAmount, expiresAt, usageLimit, isActive });
        res.status(200).json({ success: true, coupon });
    } catch (error) {
        next(error);
    }
}

export const deleteCoupon = async (req, res, next) => {
    try {
        const { id } = req.params;
        const coupon = await deleteCouponService(id);
        res.status(200).json({ success: true, message: "Coupon deleted successfully" });
    } catch (error) {
        next(error);
    }
}

