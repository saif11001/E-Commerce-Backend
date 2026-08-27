import express from "express";
import { handleStripeWebhook } from "../controllers/user/webhook.controller.js";

const router = express.Router();

router.post("/stripe", express.raw({ type: "application/json" }), handleStripeWebhook);

export default router;