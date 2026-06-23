import express from 'express';
import * as controller from './routes.controller.js';
import requireAdmin from '../../middleware/authMiddleware.js';
const router = express.Router();

router.get('/search', controller.searchRoutesByTrip);
router.get('/', controller.getAllRoutes);
router.get('/:id', controller.getRouteById);
router.get('/number/:route_number', controller.getRouteByNumber);
router.post('/', requireAdmin,controller.createRoute);
router.put('/:id' ,requireAdmin, controller.updateRoute);
router.delete('/:id', requireAdmin ,controller.deleteRoute);

export default router;
