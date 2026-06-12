import express from "express"
import * as controller from './stops.controller.js';
const router = express.Router();

router.get('/route/:route_id', controller.getStopsByRoute);
router.get('/:id', controller.getStopById);
router.post('/', controller.createStop);
router.put('/:id', controller.updateStop);
router.delete('/:id', controller.deleteStop);

export default router;