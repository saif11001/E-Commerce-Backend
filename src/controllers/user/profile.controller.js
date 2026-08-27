import { getProfileService, updateProfileService } from "../../services/user/profile.service.js";
import { sanitizeUser } from "../../utils/sanitizeUser.js";

export const getProfile = async (req, res, next) => {
    try {
        const userId = req.userId;
        const user = await getProfileService(userId);
        res.status(200).json({ success: true, user: sanitizeUser(user) });
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const { name, currentPassword, newPassword } = req.body || {};
        const userId = req.userId;
        const updatedUser = await updateProfileService(userId, { name, currentPassword, newPassword });
        res.status(200).json({ success: true, user: sanitizeUser(updatedUser) })
    } catch (error) {
        next(error);
    }
}