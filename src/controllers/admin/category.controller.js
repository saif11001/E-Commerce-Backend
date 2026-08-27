import { createCategoryService, deleteCategoryService, getAllCategoriesService, getCategoryService, updateCategoryService } from "../../services/admin/category.service.js";

export const createCategory = async (req, res, next) => {
    try {
        const { name, image, description } = req.body;
        const category = await createCategoryService({ name, image, description })
        res.status(201).json({ success: true, category })
    } catch (error) {
        next(error);
    }
};

export const getCategory = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const category = await getCategoryService(slug);
        res.status(200).json({ success: true, category });
    } catch (error) {
        next(error);
    }
};

export const getAllCategories = async (req, res, next) => {
    try {
        const categories = await getAllCategoriesService();
        res.status(200).json({ success: true, categories });
    } catch (error) {
        next(error);
    }
};

export const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, image, description, isActive } = req.body || {} ;
        const category = await updateCategoryService(id, { name, image, description, isActive });
        res.status(200).json({ success: true, category })
    } catch (error) {
        next(error);
    }
};

export const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        await deleteCategoryService(id);
        res.status(200).json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
        next(error);
    }
};