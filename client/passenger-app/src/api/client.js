const BASE_URL = 'http://localhost:5000/api';

async function handle(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const searchRoutes = (origin, destination) =>
  fetch(
    `${BASE_URL}/routes/search?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`
  ).then(handle);

export const getStopsByRoute = (routeId) =>
  fetch(`${BASE_URL}/stops/route/${routeId}`).then(handle);

export const getBusesByRoute = (routeId) =>
  fetch(`${BASE_URL}/buses/route/${routeId}`).then(handle);

export const payByQR = (qrCode) =>
  fetch(`${BASE_URL}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ qr_code: qrCode }),
  }).then(handle);

export const SOCKET_URL = 'http://localhost:5000';
