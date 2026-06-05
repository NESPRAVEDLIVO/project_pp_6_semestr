import React, { useState, useEffect, useMemo } from 'react';
import type { PageType, LoadData, NavigationPayload } from '../../types';
import { Sidebar } from '../../components/Layout/Sidebar';
import { loadsService } from '../../services/loadsService';

interface MyListingsPageProps {
  onNavigate: (page: PageType, payload?: NavigationPayload) => void;
}

// 💡 БЭКЕНД-ПАЗ: Статусы будут приходить напрямую из базы данных
interface MyLoadData extends LoadData {
  status: 'active' | 'pending' | 'draft' | 'archived';
}

export const MyListingsPage: React.FC<MyListingsPageProps> = ({ onNavigate }) => {
  const [loads, setLoads] = useState<MyLoadData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'pending' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMyLoads = async () => {
      setIsLoading(true);
      try {
        // 💡 БЭКЕНД-ПАЗ: Здесь будет axios.get('/api/users/me/loads')
        const data = await loadsService.getAllLoads();
        const safeData = (Array.isArray(data) ? data : []) as LoadData[];
        
        // ВРЕМЕННЫЙ МОК СТАТУСОВ
        const loadsWithStatus: MyLoadData[] = safeData.slice(0, 7).map((load, index) => {
          let status: MyLoadData['status'] = 'active';
          if (index === 1) status = 'pending';
          if (index === 3) status = 'draft';
          return { ...load, status };
        });
        
        setLoads(loadsWithStatus);
      } catch (error) {
        console.error("Data fetch error:", error);
        setLoads([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyLoads();
  }, []);

  const filteredLoads = useMemo(() => {
    if (!Array.isArray(loads)) return [];
    return loads.filter(load => {
      const matchesTab = activeTab === 'all' || load.status === activeTab;
      const matchesSearch = (load.id || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (load.from || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (load.to || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [loads, activeTab, searchQuery]);

  const counts = {
    all: Array.isArray(loads) ? loads.length : 0,
    active: Array.isArray(loads) ? loads.filter(l => l.status === 'active').length : 0,
    pending: Array.isArray(loads) ? loads.filter(l => l.status === 'pending').length : 0,
    draft: Array.isArray(loads) ? loads.filter(l => l.status === 'draft').length : 0,
  };

  const getStatusBadge = (status: string) => {
    const labels: Record<string, string> = { active: 'Active', pending: 'In review', draft: 'Draft', archived: 'Closed' };
    return <span className={`status-pill ${status}`}>{labels[status]}</span>;
  };

  return (
    <div className="dashboard-page active">
      <Sidebar onNavigate={onNavigate} activePage="listings" />
      
      <main className="dash-main" style={{ background: '#F6F7FB', minHeight: '100vh' }}>
        
        {/* HEADER */}
        <header className="create-header" style={{ padding: '16px 48px' }}>
          <div>
            <div className="dash-breadcrumb">
              <span className="dash-detail-breadcrumb-clickable" onClick={() => onNavigate('dashboard')}>Workspace</span> 
              <span className="dash-detail-breadcrumb-arrow"> › </span> 
              <strong style={{color: '#0E1116'}}>My listings</strong>
            </div>
            <h1 className="create-header-title">My listings</h1>
          </div>
          
          <div className="create-header-actions">
            <button className="btn-figma-primary" onClick={() => onNavigate('create-load')}>
              + New listing
            </button>
            <div className="dash-notify">🔔</div>
          </div>
        </header>

        <div className="my-listings-layout">
          
          {/* БЛОК 1: ВКЛАДКИ И ПОИСК (Отдельная белая карточка по ТЗ) */}
          <div className="my-listings-toolbar-card">
            <div className="my-listings-tabs">
              <button className={`my-listings-tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
                All <span className="tab-count">{counts.all}</span>
              </button>
              <button className={`my-listings-tab ${activeTab === 'active' ? 'active' : ''}`} onClick={() => setActiveTab('active')}>
                Active <span className="tab-count">{counts.active}</span>
              </button>
              <button className={`my-listings-tab ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>
                Pending <span className="tab-count">{counts.pending}</span>
              </button>
              <button className={`my-listings-tab ${activeTab === 'draft' ? 'active' : ''}`} onClick={() => setActiveTab('draft')}>
                Drafts <span className="tab-count">{counts.draft}</span>
              </button>
            </div>
            
            <div className="my-listings-actions-right">
              <div className="my-listings-search-wrapper">
                <span className="search-icon">🔍</span>
                <input 
                  type="text" 
                  placeholder="Search by ID, city, cargo..." 
                  className="my-listings-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="btn-figma-secondary">
                <span style={{ fontSize: '16px' }}>⚙</span> Filter
              </button>
            </div>
          </div>

          {/* БЛОК 2: ТАБЛИЦА (Отдельная белая карточка по ТЗ) */}
          <div className="my-listings-table-card">
            {isLoading ? (
              <div className="dash-loading-container" style={{ padding: '60px' }}>⏳ Loading your listings...</div>
            ) : filteredLoads.length === 0 ? (
              <div className="dash-loading-container" style={{ padding: '60px', flexDirection: 'column', gap: '16px' }}>
                <div style={{ fontSize: '48px' }}>📦</div>
                <div style={{ color: '#0E1116', fontWeight: 600 }}>No listings found</div>
                <div style={{ fontSize: '14px' }}>Try changing your filters or create a new listing.</div>
              </div>
            ) : (
              <table className="my-listings-table figma-table">
                <thead>
                  <tr>
                    <th style={{ paddingLeft: '24px' }}>Listing ID & Date</th>
                    <th>Route</th>
                    <th>Cargo & Vehicle</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right', paddingRight: '24px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLoads.map((load) => (
                    <tr 
                      key={load.id} 
                      style={{ cursor: 'pointer' }} 
                      // 💡 ПЕРЕДАЕМ ПАРАМЕТР fromPage, ЧТОБЫ УМНЫЕ КРОШКИ ПОНЯЛИ ОТКУДА МЫ ПРИШЛИ
                      onClick={() => onNavigate('load-detail', { loadId: load.id, fromPage: 'my-listings' })}
                    >
                      <td style={{ paddingLeft: '24px' }}>
                        <div className="load-id" style={{ color: '#3D5AFE', fontWeight: 600, fontSize: '14px' }}>{load.id}</div>
                        <div className="date-cell" style={{ fontSize: '13px', marginTop: '4px' }}>{load.dateStart}</div>
                      </td>
                      <td>
                        <div className="lane-cell">
                          {load.from} <span className="lane-arrow">›</span> {load.to}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '14px', fontWeight: 500, color: '#0E1116' }}>{load.cargo}</div>
                        <div style={{ fontSize: '13px', color: '#5C6470', marginTop: '4px' }}>
                          {load.mass} • {load.volume} • {load.vehicle}
                        </div>
                      </td>
                      <td>
                        <div className="price-cell" style={{ color: '#0E1116' }}>{load.price}</div>
                        <div style={{ fontSize: '12px', color: '#888' }}>excl. VAT</div>
                      </td>
                      <td>
                        {getStatusBadge(load.status)}
                      </td>
                      <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                          <button className="btn-icon-action" title="Edit">✎</button>
                          <button className="btn-icon-action danger" title="Delete">🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
        </div>
      </main>
    </div>
  );
};