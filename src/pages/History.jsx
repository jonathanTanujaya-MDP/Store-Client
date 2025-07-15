import React, { useState } from 'react';
import TransactionTable from '../components/TransactionTable.jsx';
import { BarChart3, ShoppingCart, Package, Filter } from 'lucide-react';
import './History.css';

const History = () => {
    const [activeFilter, setActiveFilter] = useState('all');

    const handleFilterChange = (filterType) => {
        setActiveFilter(prev => prev === filterType ? 'all' : filterType);
    };

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
                        <span>Filter</span>
                    </div>
                    <div className="filter-options">
                        <button 
                            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('all')}
                        >
                            Semua
                        </button>
                        <button 
                            className={`filter-btn sales ${activeFilter === 'sales' ? 'active' : ''}`}
                            onClick={() => handleFilterChange('sales')}
                        >
                            <ShoppingCart size={16} />
                            Penjualan
                        </button>
                        <button 
                            className={`filter-btn restock ${activeFilter === 'restock' ? 'active' : ''}`}
                            onClick={() => handleFilterChange('restock')}
                        >
                            <Package size={16} />
                            Restock
                        </button>
                    </div>
                </div>
            </div>
            
            <TransactionTable activeFilter={activeFilter} />
        </div>
    );
};

export default History;