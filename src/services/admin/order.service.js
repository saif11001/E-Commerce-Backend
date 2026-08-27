import { countAllOrders, findAllOrdersPaginated, findOrderById } from "../../repositories/order.repository.js";
import { incrementProductStock } from "../../repositories/product.repository.js";
import AppError from "../../utils/AppError.js";

const VALID_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export const getAllOrdersService = async ({ page = 1, limit = 10 }) => {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
        findAllOrdersPaginated(skip, limit),
        countAllOrders()
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

export const getOrderService = async (id) => {
    const order = await findOrderById(id);
    if (!order) {
        throw new AppError("Order not found", 404);
    }
    return order;
};

export const updateOrderStatusService = async (id, orderStatus) => {
    if (!VALID_STATUSES.includes(orderStatus)) {
        throw new AppError("Invalid order status", 400);
    }

    const order = await findOrderById(id);
    if (!order) {
        throw new AppError("Order not found", 404);
    }

    if (order.orderStatus === "cancelled") {
        throw new AppError("Cannot change status of a cancelled order", 400);
    }
    if (order.orderStatus === "delivered" && orderStatus !== "delivered") {
        throw new AppError("Cannot change status of a delivered order", 400);
    }

    if (orderStatus === "cancelled" && order.orderStatus !== "cancelled") {
        for (const item of order.items) {
            await incrementProductStock(item.product, item.quantity);
        }
    }

    order.orderStatus = orderStatus;
    await order.save();
    return order;
};