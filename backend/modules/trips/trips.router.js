import express from "express"
const router = express.Router();
import  * as controller from "./trips.controller.js"

router.get('/active', controller.getActiveTrips);
router.get('/:id', controller.getTripById);
router.post('/', controller.createTrip);
router.put('/:id/end', controller.endTrip);

export default router