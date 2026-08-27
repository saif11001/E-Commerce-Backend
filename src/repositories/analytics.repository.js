import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";

export const countAllUsers = () => User.countDocuments();
export const countAllProducts = () => Product.countDocuments();
export const countAllCategories = () => Category.countDocuments();
export const countAllOrders = () => Order.countDocuments();

export const getTotalRevenue = async () => {
    const result = await Order.aggregate([
        { $match: { orderStatus: { $ne: "cancelled" } } },
        { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
    ]);
    return result[0]?.totalRevenue || 0;
};

export const getOrdersByStatus = () => {
    return Order.aggregate([
        { $group: { _id: "$orderStatus", count: { $sum: 1 } } }
    ]);
};

export const getSalesInLastDays = (days) => {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    return Order.aggregate([
        {
            $match: {
                createdAt: { $gte: fromDate },
                orderStatus: { $ne: "cancelled" }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                revenue: { $sum: "$totalPrice" },
                orders: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);
};

export const getTopSellingProducts = (limit = 5) => {
    return Product.find()
        .sort({ sold: -1 })
        .limit(limit)
        .select("name sold price images");
};

export const getLowStockProducts = (threshold = 5, limit = 10) => {
    return Product.find({ stock: { $lte: threshold }, isActive: true })
        .sort({ stock: 1 })
        .limit(limit)
        .select("name stock price images");
};

export const getRecentOrders = (limit = 5) => {
    return Order.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate("user", "name email")
        .select("user shippingInfo totalPrice orderStatus paymentMethod createdAt");
};

export const getNewUsersInLastDays = (days) => {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);
    return User.countDocuments({ createdAt: { $gte: fromDate } });
};

export const getUsersByRole = () => {
    return User.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);
};

export const getRevenueByCategory = () => {
    return Order.aggregate([
        { $match: { orderStatus: { $ne: "cancelled" } } },
        { $unwind: "$items" },
        {
            $lookup: {
                from: "products",
                localField: "items.product",
                foreignField: "_id",
                as: "productInfo"
            }
        },
        { $unwind: "$productInfo" },
        {
            $lookup: {
                from: "categories",
                localField: "productInfo.category",
                foreignField: "_id",
                as: "categoryInfo"
            }
        },
        { $unwind: "$categoryInfo" },
        {
            $group: {
                _id: "$categoryInfo.name",
                revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
                unitsSold: { $sum: "$items.quantity" }
            }
        },
        { $sort: { revenue: -1 } }
    ]);
};

export const getPaymentMethodBreakdown = () => {
    return Order.aggregate([
        { $match: { orderStatus: { $ne: "cancelled" } } },
        { $group: { _id: "$paymentMethod", count: { $sum: 1 }, revenue: { $sum: "$totalPrice" } } }
    ]);
};

export const getCouponUsageStats = () => {
    return Order.aggregate([
        { $match: { "coupon.code": { $ne: null } } },
        {
            $group: {
                _id: "$coupon.code",
                timesUsed: { $sum: 1 },
                totalDiscountGiven: { $sum: "$coupon.discount" }
            }
        },
        { $sort: { timesUsed: -1 } }
    ]);
};