import { deleteAllUserService, deleteUserService, getAllUsersService, getUserService, getUserDetailsService } from "../../services/admin/users.service.js";
import { sanitizeUser } from "../../utils/sanitizeUser.js";

export const getAllUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const { users, pagination } = await getAllUsersService({ page, limit });
        res.status(200).json({ success: true, users: users.map(sanitizeUser), pagination });
    } catch (error) {
        next(error);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await getUserService(userId);
        res.status(200).json({ success: true, user: sanitizeUser(user) });
    } catch (error) {
        next(error);
    }
}

export const getUserDetails = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { user, orders, stats } = await getUserDetailsService(userId);
        res.status(200).json({ success: true, user: sanitizeUser(user), orders, stats });
    } catch (error) {
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await deleteUserService(userId);
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
}

export const deleteAllUsers = async (req, res, next) => {
    try {
        const result = await deleteAllUserService();
        res.status(200).json({ success: true, message: `${result.deletedCount} regular users deleted successfully` });
    } catch (error) {
        next(error);
    }
}