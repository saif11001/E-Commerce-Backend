import crypto from "crypto";
import jwt from "jsonwebtoken";

export const attachCartContext = (req, res, next) => {
    const { accessToken, cartId } = req.cookies;

    if (accessToken) {
        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
            req.userId = decoded.userId;
            return next();
        } catch (error) {
            
        }
    }

    if (cartId) {
        req.cartId = cartId;
        return next();
    }

    const newCartId = crypto.randomBytes(24).toString("hex");
    res.cookie("cartId", newCartId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000
    });
    req.cartId = newCartId;
    next();
};