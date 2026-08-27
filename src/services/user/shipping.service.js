import { findActiveShippingZones } from "../../repositories/shippingZone.repository.js";

export const getActiveShippingZonesService = async () => {
    const zones = await findActiveShippingZones();
    return zones;
}