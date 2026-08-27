import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import { redis } from "../config/redis.js";
import { setCookies } from "../utils/setCookies.js";
import { storeRefreshToken } from "../utils/storeRefreshToken.js";

export const verifyToken = async (req, res, next) => {
    try {
        const { accessToken, refreshToken } = req.cookies;
        
        if(!accessToken && !refreshToken) {
            throw new AppError("Not authenticated", 401);
        }

        if(accessToken) {
            try {
                const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
                req.userId = decoded.userId;
                return next();
            } catch (error) {
                if(error.name !== "TokenExpiredError") {
                    throw new AppError("Invalid token", 401);
                }
            }
        }

        if(!refreshToken) {
            throw new AppError ("Session expired, please login again", 401);
        }

        let decodedRefresh;
        try {
            decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN)
        } catch (error) {
            throw new AppError("Session expired, please login again", 401);
        }

        const storedToken = await redis.get(`refresh_token:${decodedRefresh.userId}`);
        if(storedToken !== refreshToken){
            throw new AppError("Session expired, please login again", 401);
        }

        const newAccessToken = jwt.sign( { userId: decodedRefresh.userId }, process.env.ACCESS_TOKEN, { expiresIn: "15m" } );
        const newRefreshToken = jwt.sign({ userId: decodedRefresh.userId }, process.env.REFRESH_TOKEN, { expiresIn: "7d" });
        
        await storeRefreshToken(decodedRefresh.userId, newRefreshToken);
        
        setCookies(res, newAccessToken, newRefreshToken);
        
        req.userId = decodedRefresh.userId;
        next();
    } catch (error) {
        next(error);
    }
}