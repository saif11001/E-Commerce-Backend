import { User } from "../models/user.model.js";

export const findUserByEmail = (email) => {
    const existingUser = User.findOne({email});
    return existingUser;
};

export const createUser = ({ name, email, password, role, verificationToken, verificationExpiresAt }) => {
    const user = User.create({ name, email, password, role, verificationToken, verificationExpiresAt });
    return user;
};

export const findUserByVerificationToken = (verificationToken) => {
    const user = User.findOne({ verificationToken, verificationExpiresAt: { $gt: Date.now() } });
    return user;
}

export const verifyUserById = (userId) => {
    const verifiedUser = User.findByIdAndUpdate(
        userId,
        {
            isVerified: true,
            $unset: { verificationToken: 1, verificationExpiresAt: 1 }
        },
        { new: true }
    );
    return verifiedUser;
}

export const findUserByResetToken = (resetPasswordToken) => {
    const user = User.findOne({
        resetPasswordToken,
        resetPasswordExpiresAt: { $gt: Date.now() }
    });
    return user;
}

export const updateUserPassword = (userId, hashedPassword) => {
    const updatedUser = User.findByIdAndUpdate(
        userId,
        {
            password: hashedPassword,
            $unset: { resetPasswordToken: 1, resetPasswordExpiresAt: 1 }
        },
        { new: true }
    )
    return updatedUser;
}

export const findUserById = (userId) => {
    const user = User.findById(userId);
    return user;
}

export const countUsers = () => {
    return User.countDocuments();
};

export const findUsersPaginated = (skip, limit) => {
    return User.find().skip(skip).limit(limit).sort({ createdAt: -1 })
}

export const deleteUserById = (userId) => { 
    const user = User.findByIdAndDelete(userId);
    return user;
}

export const deleteAllRegularUsers = () => {
    const users = User.deleteMany({role: "user"});
    return users;
}

export const findUsersByRole = (role) => {
    const users = User.find({ role });
    return users;
}