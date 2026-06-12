import * as db from './stops.queries.js'
const getStopsByRoute = async (req, res) => {
  try {
    const stops = await db.getStopsByRoute(req.params.route_id);
    res.json(stops);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stops' });
  }
};

const getStopById = async (req, res) => {
  try {
    const stop = await db.getStopById(req.params.id);
    if (!stop) return res.status(404).json({ error: 'Stop not found' });
    res.json(stop);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stop' });
  }
};

const createStop = async (req, res) => {
  try {
    const { route_id, name, latitude, longitude, stop_order } = req.body;
    if (!route_id || !name || !latitude || !longitude || !stop_order) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const stop = await db.createStop(
      route_id, name, latitude, longitude, stop_order
    );
    res.status(201).json(stop);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create stop' });
  }
};

const updateStop = async (req, res) => {
  try {
    const { name, latitude, longitude, stop_order } = req.body;
    const stop = await db.updateStop(
      req.params.id, name, latitude, longitude, stop_order
    );
    if (!stop) return res.status(404).json({ error: 'Stop not found' });
    res.json(stop);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update stop' });
  }
};

const deleteStop = async (req, res) => {
  try {
    await db.deleteStop(req.params.id);
    res.json({ message: 'Stop deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete stop' });
  }
};

export {
  getStopsByRoute,
  getStopById,
  createStop,
  updateStop,
  deleteStop
};