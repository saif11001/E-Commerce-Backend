import express from "express";

import { verifyToken } from "../../middlewares/verifyToken.js";
import { authorize } from "../../middlewares/authorize.js";
import { createCoupon, deleteCoupon, getAllCoupons, getCoupon, updateCoupon } from "../../controllers/admin/coupon.controller.js";
import { validate } from "../../middlewares/validate.js";
import { createCouponValidation, updateCouponValidation, couponIdValidation } from "../../validations/coupon.validation.js";

const router = express.Router();

router.post('/', verifyToken, authorize("admin", "manager"), createCouponValidation, validate, createCoupon);

router.get('/', verifyToken, authorize("admin", "manager"), getAllCoupons);

router.get('/:id', verifyToken, authorize("admin", "manager"), couponIdValidation, validate, getCoupon);

router.patch('/:id', verifyToken, authorize("admin", "manager"), updateCouponValidation, validate, updateCoupon);

router.delete('/:id', verifyToken, authorize("admin"), couponIdValidation, validate, deleteCoupon);

export default router;