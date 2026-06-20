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
    const { bus_number , driver_id, route_number, direction } = req.body;

    const bus = await busesDb.getBusByNumber(bus_number);
    if (!bus) return res.status(404).json({ error: 'Bus not found' });

    const route = await routesDb.getRouteByNumber(route_number);
    if (!route) return res.status(404).json({ error: 'Route not found' });

    const existingTrip = await db.getActiveTripByBus(bus.id);
    if (existingTrip) {
      return res.status(400).json({ error: 'This bus already has an active trip' });
    }

    const trip = await db.createTrip(bus.id, driver_id, route.id, direction);
    await busesDb.updateBusStatus(bus.id, 'active');

    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create trip' });
    console.error(err)
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