import { getActiveShippingZonesService } from "../../services/user/shipping.service.js";

export const getActiveShippingZones = async (req, res, next) => {
    try {
        const zones = await getActiveShippingZonesService();
        res.status(200).json({ success: true, zones });
    } catch (error) {
        next(error);
    }
}