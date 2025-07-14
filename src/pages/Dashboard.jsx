import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card.jsx';
import DashboardChart from '../components/DashboardChart.jsx';
import FloatingActionButton from '../components/FloatingActionButton.jsx';
import ProductForm from '../components/ProductForm.jsx';
import { useProducts } from '../context/ProductContext.jsx';
import { Package, AlertTriangle, TrendingUp, DollarSign, ShoppingCart, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { formatCurrency } from '../utils/currency.js';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showProductForm, setShowProductForm] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    todaySales: 0,
    todayRevenue: 0,
    totalTransactions: 0,
    recentActivity: []
  });
  const { addProduct, products } = useProducts();

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Get sales data
        const salesResponse = await axios.get('http://localhost:5000/api/sales');
        const sales = salesResponse.data;
        
        // Calculate today's stats
        const today = new Date().toDateString();
        const todaySales = sales.filter(sale => 
          new Date(sale.transaction_date).toDateString() === today
        );
        
        const todayRevenue = todaySales.reduce((sum, sale) => sum + Number(sale.total_amount || 0), 0);
        
        setDashboardStats({
          todaySales: todaySales.length,
          todayRevenue: todayRevenue,
          totalTransactions: sales.length,
          recentActivity: sales.slice(0, 5) // Get 5 most recent
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchDashboardStats();
    
    // Update stats every 30 seconds for realtime feel
    const interval = setInterval(fetchDashboardStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate total stock from products context
  const totalStock = products.reduce((sum, product) => sum + (Number(product.stock_quantity) || 0), 0);
  
  // Calculate low stock alerts
  const lowStockAlerts = products.filter(product => 
    (Number(product.stock_quantity) || 0) < (Number(product.minimum_stock) || 0)
  ).length;

  // Hotkey support for new product
  useEffect(() => {
    const handleHotkeyNewProduct = () => {
      setShowProductForm(true);
    };

    document.addEventListener('hotkey-new-product', handleHotkeyNewProduct);
    return () => document.removeEventListener('hotkey-new-product', handleHotkeyNewProduct);
  }, []);

  const handleFabClick = () => {
    setShowProductForm(true);
  };

  const handleAddProduct = async (productData) => {
    try {
      await addProduct(productData);
      setShowProductForm(false);
      toast.success('Product added successfully!');
    } catch (error) {
      toast.error('Failed to add product.');
    }
  };

  const handleCloseForm = () => {
    setShowProductForm(false);
  };

  // Hotkey support for escape
  useEffect(() => {
    const handleEscape = () => {
      if (showProductForm) {
        setShowProductForm(false);
      }
    };

    document.addEventListener('hotkey-escape', handleEscape);
    return () => document.removeEventListener('hotkey-escape', handleEscape);
  }, [showProductForm]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Kelola persediaan produk Anda dengan mudah</p>
        <div className="dashboard-time">
          <Clock size={16} />
          <span>Last updated: {new Date().toLocaleTimeString('id-ID')}</span>
        </div>
      </div>
      
      {/* Enhanced Summary Cards */}
      <div className="summary-cards-grid">
        <Card 
          title="Total Stock" 
          value={totalStock.toLocaleString('id-ID')} 
          icon={Package} 
          onClick={() => navigate('/products')}
        />
        <Card 
          title="Low Stock Alert" 
          value={lowStockAlerts} 
          icon={AlertTriangle} 
          className={lowStockAlerts > 0 ? "alert-card" : ""}
          onClick={() => navigate('/stock-alerts')}
        />
        <Card 
          title="Today's Sales" 
          value={dashboardStats.todaySales} 
          icon={ShoppingCart}
          onClick={() => navigate('/history')}
        />
        <Card 
          title="Today's Revenue" 
          value={formatCurrency(dashboardStats.todayRevenue)} 
          icon={DollarSign}
          onClick={() => navigate('/reports')}
        />
        <Card 
          title="Total Transactions" 
          value={dashboardStats.totalTransactions} 
          icon={TrendingUp}
          onClick={() => navigate('/history')}
        />
      </div>

      {/* Chart Section */}
      <div className="dashboard-chart-section">
        <DashboardChart />
      </div>

      {/* Recent Activity Section */}
      {dashboardStats.recentActivity.length > 0 && (
        <div className="recent-activity-section">
          <h3>Recent Sales Activity</h3>
          <div className="recent-activity-list">
            {dashboardStats.recentActivity.map((sale, index) => (
              <div key={sale.sales_id} className="activity-item">
                <div className="activity-info">
                  <div className="activity-customer">
                    <strong>{sale.customer_name || 'Customer'}</strong>
                  </div>
                  <div className="activity-details">
                    <span className="activity-amount">
                      {formatCurrency(sale.total_amount || 0)}
                    </span>
                    <span className="activity-date">
                      {new Date(sale.transaction_date).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <FloatingActionButton onClick={handleFabClick} />

      {showProductForm && (
        <ProductForm onSubmit={handleAddProduct} onClose={handleCloseForm} />
      )}
    </div>
  );
};

export default Dashboard;
