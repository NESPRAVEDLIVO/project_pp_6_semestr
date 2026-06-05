import React, { useState, useEffect, useMemo } from 'react';
import type { PageType, LoadData } from '../../types';
import { Sidebar } from '../../components/Layout/Sidebar';
import { FilterBar } from '../../components/UI/FilterBar';
import type { FilterState } from '../../components/UI/FilterBar';
import { LoadsTable } from '../../components/UI/LoadsTable';
import { MapPanel } from '../../components/UI/MapPanel';
import { loadsService } from '../../services/loadsService';

interface SearchPageProps {
  onNavigate: (page: PageType, payload?: { loadId?: string }) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ onNavigate }) => {
  const [loads, setLoads] = useState<LoadData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedLoadId, setSelectedLoadId] = useState<string | null>(null);

  // Стейт для фильтров (теперь все 7 параметров из макета)
  const initialFilters: FilterState = { 
    from: '', to: '', date: '', cargo: '', mass: '', volume: '', vehicle: '' 
  };
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  
  const [sortBy, setSortBy] = useState<string>('Best match');

  useEffect(() => {
    const fetchLoads = async () => {
      setIsLoading(true);
      // 💡 БЭКЕНД-ПАЗ: В будущем здесь будет запрос на сервер с параметрами:
      // const params = new URLSearchParams(filters as any).toString();
      // const data = await loadsService.getAllLoads(`?${params}&sort=${sortBy}`);
      const data = await loadsService.getAllLoads();
      setLoads(data);
      setIsLoading(false);
    };
    fetchLoads();
  }, []); // При реальном бэкенде в зависимости useEffect нужно будет добавить `filters` и `sortBy`

  const handleFilterChange = (key: keyof FilterState | 'reset', value: string) => {
    if (key === 'reset') {
      setFilters(initialFilters);
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
    setSelectedLoadId(null); 
  };

  // 💡 ВРЕМЕННАЯ ЛОГИКА ДЛЯ МОКОВ: Умная клиентская фильтрация
  const filteredAndSortedLoads = useMemo(() => {
    let result = [...loads];

    // Применяем строковые фильтры
    if (filters.from) result = result.filter(load => load.from.includes(filters.from));
    if (filters.to) result = result.filter(load => load.to.includes(filters.to));
    if (filters.date) result = result.filter(load => load.dateStart.includes(filters.date));
    if (filters.vehicle) result = result.filter(load => load.vehicle === filters.vehicle);
    if (filters.cargo) result = result.filter(load => load.cargo.toLowerCase().includes(filters.cargo.toLowerCase()));

    // Применяем числовые фильтры (вытаскиваем числа из строк '18.2 t' и '76 m³')
    if (filters.mass) {
      result = result.filter(load => {
        const massValue = parseFloat(load.mass);
        if (filters.mass === '< 15 t') return massValue < 15;
        if (filters.mass === '>= 15 t') return massValue >= 15;
        return true;
      });
    }

    if (filters.volume) {
      result = result.filter(load => {
        const volValue = parseFloat(load.volume);
        if (filters.volume === '< 50 m³') return volValue < 50;
        if (filters.volume === '>= 50 m³') return volValue >= 50;
        return true;
      });
    }

    // Применяем сортировку
    result.sort((a, b) => {
      if (sortBy === 'Match (High to Low)') return b.match - a.match;
      if (sortBy === 'Price (Low to High)' || sortBy === 'Price (High to Low)') {
        const priceA = parseInt(a.price.replace(/[^0-9]/g, ''), 10);
        const priceB = parseInt(b.price.replace(/[^0-9]/g, ''), 10);
        return sortBy === 'Price (High to Low)' ? priceB - priceA : priceA - priceB;
      }
      return 0;
    });

    return result;
  }, [loads, filters, sortBy]);

  const handleNavigateDetails = (id: string) => {
    onNavigate('load-detail', { loadId: id });
  };

  const selectedLoad = filteredAndSortedLoads.find(load => load.id === selectedLoadId) || null;

  return (
    <div className="dashboard-page active">
      <Sidebar onNavigate={onNavigate} activePage="dashboard" />
      
      <main className="dash-main">
        <header className="dash-header">
          <div className="dash-breadcrumb">
            Marketplace <span className="dash-detail-breadcrumb-arrow">›</span> <strong>Search</strong>
          </div>
          <div className="dash-header-right">
            <input type="text" className="dash-search" placeholder="🔍 Search lanes, cargo, ID..." />
            <button className="dash-post-btn" onClick={() => onNavigate('create-load')} style={{ background: '#3D5AFE' }}>+ Post load</button>
            <div className="dash-notify">🔔</div>
          </div>
        </header>
        
        <FilterBar filters={filters} onFilterChange={handleFilterChange} />
        
        <div className="dash-content">
          <div className="dash-table-area">
            <div className="dash-stats-bar">
              <div>
                <span className="dash-stat-number">
                  {filteredAndSortedLoads.length.toLocaleString()} <span>matching loads</span>
                </span>
                <span className="dash-stat-growth">+12% today</span>
              </div>
              <div className="dash-sort">
                Sort
                <select 
                  className="dash-sort-select" 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="Best match">Best match</option>
                  <option value="Match (High to Low)">Match (High to Low)</option>
                  <option value="Price (High to Low)">Price (High to Low)</option>
                  <option value="Price (Low to High)">Price (Low to High)</option>
                </select>
              </div>
            </div>
            
            {isLoading ? (
              <div className="dash-loading-container">⏳ Connecting...</div>
            ) : filteredAndSortedLoads.length === 0 ? (
              <div className="dash-loading-container" style={{ color: '#ea4335' }}>
                No loads found matching your filters.
              </div>
            ) : (
              <LoadsTable 
                loads={filteredAndSortedLoads} 
                selectedId={selectedLoadId}
                onSelect={(id) => setSelectedLoadId(id)}
                onNavigateDetails={handleNavigateDetails}
              />
            )}
          </div>
          
          <MapPanel 
            loadsCount={filteredAndSortedLoads.length} 
            selectedLoad={selectedLoad} 
            onViewDetails={handleNavigateDetails} 
          />
        </div>
      </main>
    </div>
  );
};