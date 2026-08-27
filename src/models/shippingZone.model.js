import mongoose from "mongoose";

const shippingZoneSchema = new mongoose.Schema(
    {
        governorate: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        shippingCost: {
            type: Number,
            required: true,
            min: 0
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

export const ShippingZone = mongoose.model("ShippingZone", shippingZoneSchema);