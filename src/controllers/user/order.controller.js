import { getMyOrderService, getMyOrdersService } from "../../services/user/order.service.js";

export const getMyOrders = async (req, res, next) => {
    try {
        const { page = 1, limit = 10} = req.query;
        const { orders, pagination } = await getMyOrdersService(req.userId, { page, limit });
        res.status(200).json({ success: true, orders, pagination });
    } catch (error) {
        next(error);
    }
}

export const getMyOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await getMyOrderService(req.userId, id);
        res.status(200).json({ success: true, order });
    } catch (error) {
        next(error);
    }
}