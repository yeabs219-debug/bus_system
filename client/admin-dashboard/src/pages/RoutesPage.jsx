import { useEffect, useState } from 'react';
import {
  getRoutes,
  createRoute,
  deleteRoute,
  getStopsByRoute,
  createStop,
  deleteStop,
  bulkSetPrices,
 getPricesByStop 
} from '../api/client';

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [stops, setStops] = useState([]);
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [loadingStops, setLoadingStops] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [error, setError] = useState('');

  const [newRoute, setNewRoute] = useState({ route_number: '', name: '', origin: '', destination: '' });
  const [newStop, setNewStop] = useState({ name: '', latitude: '', longitude: '', stop_order: '' });
  const [priceDrafts, setPriceDrafts] = useState({});

  const loadRoutes = () => {
    setLoadingRoutes(true);
    getRoutes()
      .then(setRoutes)
      .catch((e) => setError(e.message))
      .finally(() => setLoadingRoutes(false));
  };

  useEffect(loadRoutes, []);

  const selectRoute = async (route) => {
  setSelectedRoute(route);
  setLoadingStops(true);
  try {
    const stopsData = await getStopsByRoute(route.id);
    setStops(stopsData);

    const drafts = {};
    await Promise.all(
      stopsData.map(async (stop) => {
        const existing = await getPricesByStop(stop.id);
        const forward = existing.find((p) => p.direction === 'forward');
        const reverse = existing.find((p) => p.direction === 'reverse');
        drafts[stop.id] = {
          forward: forward ? String(forward.price) : '',
          reverse: reverse ? String(reverse.price) : '',
        };
      })
    );
    setPriceDrafts(drafts);
  } catch (e) {
    setError(e.message);
  } finally {
    setLoadingStops(false);
  }
};

  const handleCreateRoute = async (e) => {
    e.preventDefault();
    try {
      await createRoute(newRoute);
      setNewRoute({ route_number: '', name: '', origin: '', destination: '' });
      loadRoutes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteRoute = async (id) => {
    try {
      await deleteRoute(id);
      if (selectedRoute?.id === id) {
        setSelectedRoute(null);
        setStops([]);
      }
      loadRoutes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateStop = async (e) => {
    e.preventDefault();
    try {
      await createStop({
        route_id: selectedRoute.id,
        name: newStop.name,
        latitude: parseFloat(newStop.latitude),
        longitude: parseFloat(newStop.longitude),
        stop_order: parseInt(newStop.stop_order, 10),
      });
      setNewStop({ name: '', latitude: '', longitude: '', stop_order: '' });
      selectRoute(selectedRoute);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteStop = async (id) => {
    try {
      await deleteStop(id);
      selectRoute(selectedRoute);
    } catch (err) {
      setError(err.message);
    }
  };

 const handleSaveAllPrices = async () => {
  const prices = [];
  Object.entries(priceDrafts).forEach(([stopId, vals]) => {
    if (vals.forward !== '') {
      prices.push({ stop_id: stopId, direction: 'forward', price: parseFloat(vals.forward) });
    }
    if (vals.reverse !== '') {
      prices.push({ stop_id: stopId, direction: 'reverse', price: parseFloat(vals.reverse) });
    }
  });
  if (prices.length === 0) return;

  try {
    await bulkSetPrices(prices);
    setError('');
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus(''), 2500);
  } catch (err) {
    setError(err.message);
  }
};

  return (
    <div className="px-8 py-7">
      <h1 className="font-display text-3xl text-ink mb-1">Routes & Stops</h1>
      <p className="font-body text-sm text-ink/50 mb-7">
        Manage routes, stop sequencing, and fares
      </p>

      {error && (
        <p className="mb-4 px-4 py-3 rounded-lg bg-signal/10 text-signal font-body text-sm">
          {error}
        </p>
      )}

      <div className="grid grid-cols-[340px_1fr] gap-6">
        {/* Left column - route list + create form */}
        <div className="space-y-5">
          <div className="bg-panel border border-line rounded-xl p-5">
            <h2 className="font-body font-medium text-ink mb-4">All routes</h2>
            {loadingRoutes && <p className="font-body text-sm text-ink/40">Loading…</p>}
            <div className="space-y-1">
              {routes.map((route) => (
                <div
                  key={route.id}
                  onClick={() => selectRoute(route)}
                  className={`px-3 py-2.5 rounded-lg cursor-pointer flex items-center justify-between group ${
                    selectedRoute?.id === route.id ? 'bg-transit/10' : 'hover:bg-paper'
                  }`}
                >
                  <div>
                    <span className="font-body text-sm font-medium text-ink">
                      {route.route_number}
                    </span>
                    <span className="font-body text-xs text-ink/45 ml-2">
                      {route.origin} → {route.destination}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRoute(route.id);
                    }}
                    className="text-ink/30 hover:text-signal font-body text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-panel border border-line rounded-xl p-5">
            <h2 className="font-body font-medium text-ink mb-4">Create route</h2>
            <form onSubmit={handleCreateRoute} className="space-y-2.5">
              <input
                value={newRoute.route_number}
                onChange={(e) => setNewRoute({ ...newRoute, route_number: e.target.value })}
                placeholder="Route number (e.g. 3)"
                required
                className="w-full px-3 py-2.5 rounded-lg border border-line bg-paper font-body text-sm focus:outline-none focus:ring-2 focus:ring-transit"
              />
              <input
                value={newRoute.name}
                onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
                placeholder="Route name"
                required
                className="w-full px-3 py-2.5 rounded-lg border border-line bg-paper font-body text-sm focus:outline-none focus:ring-2 focus:ring-transit"
              />
              <input
                value={newRoute.origin}
                onChange={(e) => setNewRoute({ ...newRoute, origin: e.target.value })}
                placeholder="Origin"
                required
                className="w-full px-3 py-2.5 rounded-lg border border-line bg-paper font-body text-sm focus:outline-none focus:ring-2 focus:ring-transit"
              />
              <input
                value={newRoute.destination}
                onChange={(e) => setNewRoute({ ...newRoute, destination: e.target.value })}
                placeholder="Destination"
                required
                className="w-full px-3 py-2.5 rounded-lg border border-line bg-paper font-body text-sm focus:outline-none focus:ring-2 focus:ring-transit"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-transit text-paper font-body text-sm font-medium"
              >
                Add route
              </button>
            </form>
          </div>
        </div>

        {/* Right column - stops + pricing for selected route */}
        <div>
          {!selectedRoute && (
            <div className="bg-panel border border-line rounded-xl p-10 text-center">
              <p className="font-body text-sm text-ink/40">
                Select a route to manage its stops and fares
              </p>
            </div>
          )}

          {selectedRoute && (
            <div className="space-y-5">
              <div className="bg-panel border border-line rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-body font-medium text-ink">
                    Stops on Route {selectedRoute.route_number}
                  </h2>
                  <span className="font-body text-xs text-ink/40">
                    {stops.length} stop{stops.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {loadingStops && <p className="font-body text-sm text-ink/40">Loading…</p>}

                {!loadingStops && stops.length > 0 && (
                  <table className="mb-4">
                    <thead>
                      <tr className="text-left">
                        <th className="font-body text-xs uppercase tracking-wide text-ink/45 pb-2 pr-3">Order</th>
                        <th className="font-body text-xs uppercase tracking-wide text-ink/45 pb-2 pr-3">Stop</th>
                        <th className="font-body text-xs uppercase tracking-wide text-ink/45 pb-2 pr-3">Forward</th>
                        <th className="font-body text-xs uppercase tracking-wide text-ink/45 pb-2 pr-3">Reverse</th>
                        <th className="pb-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {stops.map((stop) => (
                        <tr key={stop.id} className="border-b border-line last:border-0">
                          <td className="py-2.5 pr-3 font-body text-sm text-ink/60">{stop.stop_order}</td>
                          <td className="py-2.5 pr-3 font-body text-sm text-ink">{stop.name}</td>
                          <td className="py-2.5 pr-3">
                            <input
                              type="number"
                              step="0.01"
                              placeholder="birr"
                              value={priceDrafts[stop.id]?.forward ?? ''}
                              onChange={(e) =>
                                setPriceDrafts((prev) => ({
                                  ...prev,
                                  [stop.id]: { ...prev[stop.id], forward: e.target.value },
                                }))
                              }
                              className="w-20 px-2 py-1.5 rounded-md border border-line bg-paper font-body text-sm focus:outline-none focus:ring-2 focus:ring-transit"
                            />
                          </td>
                          <td className="py-2.5 pr-3">
                            <input
                              type="number"
                              step="0.01"
                              placeholder="birr"
                              value={priceDrafts[stop.id]?.reverse ?? ''}
                              onChange={(e) =>
                                setPriceDrafts((prev) => ({
                                  ...prev,
                                  [stop.id]: { ...prev[stop.id], reverse: e.target.value },
                                }))
                              }
                              className="w-20 px-2 py-1.5 rounded-md border border-line bg-paper font-body text-sm focus:outline-none focus:ring-2 focus:ring-transit"
                            />
                          </td>
                          <td className="py-2.5 text-right">
                            <button
                              onClick={() => handleDeleteStop(stop.id)}
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

                {!loadingStops && stops.length > 0 && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSaveAllPrices}
                      className="px-4 py-2 rounded-lg bg-signal text-paper font-body text-sm font-medium"
                    >
                      Save all fares
                    </button>
                    {saveStatus === 'saved' && (
                      <span className="font-body text-sm text-transit">✓ Fares updated</span>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-panel border border-line rounded-xl p-5">
                <h2 className="font-body font-medium text-ink mb-4">Add a stop</h2>
                <form onSubmit={handleCreateStop} className="grid grid-cols-4 gap-2.5">
                  <input
                    value={newStop.name}
                    onChange={(e) => setNewStop({ ...newStop, name: e.target.value })}
                    placeholder="Stop name"
                    required
                    className="px-3 py-2.5 rounded-lg border border-line bg-paper font-body text-sm focus:outline-none focus:ring-2 focus:ring-transit"
                  />
                  <input
                    value={newStop.latitude}
                    onChange={(e) => setNewStop({ ...newStop, latitude: e.target.value })}
                    placeholder="Latitude"
                    required
                    type="number"
                    step="0.000001"
                    className="px-3 py-2.5 rounded-lg border border-line bg-paper font-body text-sm focus:outline-none focus:ring-2 focus:ring-transit"
                  />
                  <input
                    value={newStop.longitude}
                    onChange={(e) => setNewStop({ ...newStop, longitude: e.target.value })}
                    placeholder="Longitude"
                    required
                    type="number"
                    step="0.000001"
                    className="px-3 py-2.5 rounded-lg border border-line bg-paper font-body text-sm focus:outline-none focus:ring-2 focus:ring-transit"
                  />
                  <input
                    value={newStop.stop_order}
                    onChange={(e) => setNewStop({ ...newStop, stop_order: e.target.value })}
                    placeholder="Order"
                    required
                    type="number"
                    className="px-3 py-2.5 rounded-lg border border-line bg-paper font-body text-sm focus:outline-none focus:ring-2 focus:ring-transit"
                  />
                  <button
                    type="submit"
                    className="col-span-4 py-2.5 rounded-lg bg-transit text-paper font-body text-sm font-medium"
                  >
                    Add stop
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}