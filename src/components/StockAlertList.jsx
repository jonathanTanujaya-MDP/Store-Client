import React from 'react';
import { useProducts } from '../context/ProductContext';
import './StockAlertList.css';

const StockAlertList = () => {
  const { products, loading, error } = useProducts();

  const lowStockProducts = products.filter(
    (product) => product.stock_quantity <= product.minimum_stock
  );

  if (loading) return <p>Loading stock alerts...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="stock-alert-list-container">
      <h2 className="stock-alert-list-title">Current Stock Alerts</h2>
      {lowStockProducts.length > 0 ? (
        <ul className="stock-alert-list">
          {lowStockProducts.map(product => (
            <li key={product.id} className="stock-alert-item">
              <span className="alert-product-name">{product.name}</span>
              <span className="alert-stock-info">
                Current Stock: <span className="current-stock">{product.stock_quantity}</span>
                (Min: <span className="min-stock">{product.minimum_stock}</span>)
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-alerts-message">No stock alerts at the moment. Everything looks good!</p>
      )}
    </div>
  );
};

export default StockAlertList;