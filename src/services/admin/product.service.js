import cloudinary from "../../config/cloudinary.js";
import { redis } from "../../config/redis.js";
import AppError from "../../utils/AppError.js";
import { slugify } from "../../utils/slugify.js";
import { sendAdminNewProductEmail, sendAdminProductUpdatedEmail } from "../../nodemailer/emails.js";
import { findCategoryById } from "../../repositories/category.repository.js";
import { findUsersByRole } from "../../repositories/user.repository.js";
import { countProducts, createProduct, deleteProductById, findAllProductsPaginated, findProductById, findProductBySlug } from "../../repositories/product.repository.js";

const generateUniqueSlug = async (name) => {
    let baseSlug = slugify(name);
    let slug = baseSlug;
    let counter = 1;

    while (await findProductBySlug(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
};

const uploadImages = async (images) => {
    const results = await Promise.all(
        images.map(image => cloudinary.uploader.upload(image, { folder: "products" }))
    );
    return results.map(r => ({ url: r.secure_url, public_id: r.public_id }));
};

const deleteImages = async (images) => {
    for (const image of images) {
        if (image.public_id) {
            await cloudinary.uploader.destroy(image.public_id);
        }
    }
};

export const createProductService = async ({ name, shortDescription, longDescription, price, discountPrice, images, category, stock, sizes, colors, isFeatured }) => {
    const categoryExists = await findCategoryById(category);
    if(!categoryExists) {
        throw new AppError("Category not found", 404);
    }

    if(discountPrice !== undefined && Number(discountPrice) > Number(price)) {
        throw new AppError("Discount price cannot be greater than the original price", 400);
    }

    if(!images || images.length === 0) {
        throw new AppError("At least one image is required", 400)
    }

    const slug = await generateUniqueSlug(name);
    const uploadedImages = await uploadImages(images);

    const product = await createProduct({
        name,
        slug,
        shortDescription,
        longDescription,
        price,
        discountPrice,
        images: uploadedImages,
        category,
        stock,
        sizes,
        colors,
        isFeatured
    });

    if(isFeatured) {
        await redis.del("featured_products");
    }

    try {
        const users = await findUsersByRole("admin");
        await Promise.all(
            users.map((user) =>
                sendAdminNewProductEmail({ email: user.email, product })
            )
        );
    } catch (emailError) {
        console.log("Failed to send admin product email:", emailError.message);
    }
    
    return product;
}

export const getAllProductsService = async ({ page = 1, limit = 8 }) => {
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
        findAllProductsPaginated(skip, limit),
        countProducts()
    ]);
    
    return { 
        products,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit)
        }
    };
}

export const getProductService = async (id) => {
    const product = await findProductById(id);
    if(!product) {
        throw new AppError("Product not found", 404);
    }
    return product;
}

export const updateProductService = async (id, { name, shortDescription, longDescription, price, discountPrice, images, category, stock, sizes, colors, isFeatured, isActive }) => {
    const product = await findProductById(id);
    if(!product) {
        throw new AppError("Product not found", 404);
    }

    if(name !== undefined) {
        product.name = name;
        product.slug = await generateUniqueSlug(name);
    }
    if(shortDescription !== undefined) product.shortDescription = shortDescription;
    if(longDescription !== undefined) product.longDescription = longDescription;
    if(price !== undefined && discountPrice === undefined) {
        if(Number(price) < Number(product.discountPrice)) {
            throw new AppError("Price cannot be lower than the current discount price", 400);
        }
        product.price = price;
    }
    if(discountPrice !== undefined) {
        if(price === undefined) {
            if(Number(discountPrice) > Number(product.price)) {
                throw new AppError("Discount price cannot be higher than the product price", 400);
            }
        } else {
            if(Number(discountPrice) > Number(price)) {
                throw new AppError("Discount price cannot be higher than the product price", 400);
            }
        }
        product.discountPrice = discountPrice;
    };
    if(images && images.length > 0) {
        const uploadedImages = await uploadImages(images);
        const oldImages = product.images;
        product.images = uploadedImages;
        deleteImages(oldImages).catch(err =>
            console.error("Failed to cleanup old product images:", err.message)
        );
    };
    if(category !== undefined) {
        const categoryExists = await findCategoryById(category);
        if(!categoryExists) {
            throw new AppError("Category not found", 400);
        }
        product.category = category;
    };
    if(stock !== undefined) product.stock = stock;
    if(sizes !== undefined) product.sizes = sizes;
    if(colors !== undefined) product.colors = colors;
    if(isFeatured !== undefined) {
        product.isFeatured = isFeatured;
        await redis.del("featured_products");
    }
    if(isActive !== undefined) {
        product.isActive = isActive;
        if(isActive === false && product.isFeatured) {
            await redis.del("featured_products");
        }
    }

    await product.save();
    
    try {
        const users = await findUsersByRole("admin");
        await Promise.all(
            users.map((user) =>
                sendAdminProductUpdatedEmail({ email: user.email, product })
            )
        );
    } catch (emailError) {
        console.log("Failed to send admin product email:", emailError.message);
    }

    return product;
}

export const deleteProductService = async (id) => {
    const product = await findProductById(id);
    if(!product) {
        throw new AppError("Product not found", 404);
    }
    await deleteImages(product.images);
    await deleteProductById(id);
    
    if(product.isFeatured) {
        await redis.del("featured_products");
    }

    return product;
}