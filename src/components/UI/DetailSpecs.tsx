import React from 'react';
import type { LoadData } from '../../types';

interface Props {
  load: LoadData;
}

export const DetailSpecs: React.FC<Props> = ({ load }) => {
  return (
    <div className="detail-card">
      <h3 className="dash-detail-specs-title">Cargo Specifications</h3>
      <div className="specs-grid">
        <div className="spec-card">
          <div className="spec-label">Weight</div>
          <div className="spec-value">{load.mass}</div>
        </div>
        <div className="spec-card">
          <div className="spec-label">Volume</div>
          <div className="spec-value">{load.volume}</div>
        </div>
        <div className="spec-card">
          <div className="spec-label">Vehicle Type</div>
          <div className="spec-value" style={{ fontSize: '16px' }}>{load.vehicle}</div>
        </div>
        <div className="spec-card">
          <div className="spec-label">Commodity</div>
          <div className="spec-value" style={{ fontSize: '16px' }}>{load.cargo.split('·')[0].trim()}</div>
        </div>
      </div>
    </div>
  );
};