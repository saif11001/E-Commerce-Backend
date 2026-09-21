import { Cart } from "../models/cart.model.js";

export const findCartByUser = (userId) => {
    const cart = Cart
        .findOne({ user: userId })
        .populate("items.product", "name price discountPrice images stock isActive")
        .populate("coupon", "code discountType discountValue usedBy");
    return cart;
}

export const findCartByCartId = (cartId) => {
    const cart = Cart
        .findOne({ cartId })
        .populate("items.product", "name price discountPrice images stock isActive")
        .populate("coupon", "code discountType discountValue usedBy");
    return cart;
}

export const createCart = ({ user, cartId }) => {
    const cart = Cart.create({ user, cartId, items: [] });
    return cart;
}

export const deleteCartById = (id) => {
    return Cart.findByIdAndDelete(id);
};