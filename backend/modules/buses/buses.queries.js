import pool from "../../db/db.js";

const getAllBuses = async () => {
  const result = await pool.query(
    `SELECT b.*, r.route_number, r.origin, r.destination 
     FROM buses b
     LEFT JOIN routes r ON r.id = b.route_id
     ORDER BY b.bus_number ASC`
  );
  return result.rows;
};

const getBusByNumber = async (bus_number) => {
  const result = await pool.query(
    `SELECT b.*, r.route_number, r.origin, r.destination 
     FROM buses b
     LEFT JOIN routes r ON r.id = b.route_id
     WHERE b.bus_number = $1`,
    [bus_number]
  );
  return result.rows[0];
};

const getBusByQR  = async(qr_code)=>{
  const result = await pool.query(
    `SELECT b.* ,r.route_number  ,r.origin ,r.destination
    FROM  buses b 
    LEFT JOIN routes r ON r.id= b.route_id
    WHERE
    b.qr_code = $1` ,[qr_code]
  );
  return result.rows[0];
}

const getBusesByRoute = async (route_id) => {
  const result = await pool.query(
    `SELECT * FROM buses WHERE route_id = $1 
     ORDER BY bus_number ASC`,
    [route_id]
  );
  return result.rows;
};

const createBus = async (bus_number, plate_number, qr_code, route_id) => {
  const result = await pool.query(
    `INSERT INTO buses (bus_number, plate_number, qr_code, route_id) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [bus_number, plate_number, qr_code, route_id]
  );
  return result.rows[0];
};

const updateBusRoute = async (id, route_id) => {
  const result = await pool.query(
    `UPDATE buses SET route_id = $1 
     WHERE id = $2 RETURNING *`,
    [route_id, id]
  );
  return result.rows[0];
};

const updateBusLocation = async (bus_number, lat, lng) => {
  const result = await pool.query(
    `UPDATE buses 
     SET last_lat = $1, last_lng = $2, last_seen_at = NOW()
     WHERE bus_number = $3 RETURNING *`,
    [lat, lng, bus_number]
  );
  return result.rows[0];
};

const updateBusStatus = async (id, status) => {
  const result = await pool.query(
    `UPDATE buses SET status = $1 
     WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return result.rows[0];
};

const deleteBus = async (id) => {
  await pool.query('DELETE FROM buses WHERE id = $1', [id]);
};

export  {
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