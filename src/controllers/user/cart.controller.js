import { addItemToCartService, applyCouponService, clearCartService, getCartService, mergeGuestCartIntoUserService, removeCouponService, removeItemFromCartService, updateItemQuantityService } from "../../services/user/cart.service.js";

export const addItemToCart = async (req, res, next) => {
    try {
        const { productId, size } = req.body;
        const cart = await addItemToCartService({
            userId: req.userId,
            cartId: req.cartId,
            productId,
            size
        });
        res.status(201).json({ success: true, cart });
    } catch (error) {
        next(error);
    }
}

export const getCart = async (req, res, next) => {
    try {
        const { governorate } = req.query;
        const userId = req.userId;
        const cartId = req.cartId;
        const cart = await getCartService({ userId, cartId, governorate });
        res.status(200).json({ success: true, cart });
    } catch (error) {
        next(error);
    }
}

export const updateItemQuantity = async (req, res, next) => {
    try {
        const { itemId } = req.params;
        const { action } = req.body;
        const userId = req.userId;
        const cartId = req.cartId;
        const cart = await updateItemQuantityService({ userId, cartId, itemId, action });
        res.status(200).json({ success: true, cart });
    } catch (error) {
        next(error);
    }
}

export const removeItemFromCart = async (req, res, next) => {
    try {
        const userId = req.userId;
        const cartId = req.cartId;
        const { itemId } = req.params;
        const cart = await removeItemFromCartService({ userId, cartId, itemId });
        res.status(200).json({ success: true, cart });
    } catch (error) {
        next(error);
    }
}

export const clearCart = async (req, res, next) => {
    try {
        const userId = req.userId;
        const cartId = req.cartId;
        const cart = await clearCartService({ userId, cartId });
        res.status(200).json({ success: true, cart });
    } catch (error) {
        next(error);
    }
}

export const applyCoupon = async (req, res, next) => {
    try {
        const { code } = req.body;
        const cart = await applyCouponService({ userId: req.userId, cartId: req.cartId, code });
        res.status(200).json({ success: true, cart });
    } catch (error) {
        next(error);
    }
}

export const removeCoupon = async (req, res, next) => {
    try {
        const cart = await removeCouponService({ userId: req.userId, cartId: req.cartId });
        res.status(200).json({ success: true, cart });
    } catch (error) {
        next(error);
    }
}

export const mergeGuestCart = async (req, res, next) => {
    try {
        await mergeGuestCartIntoUserService({ userId: req.userId, cartId: req.cartId });
        res.clearCookie("cartId");
        res.status(200).json({ success: true, message: "Cart merged successfully" });
    } catch (error) {
        next(error);
    }
};