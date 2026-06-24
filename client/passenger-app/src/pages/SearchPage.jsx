import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchRoutes } from '../api/client';

export default function SearchPage() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!origin.trim() || !destination.trim()) return;

    setLoading(true);
    setError('');
    setResults(null);
    try {
      const routes = await searchRoutes(origin.trim(), destination.trim());
      setResults(routes);
      if (routes.length === 0) {
        setError(`No route connects "${origin}" and "${destination}" yet.`);
      }
    } catch (err) {
      setError('Could not reach the server. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col items-center px-6 py-12">
      <div className="w-full max-w-md">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-transit mb-2">
          City Transit
        </p>
        <h1 className="font-display text-4xl text-ink mb-1 leading-tight">
          Where to?
        </h1>
        <p className="font-body text-ink/60 mb-9">
          Enter where you're starting and where you're headed.
        </p>

        <form onSubmit={handleSearch} className="space-y-0">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-transit z-10" />
            <input
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Starting point"
              autoComplete="off"
              className="w-full pl-11 pr-4 py-4 rounded-t-xl border border-line bg-card font-body text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-transit focus:z-20 relative"
            />
          </div>

          <div className="flex pl-[1.45rem] -my-px relative z-0">
            <div className="w-px h-5 bg-line" />
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-sm bg-signal z-10" />
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Destination"
              autoComplete="off"
              className="w-full pl-11 pr-4 py-4 rounded-b-xl border border-line bg-card font-body text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-transit focus:z-20 relative -mt-px"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-transit text-paper font-body font-medium mt-4 disabled:opacity-60 transition-opacity active:scale-[0.99]"
          >
            {loading ? 'Searching…' : 'Find my bus'}
          </button>
        </form>

        {error && (
          <p className="mt-6 text-sm font-body text-ink/70 bg-card border border-line rounded-xl p-4 leading-relaxed">
            {error}
          </p>
        )}

        {results && results.length > 0 && (
          <div className="mt-9">
            <p className="text-xs font-body text-ink/45 uppercase tracking-[0.15em] mb-3">
              {results.length} route{results.length > 1 ? 's' : ''} found
            </p>
            <div className="space-y-3">
              {results.map((route) => (
                <button
                  key={route.id}
                  onClick={() => navigate(`/route/${route.id}`, { state: { route } })}
                  className="w-full text-left bg-card border border-line rounded-xl p-4 hover:border-transit transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-3xl text-transit leading-none">
                      {route.route_number}
                    </span>
                    <span className="text-[10px] font-body font-medium uppercase tracking-[0.15em] text-ink/40 group-hover:text-transit transition-colors">
                      {route.direction} →
                    </span>
                  </div>
                  <p className="font-body text-sm text-ink/60 mt-1.5">
                    {route.origin} to {route.destination}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
