
import React, { useState } from 'react';
import RestockForm from '../components/RestockForm.jsx';
import AddProductForm from '../components/AddProductForm.jsx';
import { Package, Plus, TrendingUp } from 'lucide-react';
import './Restock.css';

const Restock = () => {
  const [activeTab, setActiveTab] = useState('restock');

  return (
    <div className="restock-page">
      <div className="restock-header">
        <div className="restock-title-section">
          <h1 className="restock-title">
            <Package size={32} />
            Manajemen Stok Produk
          </h1>
          <p className="restock-subtitle">
            Tambah stok produk atau produk baru ke inventaris Anda
          </p>
        </div>
        
        <div className="tab-selector">
          <button
            className={`tab-btn ${activeTab === 'restock' ? 'active' : ''}`}
            onClick={() => setActiveTab('restock')}
          >
            <TrendingUp size={18} />
            Tambah Stok
          </button>
          <button
            className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            <Plus size={18} />
            Produk Baru
          </button>
        </div>
      </div>
      
      <div className="restock-content">
        {activeTab === 'restock' && <RestockForm />}
        {activeTab === 'add' && <AddProductForm />}
      </div>
    </div>
  );
};

export default Restock;