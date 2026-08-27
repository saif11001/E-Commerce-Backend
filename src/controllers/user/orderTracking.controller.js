import { getOrdersByTrackingTokenService, requestOrderTrackingLinkService } from "../../services/user/orderTracking.service.js";

export const requestTrackingLink = async (req, res, next) => {
    try {
        const { email } = req.body;
        await requestOrderTrackingLinkService(email);
        res.status(200).json({ success: true, message: "If this email has any orders, a tracking link has been sent to it." });
    } catch (error) {
        next(error);
    }
}

export const getOrdersByTrackingToken = async (req, res, next) => {
    try {
        const { token } = req.params;
        const orders = await getOrdersByTrackingTokenService(token);
        res.status(200).json({ success: true, orders });
    } catch (error) {
        next(error);
    }
}