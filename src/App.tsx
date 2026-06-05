import React, { useState } from 'react';
import './styles/global.css';
import type { PageType, NavigationPayload } from './types';

// Импорты страниц
import { LandingPage } from './pages/Landing/LandingPage';
import { SignInPage } from './pages/Auth/SignInPage';
import { SignUpPage } from './pages/Auth/SignUpPage';
import { RecoveryPage } from './pages/Auth/RecoveryPage';
import { SearchPage } from './pages/Dashboard/SearchPage';
import { SavedPage } from './pages/Dashboard/SavedPage';
import { LoadDetailPage } from './pages/Dashboard/LoadDetailPage';
import { CreateLoadPage } from './pages/Dashboard/CreateLoadPage';
import { MyListingsPage } from './pages/Dashboard/MyListingsPage';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [currentPayload, setCurrentPayload] = useState<NavigationPayload | null>(null);

  const handleNavigate = (page: PageType, payload?: NavigationPayload) => {
    setCurrentPage(page);
    if (payload) {
      setCurrentPayload(payload);
    }
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    try {
      switch (currentPage) {
        case 'landing':
          return <LandingPage onNavigate={handleNavigate} />;
        case 'signin':
          return <SignInPage onNavigate={handleNavigate} />;
        case 'signup':
          return <SignUpPage onNavigate={handleNavigate} />;
        case 'recovery':
          return <RecoveryPage onNavigate={handleNavigate} />;
        case 'dashboard':
          return <SearchPage onNavigate={handleNavigate} />;
        case 'saved':
          return <SavedPage onNavigate={handleNavigate} />;
        case 'load-detail':
          return <LoadDetailPage onNavigate={handleNavigate} loadId={currentPayload?.loadId} fromPage={currentPayload?.fromPage} />;
        case 'create-load':
          return <CreateLoadPage onNavigate={handleNavigate} />;
        case 'my-listings':
          return <MyListingsPage onNavigate={handleNavigate} />;
        default:
          return <SearchPage onNavigate={handleNavigate} />;
      }
    } catch (error) {
      console.error("Render Error:", error);
      return <div style={{ padding: '40px', color: 'red' }}>Error loading page. Check console.</div>;
    }
  };

  return (
    <div className="app">
      {renderPage()}
    </div>
  );
}

export default App;