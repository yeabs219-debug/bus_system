import express from "express"
const router = express.Router();
import  * as controller from "./trips.controller.js"
import requireAdmin from "../../middleware/authMiddleware.js";

router.get('/active', controller.getActiveTrips);
router.get('/:id', controller.getTripById);
router.post('/',requireAdmin ,  controller.createTrip);
router.put('/:id/end',requireAdmin ,  controller.endTrip);

export default router