import { useEffect, useState } from 'react';
import { getBuses, createBus, assignBusRoute, deleteBus, getRoutes } from '../api/client';

export default function FleetPage() {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newBus, setNewBus] = useState({ bus_number: '', plate_number: '' });

  const loadData = () => {
    setLoading(true);
    Promise.all([getBuses(), getRoutes()])
      .then(([busesData, routesData]) => {
        setBuses(busesData);
        setRoutes(routesData);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadData, []);

  const handleCreateBus = async (e) => {
    e.preventDefault();
    try {
      await createBus(newBus);
      setNewBus({ bus_number: '', plate_number: '' });
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAssignRoute = async (busId, routeId) => {
    try {
      await assignBusRoute(busId, routeId || null);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteBus = async (id) => {
    try {
      await deleteBus(id);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const statusStyles = {
    active: 'bg-transit/10 text-transit',
    inactive: 'bg-ink/5 text-ink/50',
    out_of_service: 'bg-signal/10 text-signal',
  };

  return (
    <div className="px-8 py-7">
      <h1 className="font-display text-3xl text-ink mb-1">Fleet</h1>
      <p className="font-body text-sm text-ink/50 mb-7">
        Manage buses and route assignments
      </p>

      {error && (
        <p className="mb-4 px-4 py-3 rounded-lg bg-signal/10 text-signal font-body text-sm">
          {error}
        </p>
      )}

      <div className="grid grid-cols-[1fr_320px] gap-6">
        <div className="bg-panel border border-line rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-body font-medium text-ink">All buses</h2>
            <span className="font-body text-xs text-ink/40">{buses.length} total</span>
          </div>

          {loading && <p className="font-body text-sm text-ink/40">Loading…</p>}

          {!loading && (
            <table>
              <thead>
                <tr className="text-left">
                  <th className="font-body text-xs uppercase tracking-wide text-ink/45 pb-2 pr-3">Bus</th>
                  <th className="font-body text-xs uppercase tracking-wide text-ink/45 pb-2 pr-3">Plate</th>
                  <th className="font-body text-xs uppercase tracking-wide text-ink/45 pb-2 pr-3">Route</th>
                  <th className="font-body text-xs uppercase tracking-wide text-ink/45 pb-2 pr-3">Status</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody>
                {buses.map((bus) => (
                  <tr key={bus.id} className="border-b border-line last:border-0 hover:bg-paper">
                    <td className="py-2.5 pr-3 font-body text-sm font-medium text-ink">
                      {bus.bus_number}
                    </td>
                    <td className="py-2.5 pr-3 font-body text-sm text-ink/60">
                      {bus.plate_number}
                    </td>
                    <td className="py-2.5 pr-3">
                      <select
                        value={bus.route_id ?? ''}
                        onChange={(e) => handleAssignRoute(bus.id, e.target.value)}
                        className="px-2 py-1.5 rounded-md border border-line bg-paper font-body text-sm focus:outline-none focus:ring-2 focus:ring-transit"
                      >
                        <option value="">Unassigned</option>
                        {routes.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.route_number} — {r.origin} to {r.destination}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2.5 pr-3">
                      <span
                        className={`px-2 py-1 rounded-md font-body text-xs ${
                          statusStyles[bus.status] ?? statusStyles.inactive
                        }`}
                      >
                        {bus.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => handleDeleteBus(bus.id)}
                        className="text-ink/30 hover:text-signal font-body text-xs"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-panel border border-line rounded-xl p-5 self-start">
          <h2 className="font-body font-medium text-ink mb-4">Register a bus</h2>
          <form onSubmit={handleCreateBus} className="space-y-2.5">
            <input
              value={newBus.bus_number}
              onChange={(e) => setNewBus({ ...newBus, bus_number: e.target.value })}
              placeholder="Bus number (e.g. 1234)"
              required
              className="w-full px-3 py-2.5 rounded-lg border border-line bg-paper font-body text-sm focus:outline-none focus:ring-2 focus:ring-transit"
            />
            <input
              value={newBus.plate_number}
              onChange={(e) => setNewBus({ ...newBus, plate_number: e.target.value })}
              placeholder="Plate number"
              required
              className="w-full px-3 py-2.5 rounded-lg border border-line bg-paper font-body text-sm focus:outline-none focus:ring-2 focus:ring-transit"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-transit text-paper font-body text-sm font-medium"
            >
              Add bus
            </button>
          </form>
          <p className="font-body text-xs text-ink/40 mt-3 leading-relaxed">
            A QR code is generated automatically. Routes can be assigned now or later from the table.
          </p>
        </div>
      </div>
    </div>
  );
}