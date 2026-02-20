import { Router } from 'express';
import { getLayoutData } from '../controllers/layout.controller.js';

// Create a new router instance
const router = Router();

// Define GET endpoint: /api/layout
// When accessed, it calls the `getLayoutData` controller function
router.get('/layout', getLayoutData);

export default router;