import pool from "../../db/db.js"

const getActiveTrips = async () => {
  const result = await pool.query(
    `SELECT t.*, b.bus_number, r.route_number, r.origin, r.destination
     FROM trips t
     JOIN buses b ON b.id = t.bus_id
     JOIN routes r ON r.id = t.route_id
     WHERE t.status = 'active'`
  );
  return result.rows;
};

const getTripById = async (id) => {
  const result = await pool.query(
    `SELECT t.*, b.bus_number, r.route_number, r.origin, r.destination
     FROM trips t
     JOIN buses b ON b.id = t.bus_id
     JOIN routes r ON r.id = t.route_id
     WHERE t.id = $1`,
    [id]
  );
  return result.rows[0];
};

const getActiveTripByBus = async (bus_id) => {
  const result = await pool.query(
    `SELECT * FROM trips 
     WHERE bus_id = $1 AND status = 'active'`,
    [bus_id]
  );
  return result.rows[0];
};

const createTrip = async (bus_id, driver_id, route_id, direction) => {
  const result = await pool.query(
    `INSERT INTO trips (bus_id, driver_id, route_id, direction) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [bus_id, driver_id, route_id, direction]
  );
  return result.rows[0];
};

const endTrip = async (id) => {
  const result = await pool.query(
    `UPDATE trips 
     SET status = 'completed', ended_at = NOW() 
     WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
};

export {
  getActiveTrips,
  getTripById,
  getActiveTripByBus,
  createTrip,
  endTrip
};