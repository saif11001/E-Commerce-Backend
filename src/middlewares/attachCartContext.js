import crypto from "crypto";
import jwt from "jsonwebtoken";
import { cartCookieOptions } from "../utils/setCookies.js";

export const attachCartContext = (req, res, next) => {
    const { accessToken, cartId } = req.cookies;

    if (accessToken) {
        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
            if (decoded.type !== "chat") {
                req.userId = decoded.userId;
                return next();
            }
        } catch (error) {
            // invalid or expired token: fall back to the guest cart
        }
    }

    if (cartId) {
        req.cartId = cartId;
        return next();
    }

    const newCartId = crypto.randomBytes(24).toString("hex");
    res.cookie("cartId", newCartId, {
        ...cartCookieOptions,
        maxAge: 30 * 24 * 60 * 60 * 1000
    });
    req.cartId = newCartId;
    next();
};