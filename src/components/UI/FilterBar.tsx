import React from 'react';

// 💡 БЭКЕНД-ПАЗ: Этот интерфейс идеально совпадает с DTO (Data Transfer Object), 
// который бэкендер сделает для GET-запроса поиска грузов.
export interface FilterState {
  from: string;
  to: string;
  date: string;
  cargo: string;
  mass: string;
  volume: string;
  vehicle: string;
}

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState | 'reset', value: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
  const handleChange = (key: keyof FilterState) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange(key, e.target.value);
  };

  const hasActiveFilters = Object.values(filters).some(val => val !== '');

  return (
    <div className="dash-filters">
      
      {/* 1. ОТКУДА */}
      <div className="filter-select-wrapper">
        <span className="filter-label">From</span>
        <select className="filter-select" value={filters.from} onChange={handleChange('from')}>
          <option value="">Any</option>
          <option value="Rotterdam">Rotterdam, NL</option>
          <option value="Hamburg">Hamburg, DE</option>
          <option value="Milan">Milan, IT</option>
          <option value="Antwerp">Antwerp, BE</option>
          <option value="Lyon">Lyon, FR</option>
          <option value="Gdańsk">Gdańsk, PL</option>
          <option value="Lisbon">Lisbon, PT</option>
        </select>
        <span className="filter-select-arrow">▼</span>
      </div>
      
      <button className="filter-btn-arrow">→</button>
      
      {/* 2. КУДА */}
      <div className="filter-select-wrapper">
        <span className="filter-label">To</span>
        <select className="filter-select" value={filters.to} onChange={handleChange('to')}>
          <option value="">Any</option>
          <option value="Warsaw">Warsaw, PL</option>
          <option value="Berlin">Berlin, DE</option>
          <option value="Munich">Munich, DE</option>
          <option value="Vienna">Vienna, AT</option>
          <option value="Madrid">Madrid, ES</option>
          <option value="Copenhagen">Copenhagen, DK</option>
          <option value="Bordeaux">Bordeaux, FR</option>
        </select>
        <span className="filter-select-arrow">▼</span>
      </div>

      {/* 3. ДАТА */}
      <div className="filter-select-wrapper">
        <span className="filter-label">Date</span>
        <select className="filter-select" value={filters.date} onChange={handleChange('date')}>
          <option value="">Any</option>
          <option value="May 12">May 12</option>
          <option value="May 13">May 13</option>
          <option value="May 14">May 14</option>
          <option value="May 15">May 15</option>
        </select>
        <span className="filter-select-arrow">▼</span>
      </div>

      {/* 4. ТИП ГРУЗА */}
      <div className="filter-select-wrapper">
        <span className="filter-label">Cargo</span>
        <select className="filter-select" value={filters.cargo} onChange={handleChange('cargo')}>
          <option value="">Any</option>
          <option value="FMCG">FMCG</option>
          <option value="Industrial">Industrial parts</option>
          <option value="Refrigerated">Refrigerated</option>
          <option value="Electronics">Electronics</option>
        </select>
        <span className="filter-select-arrow">▼</span>
      </div>

      {/* 5. МАССА */}
      <div className="filter-select-wrapper">
        <span className="filter-label">Mass</span>
        <select className="filter-select" value={filters.mass} onChange={handleChange('mass')}>
          <option value="">Any</option>
          <option value="< 15 t">Under 15 t</option>
          <option value=">= 15 t">15 t and above</option>
        </select>
        <span className="filter-select-arrow">▼</span>
      </div>

      {/* 6. ОБЪЕМ */}
      <div className="filter-select-wrapper">
        <span className="filter-label">Volume</span>
        <select className="filter-select" value={filters.volume} onChange={handleChange('volume')}>
          <option value="">Any</option>
          <option value="< 50 m³">Under 50 m³</option>
          <option value=">= 50 m³">50 m³ and above</option>
        </select>
        <span className="filter-select-arrow">▼</span>
      </div>

      {/* 7. ТИП ТРАНСПОРТА */}
      <div className="filter-select-wrapper">
        <span className="filter-label">Vehicle</span>
        <select className="filter-select" value={filters.vehicle} onChange={handleChange('vehicle')}>
          <option value="">Any</option>
          <option value="Tautliner">Tautliner</option>
          <option value="Mega trailer">Mega trailer</option>
          <option value="Reefer">Reefer</option>
          <option value="Container">Container</option>
          <option value="Curtainsider">Curtainsider</option>
          <option value="Box truck">Box truck</option>
        </select>
        <span className="filter-select-arrow">▼</span>
      </div>
      
      {/* КНОПКА СБРОСА (Справа) */}
      {hasActiveFilters && (
        <button 
          className="filter-reset-btn" 
          onClick={() => onFilterChange('reset', '')}
        >
          Clear filters ✕
        </button>
      )}
    </div>
  );
};