import { createProductService, deleteProductService, getAllProductsService, getProductService, updateProductService } from "../../services/admin/product.service.js";

export const createProduct = async (req, res, next) => {
    try {
        const { name, shortDescription, longDescription, price, discountPrice, images, category, stock, sizes, colors, isFeatured } = req.body;
        const product = await createProductService({ name, shortDescription, longDescription, price, discountPrice, images, category, stock, sizes, colors, isFeatured });
        res.status(201).json({ success: true, product });
    } catch (error) {
        next(error);
    }
}

export const getAllProducts = async (req, res, next) => {
    try {
        const { page = 1, limit = 8 } = req.query;
        const { products, pagination } = await getAllProductsService({ page, limit });
        res.status(200).json({ success: true, products, pagination })
    } catch (error) {
        next(error);
    }
}

export const getProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await getProductService(id);
        res.status(200).json({ success: true, product });
    } catch (error) {
        next(error);
    }
}

export const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, shortDescription, longDescription, price, discountPrice, images, category, stock, sizes, colors, isFeatured, isActive } = req.body || {};
        const product = await updateProductService(id, { name, shortDescription, longDescription, price, discountPrice, images, category, stock, sizes, colors, isFeatured, isActive });
        res.status(200).json({ success: true, product });
    } catch (error) {
        next(error);
    }
}

export const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        await deleteProductService(id);
        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        next(error);
    }
}