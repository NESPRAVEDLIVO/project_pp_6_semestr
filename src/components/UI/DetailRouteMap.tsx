import React from 'react';
import type { LoadData } from '../../types';
import { RoutingMap } from './RoutingMap'; // Импортируем живую карту

interface Props {
  load: LoadData;
}

export const DetailRouteMap: React.FC<Props> = ({ load }) => {
  // Собираем точки для передачи в карту
  const mapStops = [
    { address: load.from || 'Rotterdam', type: 'start' }
  ];
  if (load.extraRoute) {
    mapStops.push({ address: load.extraRoute.replace('+ ', ''), type: 'stop' });
  }
  mapStops.push({ address: load.to || 'Warsaw', type: 'end' });

  return (
    <div className="detail-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Route: {load.from} → {load.to}</h3>
          <p style={{ fontSize: '13px', color: '#888' }}>
            {load.extraRoute ? `Via ${load.extraRoute.replace('+ ', '')} · ` : ''}Multi-lane routing
          </p>
        </div>
        <div className="route-tabs">
          <button className="route-tab active">Driving</button>
          <button className="route-tab">Rail</button>
          <button className="route-tab">Combined</button>
        </div>
      </div>
      
      {/* Живая карта маршрута вместо картинки! */}
      <div style={{ height: '350px', width: '100%', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
        <RoutingMap stops={mapStops} />
      </div>
    </div>
  );
};