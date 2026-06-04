import React from 'react';
import mapBg from '../../assets/map.png';
import type { LoadData } from '../../types';

interface MapPanelProps {
  loadsCount: number;
  selectedLoad: LoadData | null;
  onViewDetails: (id: string) => void;
}

export const MapPanel: React.FC<MapPanelProps> = ({ loadsCount, selectedLoad, onViewDetails }) => {
  return (
    <div className="dash-map-panel">
      <div className="dash-map-header">
        <h3>Map preview</h3>
        <span className="dash-map-count">{loadsCount.toLocaleString()} loads</span>
      </div>
      
      <div className="dash-map-container">
        {selectedLoad ? (
          <>
            <img src={mapBg} alt="Europe map" />
            <div className="dash-map-zoom">
              <button className="zoom-btn">+</button>
              <button className="zoom-btn">−</button>
            </div>
          </>
        ) : (
          <div className="dash-empty-state">Choose load to see details</div>
        )}
      </div>

      {selectedLoad && (
        <div className="dash-map-footer">
          <div className="dash-map-footer-label">Selected lane</div>
          <div className="dash-map-footer-route">{selectedLoad.from} → {selectedLoad.to}</div>
          <div className="dash-map-footer-action-row">
            <div className="dash-map-footer-meta">1,283 km · 2 stops</div>
            <button 
              className="btn-primary dash-map-footer-btn-specs" 
              onClick={() => onViewDetails(selectedLoad.id)}
            >
              Open details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};