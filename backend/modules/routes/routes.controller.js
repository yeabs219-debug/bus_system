import * as db from './routes.queries.js';
const getAllRoutes = async (req, res) => {
  try {
    const routes = await db.getAllRoutes();
    res.json(routes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch routes' });
  }
};

const getRouteById = async (req, res) => {
  try {
    const route = await db.getRouteById(req.params.id);
    if (!route) return res.status(404).json({ error: 'Route not found' });
    res.json(route);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch route' });
  }
};

const getRouteByNumber = async (req, res) => {
  try {
    const route = await db.getRouteByNumber(req.params.route_number);
    if (!route) return res.status(404).json({ error: 'Route not found' });
    res.json(route);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch route' });
  }
};

const searchRoutesByTrip = async (req, res) => {
  try {
    const { origin, destination } = req.query;
    if (!origin || !destination) {
      return res.status(400).json({ error: 'Origin and destination are required' });
    }

    const rows = await db.searchRoutesByStops(origin, destination);

    const seen = new Set();
    const results = [];
    for (const route of rows) {
      if (seen.has(route.id)) continue;
      seen.add(route.id);
      results.push({
        ...route,
        direction: route.origin_stop_order < route.destination_stop_order
          ? 'forward'
          : 'reverse'
      });
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to search routes' });
  }
};

const createRoute = async (req, res) => {
  try {
    const { route_number, name, origin, destination } = req.body;
    if (!route_number || !name || !origin || !destination) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const route = await db.createRoute(route_number, name, origin, destination);
    res.status(201).json(route);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create route' });
  }
};

const updateRoute = async (req, res) => {
  try {
    const { route_number, name, origin, destination, is_active } = req.body;
    const route = await db.updateRoute(
      req.params.id, route_number, name, origin, destination, is_active
    );
    if (!route) return res.status(404).json({ error: 'Route not found' });
    res.json(route);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update route' });
  }
};

const deleteRoute = async (req, res) => {
  try {
    await db.deleteRoute(req.params.id);
    res.json({ message: 'Route deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete route' });
  }
};

export { 
  getAllRoutes, 
  getRouteById, 
  getRouteByNumber,
  searchRoutesByTrip,
  createRoute, 
  updateRoute, 
  deleteRoute 
};