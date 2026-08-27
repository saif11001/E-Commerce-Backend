import express from "express";

import { verifyToken } from "../../middlewares/verifyToken.js";
import { authorize } from "../../middlewares/authorize.js";
import { createProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from "../../controllers/admin/product.controller.js";
import { validate } from "../../middlewares/validate.js";
import { createProductValidation, updateProductValidation, productIdValidation } from "../../validations/product.validation.js";

const router = express.Router();

router.post('/', verifyToken, express.json({ limit: "30mb" }), authorize("admin", "manager"), createProductValidation, validate, createProduct);

router.get('/', verifyToken, authorize("admin", "manager"), getAllProducts);

router.get('/:id', verifyToken, authorize("admin", "manager"), productIdValidation, validate, getProduct);

router.patch('/:id', verifyToken, express.json({ limit: "30mb" }), authorize("admin", "manager"), updateProductValidation, validate, updateProduct);

router.delete('/:id', verifyToken, authorize("admin"), productIdValidation, validate, deleteProduct);

export default router;