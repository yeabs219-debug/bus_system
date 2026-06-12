import * as db from "./stop-prices.queries.js"

const getPricesByStop = async (req, res) => {
  try {
    const prices = await db.getPricesByStop(req.params.stop_id);
    res.json(prices);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
};

const getPriceByStopAndDirection = async (req, res) => {
  try {
    const { stop_id, direction } = req.params;
    const price = await db.getPriceByStopAndDirection(stop_id, direction);
    if (!price) return res.status(404).json({ error: 'Price not found' });
    res.json(price);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch price' });
  }
};

const createStopPrice = async (req, res) => {
  try {
    const { stop_id, direction, price } = req.body;
    if (!stop_id || !direction || !price) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (!['forward', 'reverse'].includes(direction)) {
      return res.status(400).json({ error: 'Direction must be forward or reverse' });
    }
    const stopPrice = await db.createStopPrice(stop_id, direction, price);
    res.status(201).json(stopPrice);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create stop price' });
  }
};

const updateStopPrice = async (req, res) => {
  try {
    const { price } = req.body;
    const stopPrice = await db.updateStopPrice(req.params.id, price);
    if (!stopPrice) return res.status(404).json({ error: 'Price not found' });
    res.json(stopPrice);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update price' });
  }
};

const deleteStopPrice = async (req, res) => {
  try {
    await db.deleteStopPrice(req.params.id);
    res.json({ message: 'Stop price deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete stop price' });
  }
};

export  {
  getPricesByStop,
  getPriceByStopAndDirection,
  createStopPrice,
  updateStopPrice,
  deleteStopPrice
};