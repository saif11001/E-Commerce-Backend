import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                name: { type: String, required: true },
                price: { type: Number, required: true },
                quantity: { type: Number, required: true },
                size: { type: String, required: true },
                image: { type: String, required: true }
            }
        ],
        shippingInfo: {
            fullName: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            governorate: { type: String, required: true },
            notes: { type: String }
        },
        paymentMethod: {
            type: String,
            enum: ["cod", "stripe"],
            required: true
        },
        isPaid: {
            type: Boolean,
            default: false
        },
        paidAt: {
            type: Date
        },
        stripePaymentIntentId: {
            type: String
        },
        coupon: {
            couponId: { 
                type: mongoose.Schema.Types.ObjectId,
                ref: "Coupon",
                default: null
            },
            code: { type: String, default: null },
            discount: { type: Number, default: 0 }
        },
        itemsPrice: {
            type: Number,
            required: true
        },
        shippingPrice: {
            type: Number,
            required: true,
            default: 0
        },
        totalPrice: {
            type: Number,
            required: true
        },
        orderStatus: {
            type: String,
            enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

orderSchema.index({ user: 1, createdAt: -1 });

export const Order = mongoose.model("Order", orderSchema);