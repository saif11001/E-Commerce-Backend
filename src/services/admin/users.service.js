import { countUsers, deleteAllRegularUsers, deleteUserById, findUserById, findUsersPaginated } from "../../repositories/user.repository.js";
import { findOrdersByUser, countOrdersByUser, getUserSpending } from "../../repositories/order.repository.js";
import AppError from "../../utils/AppError.js";

export const getAllUsersService = async ({ page = 1, limit = 10 }) => {
    const skip = (page-1) * limit;
    const [users, total] = await Promise.all([
        findUsersPaginated(skip, limit),
        countUsers()
    ])
    return {
        users,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit)
        }
    }
}

export const getUserService = async (userId) => {
    const user = await findUserById(userId);
    if(!user) {
        throw new AppError("User not found", 404)
    }
    return user;
}

export const getUserDetailsService = async (userId) => {
    const user = await findUserById(userId);
    if(!user) {
        throw new AppError("User not found", 404)
    }

    const [orders, totalOrders, totalSpent] = await Promise.all([
        findOrdersByUser(userId, 0, 20),
        countOrdersByUser(userId),
        getUserSpending(userId),
    ]);

    return {
        user,
        orders,
        stats: { totalOrders, totalSpent, lastOrderAt: orders[0]?.createdAt || null },
    };
}

export const deleteUserService = async (userId) => {
    const user = await deleteUserById(userId);
    if(!user) {
        throw new AppError("User not found", 404)
    }
    return user;
}

export const deleteAllUserService = async () => {
    const users = await deleteAllRegularUsers();
    return users;
}