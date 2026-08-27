import AppError from "../../utils/AppError.js";
import { findOrdersByUser, countOrdersByUser, findOrderById } from "../../repositories/order.repository.js";

export const getMyOrdersService = async (userId, { page = 1, limit = 10 }) => {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
        findOrdersByUser(userId, skip, limit),
        countOrdersByUser(userId)
    ]);

    return {
        orders,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit)
        }
    };
};

export const getMyOrderService = async (userId, orderId) => {
    const order = await findOrderById(orderId);
    if (!order) {
        throw new AppError("Order not found", 404);
    }

    if (!order.user || order.user.toString() !== userId) {
        throw new AppError("You are not authorized to view this order", 403);
    }

    return order;
};