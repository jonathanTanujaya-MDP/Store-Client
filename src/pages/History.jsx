import React, { useState } from 'react';
import TransactionTable from '../components/TransactionTable.jsx';
import { BarChart3, Filter, TrendingUp, TrendingDown, List } from 'lucide-react';
import './History.css';

const History = () => {
    const [activeFilter, setActiveFilter] = useState('all');

    const handleFilterChange = (filterType) => {
        setActiveFilter(filterType);
    };

    const filterOptions = [
        {
            key: 'all',
            label: 'Semua',
            icon: List,
            color: 'all'
        },
        {
            key: 'sales',
            label: 'Penjualan',
            icon: TrendingUp,
            color: 'sales'
        },
        {
            key: 'restock',
            label: 'Restock',
            icon: TrendingDown,
            color: 'restock'
        }
    ];

    return (
        <div className="history-page">
            <div className="history-header">
                <div className="history-title-section">
                    <h1 className="history-title">
                        <BarChart3 size={32} />
                        Riwayat Transaksi
                    </h1>
                    <p className="history-subtitle">
                        Lihat semua riwayat transaksi masuk dan keluar
                    </p>
                </div>
                
                <div className="filter-section">
                    <div className="filter-header">
                        <Filter size={20} />
                        <span>Filter Transaksi</span>
                    </div>
                    <div className="filter-options">
                        {filterOptions.map((option) => {
                            const IconComponent = option.icon;
                            return (
                                <button 
                                    key={option.key}
                                    className={`filter-btn ${option.color} ${activeFilter === option.key ? 'active' : ''}`}
                                    onClick={() => handleFilterChange(option.key)}
                                >
                                    <IconComponent size={16} />
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
            
            {/* Transaction Content */}
            <div className="history-content">
                <TransactionTable activeFilter={activeFilter} />
            </div>
        </div>
    );
};

export default History;