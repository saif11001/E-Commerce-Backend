import express from "express";

import { verifyToken } from "../../middlewares/verifyToken.js";
import { getProfile, updateProfile } from "../../controllers/user/profile.controller.js";
import { validate } from "../../middlewares/validate.js";
import { updateProfileValidation } from "../../validations/profile.validation.js";

const router = express.Router();

router.get('/', verifyToken, getProfile);

router.patch('/', verifyToken, updateProfileValidation, validate, updateProfile);

export default router;