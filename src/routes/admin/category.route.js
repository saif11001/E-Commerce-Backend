import express from "express";
import { createCategory, deleteCategory, getAllCategories, getCategory, updateCategory } from "../../controllers/admin/category.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { authorize } from "../../middlewares/authorize.js";
import { validate } from "../../middlewares/validate.js";
import { createCategoryValidation, updateCategoryValidation, categoryIdValidation } from "../../validations/category.validation.js";

const router = express.Router();

router.post('/', verifyToken, express.json({ limit: "30mb" }), authorize("admin", "manager"), createCategoryValidation, validate, createCategory);

router.get('/', getAllCategories);

router.get('/:slug', getCategory);

router.patch('/:id', verifyToken, express.json({ limit: "30mb" }), authorize("admin", "manager"), updateCategoryValidation, validate, updateCategory);

router.delete('/:id', verifyToken, authorize("admin"), categoryIdValidation, validate, deleteCategory);

export default router;