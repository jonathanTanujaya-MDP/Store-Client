
import React from 'react';
import StockAlertList from '../components/StockAlertList.jsx';
import { AlertTriangle } from 'lucide-react';
import './StockAlerts.css';

const StockAlerts = () => {
    return (
        <div className="stock-alerts-page">
            <div className="stock-alerts-header">
                <div className="stock-alerts-title-section">
                    <h1 className="stock-alerts-title">
                        <AlertTriangle size={32} />
                        Stock Alerts
                    </h1>
                    <p className="stock-alerts-subtitle">
                        Daftar produk dengan stok di bawah minimum
                    </p>
                </div>
            </div>
            <StockAlertList />
        </div>
    );
};

export default StockAlerts;
