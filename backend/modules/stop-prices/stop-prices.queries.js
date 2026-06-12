import pool from "../../db/db.js"
const getPricesByStop = async (stop_id) => {
  const result = await pool.query(
    'SELECT * FROM stop_prices WHERE stop_id = $1',
    [stop_id]
  );
  return result.rows;
};

const getPriceByStopAndDirection = async (stop_id, direction) => {
  const result = await pool.query(
    `SELECT * FROM stop_prices 
     WHERE stop_id = $1 AND direction = $2`,
    [stop_id, direction]
  );
  return result.rows[0];
};

const createStopPrice = async (stop_id, direction, price) => {
  const existing = await pool.query(
    `SELECT * FROM stop_prices 
     WHERE stop_id = $1 AND direction = $2`,
    [stop_id, direction]
  );
  if (existing.rows.length > 0) {
    throw new Error('Price for this stop and direction already exists');
  }
  const result = await pool.query(
    `INSERT INTO stop_prices (stop_id, direction, price) 
     VALUES ($1, $2, $3) RETURNING *`,
    [stop_id, direction, price]
  );
  return result.rows[0];
};

const updateStopPrice = async (id, price) => {
  const result = await pool.query(
    `UPDATE stop_prices SET price = $1 
     WHERE id = $2 RETURNING *`,
    [price, id]
  );
  return result.rows[0];
};

const deleteStopPrice = async (id) => {
  await pool.query('DELETE FROM stop_prices WHERE id = $1', [id]);
}
export {
  getPricesByStop,
  getPriceByStopAndDirection,
  createStopPrice,
  updateStopPrice,
  deleteStopPrice
}