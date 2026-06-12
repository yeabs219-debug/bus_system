import express from "express";
const router = express.Router();
import * as controller from "./stop-prices.controller.js";

router.get("/stop/:stop_id" , controller.getPricesByStop);
router.get("/stop/:stop_id/direction/:direction" , controller.getPriceByStopAndDirection);
router.post("/" , controller.createStopPrice);
router.put("/:id" , controller.updateStopPrice);
router.delete("/:id" ,controller.deleteStopPrice);

export default router;