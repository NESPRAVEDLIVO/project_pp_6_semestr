import React from 'react';
import type { PageType } from '../../types';

interface SidebarProps {
  onNavigate: (page: PageType, payload?: { loadId?: string }) => void;
  activePage: 'dashboard' | 'saved' | 'listings' | 'messages' | 'settings';
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate, activePage }) => {
  return (
    <aside className="dash-sidebar">
      <div className="dash-sidebar-logo" style={{ cursor: 'pointer' }} onClick={() => onNavigate('landing')}>
        <div className="logo-icon">▲</div>
        Cargolane
      </div>
      
      <button 
        className="dash-new-listing" 
        onClick={() => onNavigate('create-load')}
        style={{ background: '#3D5AFE' }}
      >
        + New listing
      </button>
      
      <div className="dash-nav-section">Marketplace</div>
      <div 
        className={`dash-nav-item ${activePage === 'dashboard' ? 'active' : ''}`} 
        onClick={() => onNavigate('dashboard')}
      >
        <span>🔍</span> Search
      </div>
      <div 
        className={`dash-nav-item ${activePage === 'saved' ? 'active' : ''}`} 
        onClick={() => onNavigate('saved')}
      >
        <span>🔖</span> Saved searches
      </div>
      
      <div className="dash-nav-section">Workspace</div>
      <div 
        className={`dash-nav-item ${activePage === 'listings' ? 'active' : ''}`}
        onClick={() => onNavigate('my-listings')}
      >
        <span>📦</span> My listings
        <span className="dash-nav-badge">7</span>
      </div>
      <div className={`dash-nav-item ${activePage === 'messages' ? 'active' : ''}`}>
        <span>💬</span> Messages
        <span className="dash-nav-badge">1</span>
      </div>
      
      <div className="dash-nav-section">Other</div>
      <div className={`dash-nav-item ${activePage === 'settings' ? 'active' : ''}`}>
        <span>⚙️</span> Settings
      </div>
      
      <div className="dash-user">
        <div className="dash-user-avatar">EM</div>
        <div className="dash-user-info">
          <div className="dash-user-name">Elena Marek</div>
          <div className="dash-user-company">Nordhafen Logistics</div>
        </div>
      </div>
    </aside>
  );
};