import React from 'react';
import { useProducts } from '../context/ProductContext';
import { AlertTriangle, Package, TrendingDown, CheckCircle } from 'lucide-react';
import './StockAlertList.css';

const StockAlertList = () => {
  const { products, loading, error } = useProducts();

  const lowStockProducts = products.filter(
    (product) => product.stock_quantity <= product.minimum_stock
  );

  if (loading) {
    return (
      <div className="stock-alert-list-container">
        <div className="loading-state">
          <div className="loading-header">
            <div className="loading-skeleton title-skeleton"></div>
            <div className="loading-skeleton subtitle-skeleton"></div>
          </div>
          {[...Array(3)].map((_, index) => (
            <div key={index} className="loading-alert-item">
              <div className="loading-skeleton icon-skeleton"></div>
              <div className="loading-content">
                <div className="loading-skeleton name-skeleton"></div>
                <div className="loading-skeleton stock-skeleton"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stock-alert-list-container">
        <div className="error-state">
          <AlertTriangle size={48} className="error-icon" />
          <h3>Unable to Load Stock Alerts</h3>
          <p>{error}</p>
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="stock-alert-list-container">
      <div className="alert-summary">
        <div className="summary-icon">
          <AlertTriangle size={24} />
        </div>
        <div className="summary-content">
          <h3 className="summary-title">Stock Alert Summary</h3>
          <p className="summary-count">
            {lowStockProducts.length} product{lowStockProducts.length !== 1 ? 's' : ''} 
            {lowStockProducts.length > 0 ? ' need immediate attention' : ' - All stock levels are healthy'}
          </p>
        </div>
      </div>

      {lowStockProducts.length > 0 ? (
        <div className="alert-list">
          {lowStockProducts.map(product => (
            <div key={product.id} className="alert-item">
              <div className="alert-icon">
                <Package size={20} />
              </div>
              <div className="alert-content">
                <div className="product-info">
                  <h4 className="product-name">{product.name}</h4>
                  <span className="product-category">{product.category}</span>
                </div>
                <div className="stock-info">
                  <div className="stock-numbers">
                    <span className="current-stock">
                      Current: <strong>{product.stock_quantity}</strong>
                    </span>
                    <span className="min-stock">
                      Minimum: <strong>{product.minimum_stock}</strong>
                    </span>
                  </div>
                  <div className={`alert-badge ${product.stock_quantity === 0 ? 'critical' : 'warning'}`}>
                    {product.stock_quantity === 0 ? 'OUT OF STOCK' : 'LOW STOCK'}
                  </div>
                </div>
              </div>
              <div className="alert-action">
                <TrendingDown size={16} className="trend-icon" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-alerts-state">
          <CheckCircle size={64} className="success-icon" />
          <h3>All Stock Levels are Healthy!</h3>
          <p>No products are below their minimum stock levels.</p>
        </div>
      )}
    </div>
  );
};

export default StockAlertList;