import { Router } from 'express';
import { getLayoutData } from '../controllers/layout.controller.js';

const router = Router();

router.get('/layoutJS', getLayoutData);

export default router;
