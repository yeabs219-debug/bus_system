import express from "express"
import requireAdmin from "../../middleware/authMiddleware.js";
const router = express.Router();
import * as controller from "./buses.controller.js"
router.get('/', controller.getAllBuses);
router.get('/number/:bus_number', controller.getBusByNumber);
router.get('/qr/:qr_code', controller.getBusByQR);
router.get('/route/:route_id', controller.getBusesByRoute);
router.post('/', requireAdmin , controller.createBus);
router.put('/:id/route', requireAdmin, controller.updateBusRoute);
router.put('/location/:bus_number', requireAdmin, controller.updateBusLocation);
router.put('/:id/status',requireAdmin ,  controller.updateBusStatus);
router.delete('/:id', requireAdmin, controller.deleteBus);

export default router