import React from 'react';
import { List, TrendingDown, Package } from 'lucide-react';
import './TransactionFilter-optimized.css';

const TransactionFilter = ({ activeFilter, onFilterChange }) => {
  const filterOptions = [
    {
      id: 'all',
      label: 'All',
      icon: List,
      description: 'Semua Transaksi'
    },
    {
      id: 'penjualan',
      label: 'Penjualan',
      icon: TrendingDown,
      description: 'Transaksi Keluar'
    },
    {
      id: 'restock',
      label: 'Restock',
      icon: Package,
      description: 'Transaksi Masuk'
    }
  ];

  return (
    <div className="transaction-filter-container">
      <div className="transaction-filter-card">
        <div className="filter-header">
          <h3 className="filter-title">Filter Transaksi</h3>
          <p className="filter-subtitle">Pilih kategori transaksi yang ingin ditampilkan</p>
        </div>
        
        <div className="filter-buttons-container">
          {filterOptions.map((option) => {
            const IconComponent = option.icon;
            const isActive = activeFilter === option.id;
            
            return (
              <button
                key={option.id}
                className={`filter-button ${isActive ? 'active' : ''}`}
                onClick={() => onFilterChange(option.id)}
                aria-pressed={isActive}
                title={option.description}
              >
                <IconComponent />
                <span className="filter-button-text">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TransactionFilter;
