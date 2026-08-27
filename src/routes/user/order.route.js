import express from "express";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { getMyOrder, getMyOrders } from "../../controllers/user/order.controller.js";
import { getOrdersByTrackingToken, requestTrackingLink } from "../../controllers/user/orderTracking.controller.js";
import { moderateLimiter } from "../../middlewares/rateLimiter.js";
import { validate } from "../../middlewares/validate.js";
import { orderIdValidation, getOrdersValidation, requestTrackingLinkValidation, trackingTokenValidation } from "../../validations/order.validation.js";

const router = express.Router();

router.post('/track/request', moderateLimiter, requestTrackingLinkValidation, validate, requestTrackingLink)

router.get('/track/:token', moderateLimiter, trackingTokenValidation, validate, getOrdersByTrackingToken)

router.get("/", verifyToken, getOrdersValidation, validate, getMyOrders);

router.get("/:id", verifyToken, orderIdValidation, validate, getMyOrder);

export default router;