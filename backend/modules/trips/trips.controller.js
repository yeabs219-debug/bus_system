import * as db from "./trips.queries.js"
import * as busesDb from "../buses/buses.queries.js"
import * as routesDb from "../routes/routes.queries.js"
const getActiveTrips = async (req, res) => {
  try {
    const trips = await db.getActiveTrips();
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch active trips' });
  }
};

const getTripById = async (req, res) => {
  try {
    const trip = await db.getTripById(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trip' });
  }
};

const createTrip = async (req, res) => {
  try {
    const { bus_id, driver_id, route_id, direction } = req.body;

    if (!bus_id || !driver_id || !route_id || !direction) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (!['forward', 'reverse'].includes(direction)) {
      return res.status(400).json({ error: 'Direction must be forward or reverse' });
    }

    const existingTrip = await db.getActiveTripByBus(bus_id);
    if (existingTrip) {
      return res.status(400).json({ error: 'This bus already has an active trip' });
    }

    const trip = await db.createTrip(bus_id, driver_id, route_id, direction);
    await busesDb.updateBusStatus(bus_id, 'active');

    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create trip' });
  }
};

const endTrip = async (req, res) => {
  try {
    const trip = await db.endTrip(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    await busesDb.updateBusStatus(trip.bus_id, 'inactive');

    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: 'Failed to end trip' });
  }
};

export {
  getActiveTrips,
  getTripById,
  createTrip,
  endTrip
};