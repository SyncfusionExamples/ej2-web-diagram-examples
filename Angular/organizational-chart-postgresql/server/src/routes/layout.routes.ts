import { Router } from 'express';
import { getLayoutData } from '../controllers/layout.controller';

const router = Router();

router.get('/layoutJS', getLayoutData);

export default router;
