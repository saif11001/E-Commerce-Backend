import { createCategory, findAllCategories, findCategoryById, findCategoryByName, findCategoryBySlug } from "../../repositories/category.repository.js"
import cloudinary from "../../config/cloudinary.js";
import AppError from "../../utils/AppError.js"
import { slugify } from "../../utils/slugify.js";
import { findOneProductByCategory } from "../../repositories/product.repository.js";

const generateUniqueSlug = async (name) => {
    let baseSlug = slugify(name);
    let slug = baseSlug;
    let counter = 1;

    while (await findCategoryBySlug(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
};

export const createCategoryService = async ({ name, image, description }) => {
    const categoryExists = await findCategoryByName(name)
    if(categoryExists) {
        throw new AppError("Category with this name already exists", 400);
    }

    if(!image) {
        throw new AppError("Category image is required", 400);
    }

    const slug = await generateUniqueSlug(name);

    let uploadedImage = undefined;
    const result = await cloudinary.uploader.upload(image, { folder: "categories" });
    uploadedImage = { url: result.secure_url, public_id: result.public_id };

    const category = await createCategory({ name, slug, image: uploadedImage, description });
    return category;
};

export const getAllCategoriesService = async () => {
    const categories = await findAllCategories();
    return categories;
}

export const getCategoryService = async (slug) => {
    const category = await findCategoryBySlug(slug);
    if(!category) {
        throw new AppError("Category not found", 404);
    }
    return category;
};

export const updateCategoryService = async (id, { name, image, description, isActive }) => {
    const category = await findCategoryById(id);
    if(!category) {
        throw new AppError("Category not found", 404);
    };

    if(name && name !== category.name) {
        const existingCategory = await findCategoryByName(name);
        if(existingCategory) {
            throw new AppError("Category with this name already exists", 400);
        }
        category.name = name;
        const slug = await generateUniqueSlug(name);
        category.slug = slug;
    }

    if (isActive !== undefined) {
        category.isActive = isActive;
    }

    if(image) {
        const result = await cloudinary.uploader.upload(image, { folder: "categories" });
        const oldPublicId = category.image?.public_id;
        category.image = { url: result.secure_url, public_id: result.public_id };
        if (oldPublicId) {
            cloudinary.uploader.destroy(oldPublicId).catch(err => 
                console.error("Failed to cleanup old image:", err.message)
            );
        }
    }

    if(description !== undefined) {
        category.description = description;
    }

    await category.save();
    return category;
}

export const deleteCategoryService = async (id) => {
    const category = await findCategoryById(id);
    if(!category) {
        throw new AppError("Category not found", 404)
    }
    
    const hasProducts = await findOneProductByCategory(id);
    if(hasProducts) {
        throw new AppError("Cannot delete category with existing products", 400);
    }

    await cloudinary.uploader.destroy(category.image.public_id);
    await deleteCategoryById(id);
    
    return category;
}