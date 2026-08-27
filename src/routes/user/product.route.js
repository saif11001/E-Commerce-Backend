import express from "express";
import { getAllProducts, getFeaturedProducts, getProduct, getProductsByCategory } from "../../controllers/user/product.controller.js";
import { validate } from "../../middlewares/validate.js";
import { getAllProductsValidation, productSlugValidation, categoryIdParamValidation } from "../../validations/product.validation.js";

const router = express.Router();

router.get('/featured', getFeaturedProducts);

router.get('/category/:categoryId', categoryIdParamValidation, validate, getProductsByCategory);

router.get('/:slug', productSlugValidation, validate, getProduct);

router.get('/', getAllProductsValidation, validate, getAllProducts);

export default router;