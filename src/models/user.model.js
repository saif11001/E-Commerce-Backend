import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        image: {
            url: { type: String },
            public_id: { type: String }
        },
        lastLogin: {
            type: Date,
            default: Date.now
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        role: {
            type: String,
            enum: ["user", "manager", "support", "admin"],
            default: "user"
        },
        resetPasswordToken: String,
        resetPasswordExpiresAt: Date,
        verificationToken: String,
        verificationExpiresAt: Date,
    },
    {
        timestamps: true
    }
)

export const User = mongoose.model("User", userSchema);