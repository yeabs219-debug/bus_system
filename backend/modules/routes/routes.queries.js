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

const getRouteByNumber = async (route_number) => {
  const result = await pool.query(
    'SELECT * FROM routes WHERE route_number = $1',
    [route_number]
  );
  return result.rows[0];
};

const searchRoutesByStops = async (originText, destinationText) => {
  const result = await pool.query(
    `SELECT DISTINCT r.*, 
            s1.stop_order AS origin_stop_order,
            s2.stop_order AS destination_stop_order
     FROM routes r
     JOIN stops s1 ON s1.route_id = r.id
     JOIN stops s2 ON s2.route_id = r.id
     WHERE r.is_active = true
     AND LOWER(s1.name) LIKE LOWER($1)
     AND LOWER(s2.name) LIKE LOWER($2)
     AND s1.id != s2.id`,
    [`%${originText}%`, `%${destinationText}%`]
  );
  return result.rows;
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
  getRouteByNumber,
  searchRoutesByStops,
  createRoute, 
  updateRoute, 
  deleteRoute 
};