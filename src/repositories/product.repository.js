import { Product } from "../models/product.model.js";

export const findProductBySlug = (slug) => {
    return Product.findOne({ slug });
};

export const createProduct = ({ name, slug, shortDescription, longDescription, price, discountPrice, images, category, stock, sizes, colors, isFeatured }) => {
    const product = Product.create({ name, slug, shortDescription, longDescription, price, discountPrice, images, category, stock, sizes, colors, isFeatured });
    return product;
};

export const findAllProductsPaginated = (skip, limit) => {
    return Product.aggregate([
        {
            $addFields: {
                priorityRank: {
                    $switch: {
                        branches: [
                            { case: { $and: ["$isFeatured", "$isActive"] }, then: 0 },
                            { case: "$isActive", then: 1 },
                        ],
                        default: 2,
                    }
                }
            }
        },
        { $sort: { priorityRank: 1, createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
    ]);
};

export const countProducts = () => {
    const total = Product.countDocuments();
    return total;
};

export const findProductById = (id) => {
    const product = Product.findById(id);
    return product
};

export const deleteProductById = (id) => {
    return Product.findByIdAndDelete(id);
}



export const findActiveProductsFiltered = (skip, limit, filters = {}) => {
    const match = { isActive: true };

    if (filters.search) {
        match.name = { $regex: filters.search, $options: "i" };
    }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        match.price = {};
        if (filters.minPrice !== undefined) match.price.$gte = Number(filters.minPrice);
        if (filters.maxPrice !== undefined) match.price.$lte = Number(filters.maxPrice);
    }
    if (filters.categoryId) {
        match.category = filters.categoryId;
    }

    return Product.aggregate([
        { $match: match },
        {
            $addFields: {
                featuredPriority: { $cond: [{ $eq: ["$isFeatured", true] }, 0, 1] },
            },
        },
        { $sort: { featuredPriority: 1, createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category",
                pipeline: [{ $project: { name: 1, slug: 1 } }],
            },
        },
        { $unwind: "$category" },
        { $project: { featuredPriority: 0 } },
    ]);
};

export const countActiveProductsFiltered = (filters = {}) => {
    const query = { isActive: true };

    if (filters.search) {
        query.name = { $regex: filters.search, $options: "i" };
    }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        query.price = {};
        if (filters.minPrice !== undefined) query.price.$gte = Number(filters.minPrice);
        if (filters.maxPrice !== undefined) query.price.$lte = Number(filters.maxPrice);
    }
    if (filters.categoryId) {
        query.category = filters.categoryId;
    }

    return Product.countDocuments(query);
};

export const findActiveProductBySlug = (slug) => {
    return Product.findOne({ slug, isActive: true }).populate("category", "name slug");
};

export const findActiveProductsByCategoryPaginated = (categoryId, skip, limit) => {
    return Product.find({ category: categoryId, isActive: true })
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
};

export const countActiveProductsByCategory = (categoryId) => {
    return Product.countDocuments({ category: categoryId, isActive: true });
};

export const findFeaturedProductsFromDB = () => {
    return Product.find({ isFeatured: true, isActive: true })
        .populate("category", "name slug")
        .sort({ createdAt: -1 });
};

export const findOneProductByCategory = (categoryId) => {
    return Product.findOne({ category: categoryId });
};

export const decrementProductStock = (productId, quantity) => {
    return Product.findByIdAndUpdate(
        productId,
        { $inc: { stock: -quantity, sold: quantity } },
        { new: true }
    );
};

export const incrementProductStock = (productId, quantity) => {
    return Product.findByIdAndUpdate(
        productId,
        { $inc: { stock: quantity, sold: -quantity } },
        { new: true }
    );
};

export const decrementProductStockIfAvailable = (productId, quantity) => {
    return Product.findOneAndUpdate(
        { _id: productId, stock: { $gte: quantity } },
        { $inc: { stock: -quantity, sold: quantity } },
        { new: true }
    );
};