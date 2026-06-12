import pool from "../../db/db.js";

const getAllRoutes = async () => {
  const result = await pool.query(
    'SELECT * FROM routes ORDER BY created_at DESC'
  );
  return result.rows;
};

const getRouteById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM routes WHERE id = $1', [id]
  );
  return result.rows[0];
};

const createRoute = async (route_number, name, origin, destination) => {
  const result = await pool.query(
    `INSERT INTO routes (route_number, name, origin, destination) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [route_number, name, origin, destination]
  );
  return result.rows[0];
};

const updateRoute = async (id, route_number, name, origin, destination, is_active) => {
  const result = await pool.query(
    `UPDATE routes 
     SET route_number = $1, name = $2, origin = $3, destination = $4, is_active = $5
     WHERE id = $6 RETURNING *`,
    [route_number, name, origin, destination, is_active, id]
  );
  return result.rows[0];
};

const deleteRoute = async (id) => {
  await pool.query('DELETE FROM routes WHERE id = $1', [id]);
};

export{ 
  getAllRoutes, 
  getRouteById, 
  createRoute, 
  updateRoute, 
  deleteRoute 
};