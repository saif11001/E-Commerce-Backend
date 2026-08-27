import express from 'express';
import { getAnalytics } from '../../controllers/admin/analytics.controller.js';
import { verifyToken } from '../../middlewares/verifyToken.js';
import { authorize } from '../../middlewares/authorize.js';

const router = express.Router();

router.get('/', verifyToken, authorize("admin"), getAnalytics);

export default router;