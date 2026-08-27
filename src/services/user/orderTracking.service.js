import crypto from "crypto";
import AppError from "../../utils/AppError.js";
import { redis } from "../../config/redis.js";
import { findOrdersByEmail } from "../../repositories/order.repository.js";
import { sendTrackOrdersEmail } from "../../nodemailer/emails.js";

export const requestOrderTrackingLinkService = async (email) => {
    if(!email) {
        throw new AppError("Email is required", 400);
    };

    const token = crypto.randomBytes(32).toString("hex");

    await redis.set(`order_track:${token}`, email.toLowerCase(), "EX", 15 * 60);

    const trackLink = `${process.env.CLIENT_URL}/track-orders?token=${token}`;
    await sendTrackOrdersEmail({ email, trackLink });
};

export const getOrdersByTrackingTokenService = async (token) => {
    const email = await redis.get(`order_track:${token}`);

    if(!email) {
        throw new AppError("This link is invalid or has expired", 400);
    };

    const orders = await findOrdersByEmail(email);

    await redis.del(`order_track:${token}`);

    return orders;
};

