import pool from "../../db/db.js"

const getAllDrivers = async () => {
  const result = await pool.query(
    'SELECT id, name, created_at FROM drivers ORDER BY created_at DESC'
  );
  return result.rows;
};

const getDriverById = async (id) => {
  const result = await pool.query(
    'SELECT id, name, created_at FROM drivers WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

const createDriver = async (name) => {
  const result = await pool.query(
    `INSERT INTO drivers (name) 
     VALUES ($1) RETURNING id, name, created_at`,
    [name]
  );
  return result.rows[0];
};

const deleteDriver = async (id) => {
  await pool.query('DELETE FROM drivers WHERE id = $1', [id]);
};

export {
  getAllDrivers,
  getDriverById,
  createDriver,
  deleteDriver
};