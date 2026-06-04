import React from 'react';
import type { LoadData } from '../../types';
import mapBg from '../../assets/map.png';

interface Props {
  load: LoadData;
}

export const DetailRouteMap: React.FC<Props> = ({ load }) => {
  return (
    <div className="detail-card">
      <div className="dash-route-map-header">
        <div>
          <h3 className="dash-detail-desc-title">Route: {load.from} → {load.to}</h3>
          <p className="dash-route-map-title-sub">{load.extraRoute ? `Via ${load.extraRoute} · ` : ''}Multi-lane routing</p>
        </div>
        <div className="route-tabs">
          <button className="route-tab active">Driving</button>
          <button className="route-tab">Rail</button>
          <button className="route-tab">Combined</button>
        </div>
      </div>
      
      <div className="detail-map">
        <img src={mapBg} alt="Route map" />
        <div className="detail-map-zoom">
          <button className="zoom-btn">+</button>
          <button className="zoom-btn">−</button>
        </div>
      </div>
    </div>
  );
};