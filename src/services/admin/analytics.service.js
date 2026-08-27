import {
    countAllUsers,
    countAllProducts,
    countAllCategories,
    countAllOrders,
    getTotalRevenue,
    getOrdersByStatus,
    getSalesInLastDays,
    getTopSellingProducts,
    getLowStockProducts,
    getRecentOrders,
    getNewUsersInLastDays,
    getUsersByRole,
    getRevenueByCategory,
    getPaymentMethodBreakdown,
    getCouponUsageStats
} from "../../repositories/analytics.repository.js";

export const getAnalyticsService = async () => {
    const [
        totalUsers,
        totalProducts,
        totalCategories,
        totalOrders,
        totalRevenue,
        ordersByStatus,
        salesLast7Days,
        salesLast30Days,
        topProducts,
        lowStockProducts,
        recentOrders,
        newUsersLast7Days,
        newUsersLast30Days,
        usersByRole,
        revenueByCategory,
        paymentMethodBreakdown,
        couponUsageStats
    ] = await Promise.all([
        countAllUsers(),
        countAllProducts(),
        countAllCategories(),
        countAllOrders(),
        getTotalRevenue(),
        getOrdersByStatus(),
        getSalesInLastDays(7),
        getSalesInLastDays(30),
        getTopSellingProducts(5),
        getLowStockProducts(5, 10),
        getRecentOrders(5),
        getNewUsersInLastDays(7),
        getNewUsersInLastDays(30),
        getUsersByRole(),
        getRevenueByCategory(),
        getPaymentMethodBreakdown(),
        getCouponUsageStats()
    ]);

    return {
        overview: {
            totalUsers,
            totalProducts,
            totalCategories,
            totalOrders,
            totalRevenue
        },
        ordersByStatus,
        sales: {
            last7Days: salesLast7Days,
            last30Days: salesLast30Days
        },
        topProducts,
        lowStockProducts,
        recentOrders,
        users: {
            newLast7Days: newUsersLast7Days,
            newLast30Days: newUsersLast30Days,
            byRole: usersByRole
        },
        revenueByCategory,
        paymentMethodBreakdown,
        couponUsageStats
    };
};