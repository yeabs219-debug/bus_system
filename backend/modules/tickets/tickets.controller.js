import * as db from "./tickets.queries.js";
import * as busesDb from "../buses/buses.queries.js";
import * as tripsDb from '../trips/trips.queries.js';
import * as stopsDb from '../stops/stops.queries.js';
import * as stopPricesDb from '../stop-prices/stop-prices.queries.js';


const findNearestStop = (busLat, busLng, stops) => {
  let nearest = null;
  let smallestDistance = Infinity;

  for (const stop of stops) {
    const distance = Math.sqrt(
      Math.pow(stop.latitude - busLat, 2) +
      Math.pow(stop.longitude - busLng, 2)
    );
    if (distance < smallestDistance) {
      smallestDistance = distance;
      nearest = stop;
    }
  }
  return nearest;
};

const createTicket = async (req, res) => {
  try {
    const { qr_code } = req.body;
    if (!qr_code) {
      return res.status(400).json({ error: 'QR code is required' });
    }

    const bus = await busesDb.getBusByQR(qr_code);
    if (!bus) return res.status(404).json({ error: 'Bus not found' });

    const trip = await tripsDb.getActiveTripByBus(bus.id);
    if (!trip) return res.status(400).json({ error: 'This bus has no active trip right now' });

    if (bus.last_lat === null || bus.last_lng === null) {
      return res.status(400).json({ error: 'Bus location not available yet' });
    }

    const stops = await stopsDb.getStopsByRoute(trip.route_id);
    const nearestStop = findNearestStop(bus.last_lat, bus.last_lng, stops);

    if (!nearestStop) {
      return res.status(404).json({ error: 'Could not determine boarding stop' });
    }

    const priceRow = await stopPricesDb.getPriceByStopAndDirection(
      nearestStop.id, trip.direction
    );

    if (!priceRow) {
      return res.status(404).json({ error: 'Price not set for this stop and direction' });
    }

    const ticket = await db.createTicket(trip.id, nearestStop.id, priceRow.price);

    res.status(201).json({
      ...ticket,
      boarded_stop_name: nearestStop.name,
      route_id: trip.route_id,
      direction: trip.direction
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create ticket' });
    console.error(err)
  }
};

const getTicketByToken = async (req, res) => {
  try {
    const ticket = await db.getTicketByToken(req.params.qr_token);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
};

const getTicketsByTrip = async (req, res) => {
  try {
    const tickets = await db.getTicketsByTrip(req.params.trip_id);
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
};

const getRevenueByRoute = async (req, res) => {
  try {
    const revenue = await db.getRevenueByRoute();
    res.json(revenue);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch revenue' });
  }
};

export {
  createTicket,
  getTicketByToken,
  getTicketsByTrip,
  getRevenueByRoute
};