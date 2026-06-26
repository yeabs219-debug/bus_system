import { useEffect, useState } from 'react';
import {
  getDrivers,
  createDriver,
  deleteDriver,
  getBuses,
  getRoutes,
  getActiveTrips,
  createTrip,
  endTrip,
} from '../api/client';

export default function TripsPage() {
  const [drivers, setDrivers] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [activeTrips, setActiveTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newDriverName, setNewDriverName] = useState('');
  const [tripForm, setTripForm] = useState({
    bus_number: '',
    driver_id: '',
    route_number: '',
    direction: 'forward',
  });

  const loadAll = () => {
    setLoading(true);
    Promise.all([getDrivers(), getBuses(), getRoutes(), getActiveTrips()])
      .then(([d, b, r, t]) => {
        setDrivers(d);
        setBuses(b);
        setRoutes(r);
        setActiveTrips(t);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadAll, []);

  const handleCreateDriver = async (e) => {
    e.preventDefault();
    try {
      await createDriver({ name: newDriverName });
      setNewDriverName('');
      loadAll();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteDriver = async (id) => {
    try {
      await deleteDriver(id);
      loadAll();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStartTrip = async (e) => {
    e.preventDefault();
    setError('');
  console.log('Looking for bus number:', JSON.stringify(tripForm.bus_number.trim()));
  console.log('Available buses:', buses.map(b => b.bus_number));
    try {
      const bus = buses.find((b) => b.bus_number == tripForm.bus_number.trim());
          console.log('Found bus:', bus);

      if (!bus) {
        setError(`No bus found with number "${tripForm.bus_number}"`);
        return;
      }
      const route = routes.find((r) => r.route_number === tripForm.route_number.trim());
      if (!route) {
        setError(`No route found with number "${tripForm.route_number}"`);
        return;
      }
      await createTrip({
        bus_id: bus.id,
        driver_id: tripForm.driver_id,
        route_id: route.id,
        direction: tripForm.direction,
      });
      setTripForm({ bus_number: '', driver_id: '', route_number: '', direction: 'forward' });
      loadAll();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEndTrip = async (id) => {
    try {
      await endTrip(id);
      loadAll();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="px-8 py-7">
      <h1 className="font-display text-3xl text-ink mb-1">Trips & Drivers</h1>
      <p className="font-body text-sm text-ink/50 mb-7">
        Start and end trips, manage your driver roster
      </p>

      {error && (
        <p className="mb-4 px-4 py-3 rounded-lg bg-signal/10 text-signal font-body text-sm">
          {error}
        </p>
      )}

      <div className="grid grid-cols-[1fr_320px] gap-6 mb-6">
        <div className="bg-panel border border-line rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-body font-medium text-ink">Active trips</h2>
            <span className="font-body text-xs text-ink/40">{activeTrips.length} running</span>
          </div>

          {loading && <p className="font-body text-sm text-ink/40">Loading…</p>}
          {!loading && activeTrips.length === 0 && (
            <p className="font-body text-sm text-ink/40">No trips running right now.</p>
          )}

          <div className="space-y-2">
            {activeTrips.map((trip) => (
              <div
                key={trip.id}
                className="flex items-center justify-between py-2.5 border-b border-line last:border-0"
              >
                <div>
                  <p className="font-body text-sm font-medium text-ink">
                    Bus {trip.bus_number} · Route {trip.route_number}
                  </p>
                  <p className="font-body text-xs text-ink/45">
                    {trip.origin} → {trip.destination} · {trip.direction} · started{' '}
                    {new Date(trip.started_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <button
                  onClick={() => handleEndTrip(trip.id)}
                  className="px-3 py-1.5 rounded-lg bg-ink text-paper font-body text-xs font-medium"
                >
                  End trip
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-panel border border-line rounded-xl p-5 self-start">
          <h2 className="font-body font-medium text-ink mb-4">Start a trip</h2>
          <form onSubmit={handleStartTrip} className="space-y-2.5">
            <input
              value={tripForm.bus_number}
              onChange={(e) => setTripForm({ ...tripForm, bus_number: e.target.value })}
              placeholder="Bus number (e.g. 1234)"
              required
              className="w-full px-3 py-2.5 rounded-lg border border-line bg-paper font-body text-sm focus:outline-none focus:ring-2 focus:ring-transit"
            />
            <select
              value={tripForm.driver_id}
              onChange={(e) => setTripForm({ ...tripForm, driver_id: e.target.value })}
              required
              className="w-full px-3 py-2.5 rounded-lg border border-line bg-paper font-body text-sm focus:outline-none focus:ring-2 focus:ring-transit"
            >
              <option value="">Select driver</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <input
              value={tripForm.route_number}
              onChange={(e) => setTripForm({ ...tripForm, route_number: e.target.value })}
              placeholder="Route number (e.g. 3)"
              required
              className="w-full px-3 py-2.5 rounded-lg border border-line bg-paper font-body text-sm focus:outline-none focus:ring-2 focus:ring-transit"
            />
            <select
              value={tripForm.direction}
              onChange={(e) => setTripForm({ ...tripForm, direction: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-line bg-paper font-body text-sm focus:outline-none focus:ring-2 focus:ring-transit"
            >
              <option value="forward">Forward</option>
              <option value="reverse">Reverse</option>
            </select>
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-transit text-paper font-body text-sm font-medium"
            >
              Start trip
            </button>
          </form>
        </div>
      </div>

      <div className="bg-panel border border-line rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-body font-medium text-ink">Drivers</h2>
          <span className="font-body text-xs text-ink/40">{drivers.length} registered</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {drivers.map((d) => (
            <span
              key={d.id}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-paper border border-line font-body text-sm text-ink"
            >
              {d.name}
              <button
                onClick={() => handleDeleteDriver(d.id)}
                className="text-ink/30 hover:text-signal"
                aria-label={`Remove ${d.name}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <form onSubmit={handleCreateDriver} className="flex gap-2 max-w-sm">
          <input
            value={newDriverName}
            onChange={(e) => setNewDriverName(e.target.value)}
            placeholder="Driver name"
            required
            className="flex-1 px-3 py-2.5 rounded-lg border border-line bg-paper font-body text-sm focus:outline-none focus:ring-2 focus:ring-transit"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-lg bg-transit text-paper font-body text-sm font-medium"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}