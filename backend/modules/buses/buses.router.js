import express from "express"
const router = express.Router();
import * as controller from "./buses.controller.js"
router.get('/', controller.getAllBuses);
router.get('/number/:bus_number', controller.getBusByNumber);
router.get('/qr/:qr_code', controller.getBusByQR);
router.get('/route/:route_id', controller.getBusesByRoute);
router.post('/', controller.createBus);
router.put('/:id/route', controller.updateBusRoute);
router.put('/location/:bus_number', controller.updateBusLocation);
router.put('/:id/status', controller.updateBusStatus);
router.delete('/:id', controller.deleteBus);

export default router