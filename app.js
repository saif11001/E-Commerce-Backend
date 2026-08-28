import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

import { connectDB } from "./src/config/db.js";
import { generalLimiter } from "./src/middlewares/rateLimiter.js";

import authRouter from './src/routes/auth.route.js';

import analyticsRouter from './src/routes/admin/analytics.route.js';
import adminRouter from './src/routes/admin/user.route.js';
import categoryAdminRouter from './src/routes/admin/category.route.js';
import productAdminRouter from './src/routes/admin/product.route.js';
import couponAdminRouter from './src/routes/admin/coupon.route.js';
import shippingZoneAdminRouter from './src/routes/admin/shipping.route.js';
import orderAdminRouter from './src/routes/admin/order.route.js';

import userRouter from './src/routes/user/user.route.js';
import productRouter from './src/routes/user/product.route.js';
import cartRouter from './src/routes/user/cart.route.js';
import shippingZoneRouter from './src/routes/user/shipping.route.js';
import checkoutRouter from './src/routes/user/checkout.route.js';
import orderRouter from './src/routes/user/order.route.js';
import webhookRouter from './src/routes/webhook.route.js';

dotenv.config();

const PORT = process.env.PORT || 7000;

const app = express();
app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(cookieParser());
app.use(generalLimiter);

app.use('/api/v1/webhook', webhookRouter);

app.use('/api/v1/categories/', categoryAdminRouter);
app.use('/api/v1/admin/products/', productAdminRouter);

app.use(express.json({ limit: '1mb' }));

app.use('/api/v1/auth', authRouter);

app.use('/api/v1/profile', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/shippingZone', shippingZoneRouter);
app.use('/api/v1/checkout', checkoutRouter);
app.use('/api/v1/orders', orderRouter);

app.use('/api/v1/admin/analytics', analyticsRouter);
app.use('/api/v1/admin/', adminRouter);
app.use('/api/v1/admin/coupon/', couponAdminRouter);
app.use('/api/v1/admin/shippingZone/', shippingZoneAdminRouter);
app.use('/api/v1/admin/orders/', orderAdminRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    const message = err.isOperational ? err.message : "Something went wrong, please try again later";
    res.status(statusCode).json({ success: false, message });
})

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    });
}).catch((error) => {
    console.log("Failed to connect:", error);
    process.exit(1);
})