import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        cartId: {
            type: String,
            default: null
        },
        coupon: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Coupon",
            default: null
        },
        governorate: {
            type: String,
            default: null
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                size: {
                    type: String,
                    enum: ['One Size', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48', '50'],
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                    default: 1
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

cartSchema.index(
    { user: 1 },
    { unique: true, partialFilterExpression: { user: { $type: "objectId" } } }
);

cartSchema.index(
    { cartId: 1 },
    { unique: true, partialFilterExpression: { cartId: { $type: "string" } } }
);

export const Cart = mongoose.model("Cart", cartSchema);