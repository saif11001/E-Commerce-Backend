import { Order } from "../models/order.model.js";

export const findAllOrdersPaginated = (skip, limit) => {
    return Order.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
}

export const countAllOrders = () => {
    return Order.countDocuments();
}

export const findOrderById = (id) => {
    return Order.findById(id).populate("items.product", "name slug");
}

export const findOrdersByEmail = (email) => {
    return Order.find({ "shippingInfo.email": email }).sort({ createdAt: -1 });
}

export const createOrder = (data) => {
    return Order.create(data);
}

export const findOrdersByUser = (userId, skip, limit) => {
    return Order.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit);
}

export const countOrdersByUser = (userId) => {
    return Order.countDocuments({ user: userId });
}

export const updateOrderStatusById = (id, orderStatus) => {
    return Order.findByIdAndUpdate(id, { orderStatus }, { new: true });
}

export const findOrderByPaymentIntentId = (stripePaymentIntentId) => {
    return Order.findOne({ stripePaymentIntentId });
};