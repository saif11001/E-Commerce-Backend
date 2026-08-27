import { redis } from "../../config/redis.js";
import { findCategoryById } from "../../repositories/category.repository.js";
import { countActiveProductsByCategory, countActiveProductsFiltered, findActiveProductBySlug, findActiveProductsByCategoryPaginated, findActiveProductsFiltered, findFeaturedProductsFromDB } from "../../repositories/product.repository.js";
import AppError from "../../utils/AppError.js";

const sanitizeProduct = (product) => {
    const productObj = product.toObject ? product.toObject() : product;
    const { stock, sold, ...safeProduct } = productObj;
    return safeProduct;
};

export const getAllProductsService = async ({ page = 1, limit = 12, search, minPrice, maxPrice }) => {
    const skip = ( page - 1 ) * limit;
    const filters = { search, minPrice, maxPrice };
    const [products, total] = await Promise.all([
        findActiveProductsFiltered(skip, limit, filters),
        countActiveProductsFiltered(filters)
    ])
    return {
        products: products.map(sanitizeProduct),
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total/limit)
        }
    } 
}

export const getProductBySlugService = async (slug) => {
    let product = await findActiveProductBySlug(slug);
    if(!product) {
        throw new AppError("Product not found", 404);
    }

    return sanitizeProduct(product);
}

export const getFeaturedProductsService = async () => {
    const cached = await redis.get("featured_products");
    if (cached) {
        return JSON.parse(cached);
    }

    const products = await findFeaturedProductsFromDB();
    const sanitized = products.map(sanitizeProduct);

    await redis.set("featured_products", JSON.stringify(sanitized), "EX", 60 * 60);

    return sanitized;
}

export const getProductsByCategoryService = async (categoryId, { page = 1, limit = 12 }) => {
    const category = await findCategoryById(categoryId);
    if(!category) {
        throw new AppError("Category not found", 404);
    }

    const skip = (page-1) * limit;
    const [products, total] = await Promise.all([
        findActiveProductsByCategoryPaginated(categoryId, skip, limit),
        countActiveProductsByCategory(categoryId)
    ])

    return {
        products: products.map(sanitizeProduct),
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total/limit)
        }
    }
}