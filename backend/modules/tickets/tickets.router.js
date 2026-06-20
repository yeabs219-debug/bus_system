import express from 'express'
const router = express.Router();
import * as controller from "./tickets.controller.js"
router.get('/revenue', controller.getRevenueByRoute);
router.get('/trip/:trip_id', controller.getTicketsByTrip);
router.get('/:qr_token', controller.getTicketByToken);
router.post('/', controller.createTicket);

export default router;