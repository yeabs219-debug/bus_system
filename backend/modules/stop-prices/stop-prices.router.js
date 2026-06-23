import express from "express";
const router = express.Router();
import requireAdmin from "../../middleware/authMiddleware.js";
import * as controller from "./stop-prices.controller.js";

router.post('/bulk',requireAdmin,  controller.bulkCreatePrices);
router.get("/stop/:stop_id" ,controller.getPricesByStop);
router.get("/stop/:stop_id/direction/:direction" , controller.getPriceByStopAndDirection);
router.post("/" ,requireAdmin ,  controller.createStopPrice);
router.put("/:id" ,requireAdmin ,  controller.updateStopPrice);
router.delete("/:id" , requireAdmin , controller.deleteStopPrice);

export default router;