import express from "express"
const router = express.Router();
import * as controller from "./drivers.controller.js"
router.get('/', controller.getAllDrivers);
router.get('/:id', controller.getDriverById);
router.post('/', controller.createDriver);
router.delete('/:id', controller.deleteDriver);

export default router