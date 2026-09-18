import { createCart, findCartByCartId, findCartByUser, deleteCartById } from "../../repositories/cart.repository.js";
import { findProductById } from "../../repositories/product.repository.js";
import { findShippingZoneByGovernorate } from "../../repositories/shippingZone.repository.js";
import { applyCoupon } from "./coupon.service.js";
import AppError from "../../utils/AppError.js";

const getOrCreateCart = async ({ userId, cartId }) => {
    let cart = userId ? await findCartByUser(userId) : await findCartByCartId(cartId);
    if(!cart) {
        cart = await createCart({ user: userId || null, cartId: userId ? null : cartId });
    };
    return cart; 
}

const buildCartSummary = async (cart, governorate) => {
    const itemsPrice = cart.items.reduce((total, item) => {
        const price = item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price;
        return total + price * item.quantity;
    }, 0);

    let discount = 0;
    if (cart.coupon) {
        if (cart.coupon.discountType === "percentage") {
            discount = (itemsPrice * cart.coupon.discountValue) / 100;
        } else {
            discount = cart.coupon.discountValue;
        }
        discount = Math.min(discount, itemsPrice);
    }

    let shippingCost = 0;
    if (governorate) {
        const zone = await findShippingZoneByGovernorate(governorate);
        if (zone && zone.isActive) {
            shippingCost = zone.shippingCost;
        }
    }

    const totalPrice = Math.max(itemsPrice - discount, 0) + shippingCost;

    return {
        cart,
        summary: {
            itemsPrice,
            discount,
            shippingCost,
            totalPrice
        }
    };
};

export const addItemToCartService = async ({ userId, cartId, productId, size }) => {
    const product = await findProductById(productId);
    if(!product || !product.isActive) {
        throw new AppError("Product not found", 404);
    };

    if(!product.sizes.includes(size)) {
        throw new AppError("Size not available for this product", 400);
    };

    let cart = await getOrCreateCart({ userId, cartId });

    const existingItem = cart.items.find(
        (item) =>
            item.product._id.toString() === productId &&
            item.size === size
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.items.push({ product: productId, size, quantity: 1 });
    }

    await cart.save();

    const updatedCart = userId ? await findCartByUser(userId) : await findCartByCartId(cartId);
    return buildCartSummary(updatedCart);
}

export const getCartService = async ({ userId, cartId, governorate }) => {
    const cart = await getOrCreateCart({ userId, cartId });
    return buildCartSummary(cart, governorate);
}

export const updateItemQuantityService = async ({ userId, cartId, itemId, action }) => {
    if(action !== 'increase' && action !== 'decrease') {
        throw new AppError("Action must be either 'increase' or 'decrease'", 400);
    }
    
    const cart = userId ? await findCartByUser(userId) : await findCartByCartId(cartId) ;
    if(!cart) {
        throw new AppError("Cart not found", 404);
    }

    const item = cart.items.id(itemId);
    if (!item) {
        throw new AppError("Item not found in cart", 404);
    }

    if(action === "increase") {
        item.quantity += 1;
    } else {
        item.quantity -= 1;
        if(item.quantity <= 0) {
            item.deleteOne();
        }
    }

    await cart.save();

    const updatedCart = userId ? await findCartByUser(userId) : await findCartByCartId(cartId)
    return buildCartSummary(updatedCart);
}

export const removeItemFromCartService = async ({ userId, cartId, itemId }) => {
    const cart = userId ? await findCartByUser(userId) : await findCartByCartId(cartId);
    if(!cart) {
        throw new AppError("Cart not found", 404);
    }

    const item = cart.items.id(itemId);
    if(!item) {
        throw new AppError("Item not found in cart", 404);
    }

    item.deleteOne();
    await cart.save();

    const updatedCart = userId ? await findCartByUser(userId) : await findCartByCartId(cartId);
    return buildCartSummary(updatedCart);
}

export const clearCartService = async ({ userId, cartId }) => {
    const cart = userId ? await findCartByUser(userId) : await findCartByCartId(cartId);
    if(!cart) {
        throw new AppError("Cart not found", 404);
    }

    cart.items = [];
    cart.coupon = null;
    await cart.save();
    return buildCartSummary(cart);
}

export const applyCouponService = async ({ userId, cartId, code }) => {
    const cart = userId ? await findCartByUser(userId) : await findCartByCartId(cartId);
    if (!cart) {
        throw new AppError("Cart not found", 404);
    }

    if (cart.items.length === 0) {
        throw new AppError("Your cart is empty", 400);
    }

    const itemsPrice = cart.items.reduce((total, item) => {
        const price = item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price;
        return total + price * item.quantity;
    }, 0);

    const coupon = await applyCoupon({ code, userId, orderAmount: itemsPrice });

    cart.coupon = coupon._id;
    await cart.save();

    const updatedCart = userId ? await findCartByUser(userId) : await findCartByCartId(cartId);
    return buildCartSummary(updatedCart);
};

export const removeCouponService = async ({ userId, cartId }) => {
    const cart = userId ? await findCartByUser(userId) : await findCartByCartId(cartId);
    if (!cart) {
        throw new AppError("Cart not found", 404);
    }

    cart.coupon = null;
    await cart.save();

    return buildCartSummary(cart);
}

export const mergeGuestCartIntoUserService = async ({ userId, cartId }) => {
    if(!cartId) {
        return;
    }

    const guestCart = await findCartByCartId(cartId);
    if(!guestCart || guestCart.items.length === 0) {
        return;
    }

    let userCart = await findCartByUser(userId);
    if(!userCart) {
        guestCart.user = userId;
        guestCart.cartId = null;
        await guestCart.save();
        return;
    }

    guestCart.items.forEach((guestItem) => {
        const existingItem = userCart.items.find(
            (item) =>
                item.product._id.toString() === guestItem.product._id.toString() &&
                item.size === guestItem.size
        );

        if (existingItem) {
            existingItem.quantity += guestItem.quantity;
        } else {
            userCart.items.push({
                product: guestItem.product._id,
                size: guestItem.size,
                quantity: guestItem.quantity
            });
        }
    });

    await userCart.save();
    await deleteCartById(guestCart._id);
}