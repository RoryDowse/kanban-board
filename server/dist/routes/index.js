import { Router } from 'express';
import authRoutes from './auth-routes.js';
import apiRoutes from './api/index.js';
import { authenticateToken } from '../middleware/auth.js';
const router = Router();
router.use('/auth', authRoutes);
// TODO: Add authentication to the API routes
// Add authenticateToken to verify JWT token and to ensure that the user is authenticated before accessing the API routes
router.use('/api', authenticateToken, apiRoutes);
export default router;
