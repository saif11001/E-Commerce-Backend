import express from 'express';
import { attachCartContext } from "../../middlewares/attachCartContext.js";
import { addItemToCart, applyCoupon, clearCart, getCart, removeCoupon, removeItemFromCart, updateItemQuantity } from '../../controllers/user/cart.controller.js';
import { moderateLimiter } from '../../middlewares/rateLimiter.js';
import { validate } from "../../middlewares/validate.js";
import { addItemToCartValidation, updateItemQuantityValidation, cartItemIdValidation, applyCartCouponValidation } from "../../validations/cart.validation.js";

const router = express.Router();

router.post("/items", attachCartContext, addItemToCartValidation, validate, addItemToCart);

router.get("/", attachCartContext, getCart);

router.patch("/items/:itemId", attachCartContext, updateItemQuantityValidation, validate, updateItemQuantity);

router.delete("/items/:itemId", attachCartContext, cartItemIdValidation, validate, removeItemFromCart);

router.delete("/", attachCartContext, clearCart);

router.post('/apply-coupon', attachCartContext, moderateLimiter, applyCartCouponValidation, validate, applyCoupon);

router.delete('/coupon', attachCartContext, removeCoupon);

export default router;