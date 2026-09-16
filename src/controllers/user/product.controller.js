import { getAllProductsService, getFeaturedProductsService, getProductBySlugService, getProductsByCategoryService } from "../../services/user/product.service.js";

export const getAllProducts = async (req, res, next) => {
    try {
        const { page = 1, limit = 12, search, minPrice, maxPrice, category } = req.query;
        const { products, pagination } = await getAllProductsService({ page, limit, search, minPrice, maxPrice, category });
        res.status(200).json({ success: true, products, pagination });
    } catch (error) {
        next(error);
    }
}

export const getProduct = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const product = await getProductBySlugService(slug);
        res.status(200).json({ success: true, product });
    } catch (error) {
        next(error);
    }
}

export const getFeaturedProducts = async (req, res, next) => {
    try {
        const products = await getFeaturedProductsService();
        res.status(200).json({ success: true, products });
    } catch (error) {
        next(error);
    }
}

export const getProductsByCategory = async (req, res, next) => {
    try {
        const { categoryId } = req.params;
        const { page = 1, limit = 12 } = req.query;
        const { products, pagination } = await getProductsByCategoryService(categoryId, { page, limit });
        res.status(200).json({ success: true, products, pagination });
    } catch (error) {
        next(error);
    }
}
