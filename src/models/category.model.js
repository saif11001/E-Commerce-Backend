import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        slug: {
            type: String,
            required: true,
            unique: true
        },
        image: {
            url: { type: String },
            public_id: { type: String }
        },
        description: {
            type: String,
            required: true,
            maxlength : 300
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

export const Category = mongoose.model("Category", categorySchema);