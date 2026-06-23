import express from "express"
import * as controller from './stops.controller.js';
import requireAdmin from "../../middleware/authMiddleware.js";
const router = express.Router();

router.get('/route/:route_id', controller.getStopsByRoute);
router.get('/:id', controller.getStopById);
router.post('/', requireAdmin, controller.createStop);
router.put('/:id', requireAdmin, controller.updateStop);
router.delete('/:id', requireAdmin, controller.deleteStop);

export default router;