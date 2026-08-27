export const sanitizeUser = (user) => {
    const userObj = user.toObject ? user.toObject() : user;
    const { password, verificationToken, verificationExpiresAt, resetPasswordToken, resetPasswordExpiresAt, __v, ...safeUser } = userObj;
    return safeUser;
};