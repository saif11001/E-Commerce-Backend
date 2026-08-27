import express from "express";
import { getActiveShippingZones } from "../../controllers/user/shipping.controller.js";

const router = express.Router();

router.get("/", getActiveShippingZones);

export default router;