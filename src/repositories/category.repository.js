import { Category } from "../models/category.model.js"

export const findCategoryByName = (name) => {
    const category = Category.findOne({ name });
    return category;
};

export const createCategory = ({ name, slug, image, description }) => {
    const category = Category.create({ name, slug, image, description });
    return category;
}

export const findCategoryBySlug = (slug) => {
    const category = Category.findOne({ slug });
    return category;
}

export const findAllCategories = () => {
    const categories = Category.find().sort({ createdAt: -1 });
    return categories;
}

export const findCategoryById = (id) => {
    const category = Category.findById(id);
    return category;
}

export const deleteCategoryById = (id) => {
    const category = Category.findByIdAndDelete(id);
    return category;
}