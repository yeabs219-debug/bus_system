import express from 'express';
import * as controller from './routes.controller.js';

const router = express.Router();

router.get('/search', controller.searchRoutesByTrip);
router.get('/', controller.getAllRoutes);
router.get('/:id', controller.getRouteById);
router.get('/number/:route_number', controller.getRouteByNumber);
router.post('/', controller.createRoute);
router.put('/:id', controller.updateRoute);
router.delete('/:id', controller.deleteRoute);

export default router;
