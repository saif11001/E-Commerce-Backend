import express from "express";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { authorize } from "../../middlewares/authorize.js";
import { getAllOrders, getOrder, updateOrderStatus } from "../../controllers/admin/order.controller.js";
import { validate } from "../../middlewares/validate.js";
import { orderIdValidation, updateOrderStatusValidation, getOrdersValidation } from "../../validations/order.validation.js";

const router = express.Router();

router.get("/", verifyToken, authorize("admin", "manager", "support"), getOrdersValidation, validate, getAllOrders);

router.get("/:id", verifyToken, authorize("admin", "manager", "support"), orderIdValidation, validate, getOrder);

router.patch("/:id/status", verifyToken, authorize("admin", "manager"), updateOrderStatusValidation, validate, updateOrderStatus);

export default router;