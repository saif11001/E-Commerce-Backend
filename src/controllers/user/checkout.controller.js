import { processCodCheckoutService, createStripePaymentIntentService, getCheckoutPreviewService } from "../../services/user/checkout.service.js";

export const checkout = async (req, res, next) => {
    try {
        const { paymentMethod, shippingInfo } = req.body;
        const { userId, cartId } = req;

        if (paymentMethod === "cod") {
            const order = await processCodCheckoutService({ userId, cartId, shippingInfo });
            return res.status(201).json({ success: true, order });
        }

        if (paymentMethod === "stripe") {
            const { clientSecret } = await createStripePaymentIntentService({ userId, cartId, shippingInfo });
            return res.status(200).json({ success: true, clientSecret });
        }

        return res.status(400).json({ success: false, message: "Invalid payment method" });
    } catch (error) {
        next(error);
    }
};

export const getCheckoutPreview = async (req, res, next) => {
    try {
        const { shippingInfo } = req.body;
        const { userId, cartId } = req;
        const preview = await getCheckoutPreviewService({ userId, cartId, shippingInfo });
        res.status(200).json({ success: true, preview });
    } catch (error) {
        next(error);
    }
};