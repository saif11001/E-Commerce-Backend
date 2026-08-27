import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        slug: {
            type: String,
            required: true,
            unique: true
        },
        shortDescription: {
            type: String,
            required: true,
            maxlength: 300
        },
        longDescription: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        discountPrice: {
            type: Number,
            default: 0,
            min: 0
        },
        images: [
            {
                url: {type: String, required: true},
                public_id: {type: String, required: true},
            }
        ],
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        stock: {
            type: Number,
            required: true,
            default: 0,
            min: 0
        },
        sizes: [
            {
                type: String,
                enum: ['One Size', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48', '50']
            }
        ],
        colors: [
            {
                type: String,
                trim: true
            }
        ],
        isFeatured: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: true
        },
        sold: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

productSchema.index({ category: 1, isActive: 1 });

export const Product = mongoose.model("Product", productSchema);