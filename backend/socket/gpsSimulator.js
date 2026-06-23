import pool from "../db/db.js"
const startGPSSimulation = (io) => {
  setInterval(async () => {
    try {
      const activeTrips = await pool.query(
        `SELECT t.id, t.bus_id, t.route_id, t.direction, b.bus_number
         FROM trips t
         JOIN buses b ON b.id = t.bus_id
         WHERE t.status = 'active'`
      );

      for (const trip of activeTrips.rows) {
        const stopsResult = await pool.query(
          `SELECT * FROM stops WHERE route_id = $1 ORDER BY stop_order ASC`,
          [trip.route_id]
        );
        let stops = stopsResult.rows;

        if (trip.direction === 'reverse') {
          stops = stops.reverse();
        }

        if (stops.length === 0) continue;

        const busResult = await pool.query(
          'SELECT * FROM buses WHERE id = $1', [trip.bus_id]
        );
        const bus = busResult.rows[0];

        let nextIndex = 0;
        if (bus.last_lat && bus.last_lng) {
          const currentIndex = stops.findIndex(
            s => Number(s.latitude) === Number(bus.last_lat) &&
                 Number(s.longitude) === Number(bus.last_lng)
          );
          nextIndex = currentIndex >= 0 ? currentIndex + 1 : 0;
        }

        if (nextIndex >= stops.length) continue;

        const nextStop = stops[nextIndex];

        await pool.query(
          `UPDATE buses 
           SET last_lat = $1, last_lng = $2, last_seen_at = NOW()
           WHERE id = $3`,
          [nextStop.latitude, nextStop.longitude, trip.bus_id]
        );

        io.emit('bus-location-update', {
          bus_id: trip.bus_id,
          bus_number: trip.bus_number,
          lat: nextStop.latitude,
          lng: nextStop.longitude,
          stop_name: nextStop.name
        });

        console.log(`Bus ${trip.bus_number} moved to ${nextStop.name}`);
      }
    } catch (err) {
      console.error('GPS simulation error:', err);
    }
  }, 5000);
};

export default startGPSSimulation;