import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },
        discountType: {
            type: String,
            enum: ["percentage", "fixed"],
            required: true
        },
        discountValue: {
            type: Number,
            required: true,
            min: 0
        },
        minOrderAmount: {
            type: Number,
            required: true,
            default: 0,
            min: 0
        },
        expiresAt: {
            type: Date,
            required: true
        },
        usageLimit: {
            type: Number,
            required: true,
            min: 1
        },
        usedCount: {
            type: Number,
            default: 0
        },
        usedBy: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    default: null
                },
                email: {
                    type: String,
                    lowercase: true,
                    trim: true,
                    default: null
                }
            }
        ],
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

export const Coupon = mongoose.model("Coupon", couponSchema);