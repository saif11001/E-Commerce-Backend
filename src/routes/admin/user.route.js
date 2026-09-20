import express from "express";

import { verifyToken } from "../../middlewares/verifyToken.js";
import { authorize } from "../../middlewares/authorize.js";
import { deleteAllUsers, deleteUser, getAllUsers, getUser, getUserDetails } from "../../controllers/admin/users.controller.js";
import { validate } from "../../middlewares/validate.js";
import { userIdValidation, getAllUsersValidation } from "../../validations/user.validation.js";

const router = express.Router();

router.get('/users', verifyToken, authorize("admin", "support"), getAllUsersValidation, validate, getAllUsers);

router.get('/user/:userId', verifyToken, authorize("admin", "support"), userIdValidation, validate, getUser);

router.get('/user/:userId/details', verifyToken, authorize("admin", "support"), userIdValidation, validate, getUserDetails);

router.delete('/user/:userId', verifyToken, authorize("admin"), userIdValidation, validate, deleteUser);

router.delete('/users', verifyToken, authorize("admin"), deleteAllUsers);

export default router;