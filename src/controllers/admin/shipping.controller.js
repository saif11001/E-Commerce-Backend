import { createShippingZoneService, deleteShippingZoneService, getAllShippingZonesService, updateShippingZoneService } from "../../services/admin/shipping.service.js";

export const createShippingZone = async (req, res, next) => {
    try {
        const { governorate, shippingCost } = req.body;
        const zone = await createShippingZoneService({ governorate, shippingCost });
        res.status(201).json({ success: true, zone });
    } catch (error) {
        next(error);
    }
}

export const getAllShippingZone = async (req, res, next) => {
    try {
        const zones = await getAllShippingZonesService();
        res.status(200).json({ success: true, zones })
    } catch (error) {
        next(error);
    }
}

export const updateShippingZone = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { governorate, shippingCost, isActive } = req.body || {};
        const zone = await updateShippingZoneService(id, { governorate, shippingCost, isActive });
        res.status(200).json({ success: true, zone });
    } catch (error) {
        next(error);
    }
}

export const deleteShippingZone = async (req, res, next) => {
    try {
        const { id } = req.params;
        const cart = await deleteShippingZoneService(id);
        res.status(200).json({ success: true, message: "Shipping zone deleted successfully"});
    } catch (error) {
        next(error);
    }
}