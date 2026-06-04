import React, { useState, useEffect } from 'react';
import type { PageType, LoadData } from '../../types';
import { Sidebar } from '../../components/Layout/Sidebar';
import { DetailHeaderCard } from '../../components/UI/DetailHeaderCard';
import { DetailRouteMap } from '../../components/UI/DetailRouteMap';
import { DetailSpecs } from '../../components/UI/DetailSpecs';
import { DetailRightPanel } from '../../components/UI/DetailRightPanel';
import { loadsService } from '../../services/loadsService';

interface LoadDetailPageProps {
  onNavigate: (page: PageType, payload?: { loadId?: string }) => void;
  loadId?: string | null;
}

export const LoadDetailPage: React.FC<LoadDetailPageProps> = ({ onNavigate, loadId }) => {
  const [load, setLoad] = useState<LoadData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLoad = async () => {
      if (!loadId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const data = await loadsService.getLoadById(loadId);
      if (data) setLoad(data);
      setIsLoading(false);
    };
    fetchLoad();
  }, [loadId]);

  if (isLoading) {
    return (
      <div className="load-detail-page active">
        <Sidebar onNavigate={onNavigate} activePage="dashboard" />
        <div className="dash-loading-container">
          <div>⏳ Loading details...</div>
        </div>
      </div>
    );
  }

  if (!load) {
    return (
      <div className="load-detail-page active">
        <Sidebar onNavigate={onNavigate} activePage="dashboard" />
        <div className="dash-error-container">
          <h2>Load not found</h2>
          <button className="btn-primary dash-error-btn" onClick={() => onNavigate('dashboard')}>← Back to Search</button>
        </div>
      </div>
    );
  }

  return (
    <div className="load-detail-page active">
      <Sidebar onNavigate={onNavigate} activePage="dashboard" />
      
      <div className="dash-detail-wrapper">
        <div className="detail-main">
          <div className="detail-header">
            <div 
              className="detail-breadcrumb dash-detail-breadcrumb-clickable" 
              onClick={() => onNavigate('dashboard')}
            >
              Marketplace <span className="dash-detail-breadcrumb-arrow">›</span> <strong className="dash-detail-breadcrumb-current">{load.id}</strong>
            </div>
            <div className="detail-actions">
              <button className="detail-action-btn">☆ Save</button>
              <button className="detail-action-btn">↗ Share</button>
              <div className="dash-notify">🔔</div>
            </div>
          </div>
          
          <DetailHeaderCard load={load} />
          <DetailRouteMap load={load} />
          <DetailSpecs load={load} />
        </div>
        
        <DetailRightPanel load={load} />
      </div>
    </div>
  );
};