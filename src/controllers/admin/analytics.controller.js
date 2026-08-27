import { getAnalyticsService } from "../../services/admin/analytics.service.js";

export const getAnalytics = async (req, res, next) => {
    try {
        const analytics = await getAnalyticsService();
        res.status(200).json({ success: true, analytics });
    } catch (error) {
        next(error);
    }
};