import pool from '../../db/db.js';
import { v4 as uuidv4 } from 'uuid';


const createTicket = async (trip_id, boarded_stop_id, amount_paid) => {
  const qr_token = uuidv4();
  const result = await pool.query(
    `INSERT INTO tickets (trip_id, boarded_stop_id, amount_paid, qr_token)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [trip_id, boarded_stop_id, amount_paid, qr_token]
  );
  return result.rows[0];
};

const getTicketByToken = async (qr_token) => {
  const result = await pool.query(
    `SELECT t.*, s.name AS boarded_stop_name, tr.route_id, tr.direction
     FROM tickets t
     JOIN stops s ON s.id = t.boarded_stop_id
     JOIN trips tr ON tr.id = t.trip_id
     WHERE t.qr_token = $1`,
    [qr_token]
  );
  return result.rows[0];
};

const getTicketsByTrip = async (trip_id) => {
  const result = await pool.query(
    'SELECT * FROM tickets WHERE trip_id = $1 ORDER BY issued_at DESC',
    [trip_id]
  );
  return result.rows;
};

const getRevenueByRoute = async () => {
  const result = await pool.query(
    `SELECT r.route_number, r.origin, r.destination,
            COUNT(t.id) AS total_tickets,
            COALESCE(SUM(t.amount_paid), 0) AS total_revenue
     FROM routes r
     LEFT JOIN trips tr ON tr.route_id = r.id
     LEFT JOIN tickets t ON t.trip_id = tr.id
     GROUP BY r.id, r.route_number, r.origin, r.destination
     ORDER BY total_revenue DESC`
  );
  return result.rows;
};

export {
  createTicket,
  getTicketByToken,
  getTicketsByTrip,
  getRevenueByRoute
};