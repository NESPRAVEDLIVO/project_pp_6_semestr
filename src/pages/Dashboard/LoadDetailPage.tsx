import React, { useEffect, useState } from 'react';
import type { PageType, LoadData, NavigationPayload } from '../../types';
import { Sidebar } from '../../components/Layout/Sidebar';
import { loadsService } from '../../services/loadsService';
import { DetailHeaderCard } from '../../components/UI/DetailHeaderCard';
import { DetailRouteMap } from '../../components/UI/DetailRouteMap';
import { DetailSpecs } from '../../components/UI/DetailSpecs';
import { DetailRightPanel } from '../../components/UI/DetailRightPanel';

interface LoadDetailPageProps {
  onNavigate: (page: PageType, payload?: NavigationPayload) => void;
  loadId?: string | null;
  fromPage?: string; 
}

export const LoadDetailPage: React.FC<LoadDetailPageProps> = ({ onNavigate, loadId, fromPage }) => {
  const [load, setLoad] = useState<LoadData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLoad = async () => {
      if (!loadId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const allLoads = await loadsService.getAllLoads();
        let found = allLoads.find(l => l.id === loadId);
        
        // ЗАЩИТА ОТ ПУСТОТЫ: Если мы пришли из My Listings и ID моковый (CL-...)
        if (!found && loadId.startsWith('CL-')) {
          found = {
            id: loadId,
            company: 'Nordhafen',
            from: 'Rotterdam',
            to: 'Warsaw',
            dateStart: 'May 12',
            cargo: 'FMCG · 22 plt',
            mass: '22 t',
            volume: '60 m³',
            vehicle: 'Tautliner trailer',
            price: '€ 1,840',
            match: 100
          };
        } else if (!found) {
          found = allLoads[0]; // Фолбэк на первый груз, если ничего не найдено
        }
        
        setLoad(found);
      } catch (error) {
        console.error("Error fetching detail:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLoad();
  }, [loadId]);

  if (isLoading) {
    return (
      <div className="load-detail-page active">
        <Sidebar onNavigate={onNavigate} activePage={fromPage === 'my-listings' ? 'listings' : 'dashboard'} />
        <div style={{ flex: 1, marginLeft: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: '#888', fontSize: '18px' }}>⏳ Loading details...</div>
        </div>
      </div>
    );
  }

  if (!load) {
    return (
      <div className="load-detail-page active">
        <Sidebar onNavigate={onNavigate} activePage={fromPage === 'my-listings' ? 'listings' : 'dashboard'} />
        <div style={{ flex: 1, marginLeft: '240px', padding: '40px' }}>
          <h2>Load not found</h2>
          <button className="btn-figma-primary" onClick={() => onNavigate('dashboard')} style={{ marginTop: '20px' }}>← Back to Search</button>
        </div>
      </div>
    );
  }

  return (
    <div className="load-detail-page active">
      <Sidebar onNavigate={onNavigate} activePage={fromPage === 'my-listings' ? 'listings' : 'dashboard'} />
      
      <main className="detail-main">
        <header className="detail-header">
          {/* УМНЫЕ ХЛЕБНЫЕ КРОШКИ */}
          <div className="detail-breadcrumb">
            {fromPage === 'my-listings' ? (
              <>
                <span className="dash-detail-breadcrumb-clickable" onClick={() => onNavigate('dashboard')}>Workspace</span>
                <span className="dash-detail-breadcrumb-arrow"> › </span>
                <span className="dash-detail-breadcrumb-clickable" onClick={() => onNavigate('my-listings')}>My listings</span>
                <span className="dash-detail-breadcrumb-arrow"> › </span>
              </>
            ) : (
              <>
                <span className="dash-detail-breadcrumb-clickable" onClick={() => onNavigate('dashboard')}>Marketplace</span>
                <span className="dash-detail-breadcrumb-arrow"> › </span>
              </>
            )}
            <strong className="dash-detail-breadcrumb-current">{load.id}</strong>
          </div>

          <div className="detail-actions">
            <button className="detail-action-btn"><span>☆</span> Save</button>
            <button className="detail-action-btn"><span>↗</span> Share</button>
            <div className="dash-notify">🔔</div>
          </div>
        </header>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <DetailHeaderCard load={load} />
            <DetailRouteMap load={load} />
            <DetailSpecs load={load} />
          </div>
          <DetailRightPanel load={load} />
        </div>
      </main>
    </div>
  );
};