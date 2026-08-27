import jwt from "jsonwebtoken"

export const generateTokens = (userId) => {
    const accessToken = jwt.sign( { userId }, process.env.ACCESS_TOKEN, { expiresIn: '15m' } );
    const refreshToken = jwt.sign( { userId }, process.env.REFRESH_TOKEN, {expiresIn: '7d'} );
    
    return { accessToken, refreshToken };
}