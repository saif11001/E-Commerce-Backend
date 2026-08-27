import mongoose from "mongoose";

const pendingCheckoutSchema = new mongoose.Schema(
    {
        stripePaymentIntentId: {
            type: String,
            required: true,
            unique: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        cartId: {
            type: String,
            default: null
        },
        items: [
            {
                product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
                name: { type: String, required: true },
                price: { type: Number, required: true },
                quantity: { type: Number, required: true },
                size: { type: String, required: true },
                image: { type: String }
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
        coupon: {
            couponId: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon", default: null },
            code: { type: String, default: null },
            discount: { type: Number, default: 0 }
        },
        itemsPrice: { type: Number, required: true },
        shippingPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true }
    },
    {
        timestamps: true
    }
);

pendingCheckoutSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

export const PendingCheckout = mongoose.model("PendingCheckout", pendingCheckoutSchema);