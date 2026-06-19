import * as db from "./buses.queries.js"
import * as routedb from "../routes/routes.queries.js"
const getAllBuses = async (req, res) => {
  try {
    const buses = await db.getAllBuses();
    res.json(buses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch buses' });
  }
};

const getBusByNumber = async (req, res) => {
  try {
    const bus = await db.getBusByNumber(req.params.bus_number);
    if (!bus) return res.status(404).json({ error: 'Bus not found' });
    res.json(bus);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bus' });
  }
};

const getBusByQR = async (req, res) => {
  try {
    const bus = await db.getBusByQR(req.params.qr_code);
    if (!bus) return res.status(404).json({ error: 'Bus not found' });
    res.json(bus);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bus' });
  }
};

const getBusesByRoute = async (req, res) => {
  try {
    const buses = await db.getBusesByRoute(req.params.route_id);
    res.json(buses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch buses' });
  }
};

const createBus = async (req, res) => {
  try {
    const { bus_number, plate_number, route_id } = req.body;
    if (!bus_number || !plate_number) {
      return res.status(400).json({ error: 'Bus number and plate number are required' });
    };
     if (route_id) {
      const routeExists = await routedb.getRouteById(route_id);
      if (!routeExists || (Array.isArray(routeExists) && routeExists.length === 0)) {
        return res.status(404).json({ error: `Route with ID ${route_id} does not exist` });
      }
    }
    const qr_code = `BUS-${bus_number}-${Date.now()}`;
    const bus = await db.createBus(bus_number, plate_number, qr_code, route_id);
    res.status(201).json(bus);
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create bus' ,details: err.message});
  }
};

const updateBusRoute = async (req, res) => {
  try {
    const { route_id } = req.body;
    const bus = await db.updateBusRoute(req.params.id, route_id);
    if (!bus) return res.status(404).json({ error: 'Bus not found' });
    res.json(bus);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update bus route' });
  }
};

const updateBusLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const bus = await db.updateBusLocation(req.params.bus_number, lat, lng);
    if (!bus) return res.status(404).json({ error: 'Bus not found' });
    res.json(bus);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update bus location' });
  }
};

const updateBusStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'inactive', 'out_of_service'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    const bus = await db.updateBusStatus(req.params.id, status);
    if (!bus) return res.status(404).json({ error: 'Bus not found' });
    res.json(bus);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update bus status' });
  }
};

const deleteBus = async (req, res) => {
  try {
    await db.deleteBus(req.params.id);
    res.json({ message: 'Bus deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete bus' });
  }
};

export {
  getAllBuses,
  getBusByNumber,
  getBusByQR,
  getBusesByRoute,
  createBus,
  updateBusRoute,
  updateBusLocation,
  updateBusStatus,
  deleteBus
};