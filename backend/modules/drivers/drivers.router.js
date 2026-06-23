import express from "express"
const router = express.Router();
import requireAdmin from "../../middleware/authMiddleware.js";
import * as controller from "./drivers.controller.js"
router.get('/', controller.getAllDrivers);
router.get('/:id',  controller.getDriverById);
router.post('/', requireAdmin , controller.createDriver);
router.delete('/:id', requireAdmin ,  controller.deleteDriver);

export default router