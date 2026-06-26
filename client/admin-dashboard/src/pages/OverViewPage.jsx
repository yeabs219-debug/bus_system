import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { getActiveTrips, getRevenue, SOCKET_URL } from '../api/client';

export default function OverviewPage() {
  const [trips, setTrips] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [livePositions, setLivePositions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([getActiveTrips(), getRevenue()])
      .then(([tripsData, revenueData]) => {
        if (!active) return;
        setTrips(tripsData);
        setRevenue(revenueData);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socket.on('bus-location-update', (data) => {
      setLivePositions((prev) => ({ ...prev, [data.bus_id]: data }));
    });
    return () => socket.disconnect();
  }, []);

  const totalRevenue = revenue.reduce((sum, r) => sum + Number(r.total_revenue), 0);
  const totalTickets = revenue.reduce((sum, r) => sum + Number(r.total_tickets), 0);
  const maxRevenue = Math.max(...revenue.map((r) => Number(r.total_revenue)), 1);

  return (
    <div className="px-8 py-7">
      <h1 className="font-display text-3xl text-ink mb-1">Overview</h1>
      <p className="font-body text-sm text-ink/50 mb-7">
        Live fleet activity and route performance
      </p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Active trips" value={trips.length} />
        <StatCard label="Tickets issued" value={totalTickets} />
        <StatCard label="Total revenue" value={`${totalRevenue.toFixed(2)} birr`} accent />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-panel border border-line rounded-xl p-5">
          <h2 className="font-body font-medium text-ink mb-4">Active trips</h2>
          {loading && <p className="font-body text-sm text-ink/40">Loading…</p>}
          {!loading && trips.length === 0 && (
            <p className="font-body text-sm text-ink/40">No trips running right now.</p>
          )}
          <div className="space-y-2">
            {trips.map((trip) => {
              const live = livePositions[trip.bus_id];
              return (
                <div
                  key={trip.id}
                  className="flex items-center justify-between py-2.5 border-b border-line last:border-0"
                >
                  <div>
                    <p className="font-body text-sm font-medium text-ink">
                      Bus {trip.bus_number} · Route {trip.route_number}
                    </p>
                    <p className="font-body text-xs text-ink/45">
                      {trip.origin} → {trip.destination} · {trip.direction}
                    </p>
                  </div>
                  <span className="font-body text-xs text-transit">
                    {live ? `near ${live.stop_name}` : 'tracking…'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-panel border border-line rounded-xl p-5">
          <h2 className="font-body font-medium text-ink mb-4">Revenue by route</h2>
          {revenue.length === 0 && (
            <p className="font-body text-sm text-ink/40">No ticket data yet.</p>
          )}
          <div className="space-y-3">
            {revenue.map((r) => (
              <div key={r.route_number}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-body text-sm text-ink">
                    Route {r.route_number}
                  </span>
                  <span className="font-body text-sm text-ink/60">
                    {Number(r.total_revenue).toFixed(2)} birr · {r.total_tickets} tickets
                  </span>
                </div>
                <div className="h-2 bg-line rounded-full overflow-hidden">
                  <div
                    className="h-full bg-transit rounded-full"
                    style={{ width: `${(Number(r.total_revenue) / maxRevenue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className="bg-panel border border-line rounded-xl p-5">
      <p className="font-body text-xs uppercase tracking-[0.1em] text-ink/45 mb-1.5">
        {label}
      </p>
      <p className={`font-display text-3xl ${accent ? 'text-signal' : 'text-ink'}`}>
        {value}
      </p>
    </div>
  );
}