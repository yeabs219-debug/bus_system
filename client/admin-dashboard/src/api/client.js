const BASE_URL = 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('admin_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem('admin_token');
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// Auth
export const login = (username, password) =>
  fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  });

// Routes
export const getRoutes = () => request('/routes');
export const createRoute = (body) => request('/routes', { method: 'POST', body: JSON.stringify(body) });
export const updateRoute = (id, body) => request(`/routes/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteRoute = (id) => request(`/routes/${id}`, { method: 'DELETE' });

// Stops
export const getStopsByRoute = (routeId) => request(`/stops/route/${routeId}`);
export const createStop = (body) => request('/stops', { method: 'POST', body: JSON.stringify(body) });
export const deleteStop = (id) => request(`/stops/${id}`, { method: 'DELETE' });

// Stop Prices
export const getPricesByStop = (stopId) => request(`/stop-prices/stop/${stopId}`);
export const bulkSetPrices = (prices) => request('/stop-prices/bulk', { method: 'POST', body: JSON.stringify({ prices }) });

// Buses
export const getBuses = () => request('/buses');
export const createBus = (body) => request('/buses', { method: 'POST', body: JSON.stringify(body) });
export const assignBusRoute = (id, route_id) => request(`/buses/${id}/route`, { method: 'PUT', body: JSON.stringify({ route_id }) });
export const deleteBus = (id) => request(`/buses/${id}`, { method: 'DELETE' });

// Drivers
export const getDrivers = () => request('/drivers');
export const createDriver = (body) => request('/drivers', { method: 'POST', body: JSON.stringify(body) });
export const deleteDriver = (id) => request(`/drivers/${id}`, { method: 'DELETE' });

// Trips
export const getActiveTrips = () => request('/trips/active');
export const createTrip = (body) => request('/trips', { method: 'POST', body: JSON.stringify(body) });
export const endTrip = (id) => request(`/trips/${id}/end`, { method: 'PUT' });

// Tickets / Revenue
export const getRevenue = () => request('/tickets/revenue');

export const SOCKET_URL = 'http://localhost:5000';
export const isLoggedIn = () => !!getToken();
export const saveToken = (token) => localStorage.setItem('admin_token', token);
export const logout = () => localStorage.removeItem('admin_token');