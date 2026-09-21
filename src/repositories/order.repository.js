import mongoose from "mongoose";
import { Order } from "../models/order.model.js";

export const findAllOrdersPaginated = (skip, limit, filters = {}) => {
    const query = {};
    if (filters.status) query.orderStatus = filters.status;
    return Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "name email");
}

export const countAllOrders = (filters = {}) => {
    const query = {};
    if (filters.status) query.orderStatus = filters.status;
    return Order.countDocuments(query);
}

export const findOrderById = (id) => {
    return Order.findById(id)
        .populate("items.product", "name slug")
        .populate("user", "name email image");
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

export const getUserSpending = async (userId) => {
    const [result] = await Order.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId), orderStatus: { $ne: "cancelled" } } },
        { $group: { _id: null, totalSpent: { $sum: "$totalPrice" } } },
    ]);
    return result?.totalSpent || 0;
};