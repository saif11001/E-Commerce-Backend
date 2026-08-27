import { createShippingZone, deleteShippingZoneById, findAllShippingZones, findShippingZoneByGovernorate, findShippingZoneById } from "../../repositories/shippingZone.repository.js";
import AppError from "../../utils/AppError.js";

export const createShippingZoneService = async ({ governorate, shippingCost }) => {
    const exists = await findShippingZoneByGovernorate(governorate);
    if(exists) {
        throw new AppError("Shipping zone for this governorate already exists", 400);
    }

    const zone = await createShippingZone({ governorate, shippingCost });

    return zone;
}

export const getAllShippingZonesService = async () => {
    const zones = await findAllShippingZones();
    return zones;
}

export const updateShippingZoneService = async (id, { governorate, shippingCost, isActive }) => {
    const zone = await findShippingZoneById(id);
    if(!zone) {
        throw new AppError("Shipping zone not found", 404);
    };

    if(governorate && governorate !== zone.governorate) {
        const exists = await findShippingZoneByGovernorate(governorate);
        if(exists) {
            throw new AppError("Shipping zone for this governorate already exists", 400);
        };
        zone.governorate = governorate;
    };

    if(shippingCost !== undefined) zone.shippingCost = shippingCost;
    if(isActive !== undefined) zone.isActive = isActive;

    await zone.save();
    return zone;
}


export const deleteShippingZoneService = async (id) => {
    const zone = await deleteShippingZoneById(id);
    if(!zone) {
        throw new AppError("Shipping zone not found", 404);
    };

    return zone;
}