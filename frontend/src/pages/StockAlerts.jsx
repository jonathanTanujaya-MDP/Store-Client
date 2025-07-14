
import React from 'react';
import StockAlertList from '../components/StockAlertList.jsx';
import './StockAlerts.css';

const StockAlerts = () => {
    return (
        <div className="stock-alerts-page">
            <h1 className="stock-alerts-title">Stock Alerts</h1>
            <p className="stock-alerts-subtitle">Daftar produk dengan stok di bawah minimum</p>
            <StockAlertList />
        </div>
    );
};

export default StockAlerts;
