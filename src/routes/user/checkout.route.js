import express from "express";
import { attachCartContext } from "../../middlewares/attachCartContext.js";
import { checkout } from "../../controllers/user/checkout.controller.js";
import { validate } from "../../middlewares/validate.js";
import { checkoutValidation } from "../../validations/checkout.validation.js";

const router = express.Router();

router.post("/", attachCartContext, checkoutValidation, validate, checkout);

export default router;