import express from "express";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { authorize } from "../../middlewares/authorize.js";
import { createShippingZone, deleteShippingZone, getAllShippingZone, updateShippingZone } from "../../controllers/admin/shipping.controller.js";
import { validate } from "../../middlewares/validate.js";
import { createShippingZoneValidation, updateShippingZoneValidation, shippingZoneIdValidation } from "../../validations/shipping.validation.js";

const router = express.Router();

router.post('/', verifyToken, authorize("admin", "manager"), createShippingZoneValidation, validate, createShippingZone );

router.get('/', verifyToken, authorize("admin", "manager"), getAllShippingZone );

router.patch('/:id', verifyToken, authorize("admin", "manager"), updateShippingZoneValidation, validate, updateShippingZone );

router.delete('/:id', verifyToken, authorize("admin"), shippingZoneIdValidation, validate, deleteShippingZone );

export default router;