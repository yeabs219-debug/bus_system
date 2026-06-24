import { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { getStopsByRoute, getBusesByRoute, SOCKET_URL } from '../api/client';
import RouteMap from '../components/RouteMap';

export default function RoutePage() {
  const { routeId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const route = state?.route;

  const [stops, setStops] = useState([]);
  const [buses, setBuses] = useState([]);
  const [busPositions, setBusPositions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([getStopsByRoute(routeId), getBusesByRoute(routeId)])
      .then(([stopsData, busesData]) => {
        if (!active) return;
        setStops(stopsData);
        setBuses(busesData);

        const initialPositions = {};
        busesData.forEach((bus) => {
          if (bus.last_lat && bus.last_lng) {
            initialPositions[bus.id] = {
              lat: bus.last_lat,
              lng: bus.last_lng,
              bus_number: bus.bus_number,
              stop_name: '',
            };
          }
        });
        setBusPositions(initialPositions);
      })
      .catch(() => active && setError('Could not load this route. Try again.'))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [routeId]);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on('bus-location-update', (data) => {
      setBusPositions((prev) => ({
        ...prev,
        [data.bus_id]: {
          lat: data.lat,
          lng: data.lng,
          bus_number: data.bus_number,
          stop_name: data.stop_name,
        },
      }));
    });

    return () => socket.disconnect();
  }, []);

  const busList = Object.entries(busPositions);

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <header className="px-6 py-5 flex items-center gap-4 border-b border-line bg-card">
        <button
          onClick={() => navigate(-1)}
          className="text-ink/50 hover:text-ink transition-colors font-body text-sm"
          aria-label="Back to search"
        >
          ← Back
        </button>
        <div>
          <span className="font-display text-2xl text-transit leading-none">
            {route?.route_number ?? '—'}
          </span>
          <p className="font-body text-xs text-ink/50 mt-0.5">
            {route?.origin ?? 'Origin'} to {route?.destination ?? 'Destination'}
          </p>
        </div>
      </header>

      {loading && (
        <div className="flex-1 flex items-center justify-center font-body text-ink/50">
          Loading route…
        </div>
      )}

      {error && (
        <div className="flex-1 flex items-center justify-center px-6">
          <p className="font-body text-ink/70 bg-card border border-line rounded-xl p-4 text-center">
            {error}
          </p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="h-[40vh] relative">
            <RouteMap stops={stops} busPosition={busList[0]?.[1]} />
          </div>

          <div className="flex-1 px-6 py-6">
            <p className="text-xs font-body text-ink/45 uppercase tracking-[0.15em] mb-3">
              {busList.length > 0
                ? `${busList.length} bus${busList.length > 1 ? 'es' : ''} on this route`
                : 'No buses active right now'}
            </p>

            <div className="space-y-3 mb-8">
              {busList.map(([busId, pos]) => (
                <div
                  key={busId}
                  className="bg-card border border-line rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-body font-medium text-ink">Bus {pos.bus_number}</p>
                    <p className="font-body text-sm text-ink/50">
                      {pos.stop_name ? `Near ${pos.stop_name}` : 'Tracking…'}
                    </p>
                  </div>
                  <Link
                    to="/scan"
                    state={{ route }}
                    className="px-4 py-2 rounded-lg bg-signal text-paper font-body text-sm font-medium"
                  >
                    Board &amp; pay
                  </Link>
                </div>
              ))}
            </div>

            <p className="text-xs font-body text-ink/45 uppercase tracking-[0.15em] mb-3">
              All stops
            </p>
            <div className="relative pl-3">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-line" />
              <div className="space-y-4">
                {stops.map((stop) => (
                  <div key={stop.id} className="flex items-center gap-3 relative">
                    <span className="w-3.5 h-3.5 rounded-full bg-card border-2 border-transit z-10" />
                    <span className="font-body text-sm text-ink/80">{stop.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
