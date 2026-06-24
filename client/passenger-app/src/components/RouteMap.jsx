import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

const busIcon = L.divIcon({
  className: '',
  html: `<div style="
    width: 34px; height: 34px;
    background: #D6713A;
    border: 3px solid #F7F4EC;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.25);
    font-size: 16px;
  ">🚌</div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

export default function RouteMap({ stops, busPosition }) {
  const [center, setCenter] = useState(null);

  useEffect(() => {
    if (stops.length > 0) {
      const mid = stops[Math.floor(stops.length / 2)];
      setCenter([Number(mid.latitude), Number(mid.longitude)]);
    }
  }, [stops]);

  if (!center) return null;

  const linePath = stops.map((s) => [Number(s.latitude), Number(s.longitude)]);

  return (
    <MapContainer
      center={center}
      zoom={14}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Polyline positions={linePath} pathOptions={{ color: '#1E5945', weight: 3, opacity: 0.6 }} />

      {stops.map((stop) => (
        <CircleMarker
          key={stop.id}
          center={[Number(stop.latitude), Number(stop.longitude)]}
          radius={6}
          pathOptions={{
            color: '#1E5945',
            fillColor: '#F7F4EC',
            fillOpacity: 1,
            weight: 2,
          }}
        >
          <Popup>
            <span className="font-medium">{stop.name}</span>
          </Popup>
        </CircleMarker>
      ))}

      {busPosition && (
        <Marker position={[Number(busPosition.lat), Number(busPosition.lng)]} icon={busIcon}>
          <Popup>
            Bus {busPosition.bus_number} — near {busPosition.stop_name}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
