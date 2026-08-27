import { getAllOrdersService, getOrderService, updateOrderStatusService } from "../../services/admin/order.service.js";

export const getAllOrders = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const { orders, pagination } = await getAllOrdersService({ page, limit });
        res.status(200).json({ success: true, orders, pagination })
    } catch (error) {
        next(error);
    }
};

export const getOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await getOrderService(id);
        res.status(200).json({ success: true, order });
    } catch (error) {
        next(error);
    }
};

export const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { orderStatus } = req.body;
        const order = await updateOrderStatusService(id, orderStatus);
        res.status(200).json({ success: true, order });
    } catch (error) {
        next(error);
    }
}