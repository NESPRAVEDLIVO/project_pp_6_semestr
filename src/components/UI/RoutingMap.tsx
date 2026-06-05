import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Фикс иконок для Leaflet в React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
const DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

interface RoutingMapProps {
  stops: { address: string; type: string }[];
}

// 💡 БЭКЕНД-ПАЗ: Временный словарь координат. Позже бэкенд будет возвращать [lat, lng] для любого адреса.
const CITY_COORDS: Record<string, [number, number]> = {
  'rotterdam': [51.9225, 4.47917],
  'warsaw': [52.2297, 21.0122],
  'berlin': [52.5200, 13.4050],
  'munich': [48.1351, 11.5820],
  'hamburg': [53.5511, 9.9937],
  'milan': [45.4642, 9.1900],
  'antwerp': [51.2194, 4.4025],
  'lyon': [45.7640, 4.8357],
  'paris': [48.8566, 2.3522],
  'madrid': [40.4168, -3.7038]
};

// Компонент для авто-центрирования камеры
const MapAutoFitter = ({ positions }: { positions: [number, number][] }) => {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [30, 30] });
    } else {
      map.setView([51.1657, 10.4515], 4); // Центр Европы по умолчанию
    }
  }, [positions, map]);
  return null;
};

export const RoutingMap: React.FC<RoutingMapProps> = ({ stops }) => {
  const [positions, setPositions] = useState<[number, number][]>([]);

  useEffect(() => {
    const coords: [number, number][] = [];
    stops.forEach(stop => {
      // Ищем город по совпадению подстроки (например "Rotterdam, NL" -> 'rotterdam')
      const match = Object.keys(CITY_COORDS).find(city => stop.address.toLowerCase().includes(city));
      if (match) coords.push(CITY_COORDS[match]);
    });
    setTimeout(() => setPositions(coords), 0);
  }, [stops]);

  return (
    <div style={{ height: '220px', width: '100%', borderRadius: '0 0 12px 12px', overflow: 'hidden' }}>
      <MapContainer center={[51.1657, 10.4515]} zoom={4} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        {positions.map((pos, i) => (
          <Marker key={i} position={pos} />
        ))}
        {positions.length > 1 && (
          <Polyline positions={positions} color="#3D5AFE" weight={3} dashArray="5, 10" />
        )}
        <MapAutoFitter positions={positions} />
      </MapContainer>
    </div>
  );
};