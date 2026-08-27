import { ShippingZone } from "../models/shippingZone.model.js"

export const findShippingZoneByGovernorate = (governorate) => {
    return ShippingZone.findOne({ governorate });
};

export const createShippingZone = ({ governorate, shippingCost }) => {
    return ShippingZone.create({ governorate, shippingCost });
};

export const findAllShippingZones = () => {
    return ShippingZone.find().sort({ governorate: 1 });
};

export const findShippingZoneById = (id) => {
    return ShippingZone.findById(id);
};

export const deleteShippingZoneById = (id) => {
    return ShippingZone.findByIdAndDelete(id);
};

export const findActiveShippingZones = () => {
    return ShippingZone.find({isActive: true}).sort({ governorate: 1 });
};