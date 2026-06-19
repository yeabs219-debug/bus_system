import * as db from "./drivers.queries.js"

const getAllDrivers = async (req, res) => {
  try {
    const drivers = await db.getAllDrivers();
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
};

const getDriverById = async (req, res) => {
  try {
    const driver = await db.getDriverById(req.params.id);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch driver' });
  }
};

const createDriver = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const driver = await db.createDriver(name);
    res.status(201).json(driver);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create driver' });
  }
};

const deleteDriver = async (req, res) => {
  try {
    await db.deleteDriver(req.params.id);
    res.json({ message: 'Driver deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete driver' });
  }
};

export {
  getAllDrivers,
  getDriverById,
  createDriver,
  deleteDriver
};