import pool from '../../db/db.js'

const getStopsByRoute = async (route_id) => {
  const result = await pool.query(
    `SELECT * FROM stops 
     WHERE route_id = $1 
     ORDER BY stop_order ASC`,
    [route_id]
  );
  return result.rows;
};

const getStopById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM stops WHERE id = $1', [id]
  );
  return result.rows[0];
};

const createStop = async (route_id, name, latitude, longitude, stop_order) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      `UPDATE stops 
       SET stop_order = stop_order + 1 
       WHERE route_id = $1 AND stop_order >= $2`,
      [route_id, stop_order]
    );

    const result = await client.query(
      `INSERT INTO stops (route_id, name, latitude, longitude, stop_order) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [route_id, name, latitude, longitude, stop_order]
    );

    await client.query('COMMIT');
    return result.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const updateStop = async (id, name, latitude, longitude, stop_order) => {
  const result = await pool.query(
    `UPDATE stops 
     SET name = $1, latitude = $2, longitude = $3, stop_order = $4
     WHERE id = $5 RETURNING *`,
    [name, latitude, longitude, stop_order, id]
  );
  return result.rows[0];
};

const deleteStop = async (id) => {
  await pool.query('DELETE FROM stops WHERE id = $1', [id]);
};

export {
  getStopsByRoute,
  getStopById,
  createStop,
  updateStop,
  deleteStop
};