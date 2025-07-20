import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  Filler,
} from 'chart.js';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  RotateCcw
} from 'lucide-react';
import './DashboardChart-modern.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardChart = () => {
  const [chartType, setChartType] = useState('bar');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const monthNames = {
    long: ['January', 'February', 'March', 'April', 'May', 'June', 
           'July', 'August', 'September', 'October', 'November', 'December'],
    short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  };

  const availableYears = [2023, 2024, 2025, 2026];
  
  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch sales and restock data from history
        const [salesResponse, restockResponse] = await Promise.all([
          axios.get(API_ENDPOINTS.sales),
          axios.get(API_ENDPOINTS.restock)
        ]);

        const salesData = salesResponse.data;
        const restockData = restockResponse.data;

        // Filter data by selected year and month
        const filteredSalesData = salesData.filter(sale => {
          if (!sale.transaction_date) return false;
          const date = new Date(sale.transaction_date);
          const saleYear = date.getFullYear();
          const saleMonth = date.getMonth();
          
          if (selectedYear && saleYear !== selectedYear) return false;
          if (selectedMonth !== 'all' && saleMonth !== parseInt(selectedMonth)) return false;
          return true;
        });

        const filteredRestockData = restockData.filter(restock => {
          if (!restock.restock_date) return false;
          const date = new Date(restock.restock_date);
          const restockYear = date.getFullYear();
          const restockMonth = date.getMonth();
          
          if (selectedYear && restockYear !== selectedYear) return false;
          if (selectedMonth !== 'all' && restockMonth !== parseInt(selectedMonth)) return false;
          return true;
        });

        let labels, finalSalesData, finalRestockData;

        if (selectedMonth !== 'all') {
          // Show daily view for selected month
          const year = selectedYear;
          const month = parseInt(selectedMonth);
          const daysInMonth = new Date(year, month + 1, 0).getDate();
          
          labels = [];
          for (let day = 1; day <= daysInMonth; day++) {
            labels.push(day.toString());
          }
          
          // Initialize daily counters
          const salesByDay = new Array(daysInMonth).fill(0);
          const restockByDay = new Array(daysInMonth).fill(0);
          
          // Process sales data by day
          filteredSalesData.forEach(sale => {
            const day = new Date(sale.transaction_date).getDate();
            if (day >= 1 && day <= daysInMonth) {
              salesByDay[day - 1] += 1;
            }
          });

          // Process restock data by day
          filteredRestockData.forEach(restock => {
            const day = new Date(restock.restock_date).getDate();
            if (day >= 1 && day <= daysInMonth) {
              restockByDay[day - 1] += 1;
            }
          });
          
          finalSalesData = salesByDay;
          finalRestockData = restockByDay;
        } else {
          // Show monthly view
          const salesByMonth = new Array(12).fill(0);
          const restockByMonth = new Array(12).fill(0);

          // Process sales data by month
          filteredSalesData.forEach(sale => {
            const month = new Date(sale.transaction_date).getMonth();
            salesByMonth[month] += 1;
          });

          // Process restock data by month
          filteredRestockData.forEach(restock => {
            const month = new Date(restock.restock_date).getMonth();
            restockByMonth[month] += 1;
          });

          labels = isMobile ? monthNames.short : monthNames.long;
          finalSalesData = salesByMonth;
          finalRestockData = restockByMonth;
        }

        setChartData({
          labels: labels,
          datasets: [
            {
              label: '🔴 Penjualan',
              data: finalSalesData,
              backgroundColor: chartType === 'line' ? 'rgba(239, 68, 68, 0.1)' : '#EF4444',
              borderColor: '#EF4444',
              borderWidth: chartType === 'line' ? 3 : 0,
              fill: chartType === 'line',
              tension: 0.4,
            },
            {
              label: '🟢 Restock', 
              data: finalRestockData,
              backgroundColor: chartType === 'line' ? 'rgba(16, 185, 129, 0.1)' : '#10B981',
              borderColor: '#10B981',
              borderWidth: chartType === 'line' ? 3 : 0,
              fill: chartType === 'line',
              tension: 0.4,
            },
          ],
        });

      } catch (error) {
        console.error('Error fetching transaction data for chart:', error);
        setError('Gagal memuat data chart');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionData();
  }, [selectedYear, selectedMonth, chartType, isMobile]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: isMobile ? 'bottom' : 'top',
        labels: {
          usePointStyle: true,
          padding: isMobile ? 15 : 20,
          font: {
            family: 'Inter, Poppins, sans-serif',
            size: isMobile ? 12 : 14,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: function(context) {
            if (selectedMonth !== 'all') {
              return `Tanggal ${context[0].label} ${monthNames.long[parseInt(selectedMonth)]} ${selectedYear}`;
            } else {
              return `${context[0].label} ${selectedYear}`;
            }
          },
          label: function(context) {
            const datasetLabel = context.dataset.label;
            const value = context.parsed.y;
            return `${datasetLabel}: ${value} transaksi`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          font: {
            family: 'Inter, Poppins, sans-serif',
            size: isMobile ? 10 : 12
          },
          maxRotation: selectedMonth !== 'all' && !isMobile ? 0 : (isMobile ? 45 : 0),
          callback: function(value, index) {
            if (selectedMonth !== 'all') {
              // For daily view, show every 2nd or 5th day on mobile to avoid crowding
              if (isMobile && index % 2 !== 0) return '';
              return this.getLabelForValue(value);
            }
            return this.getLabelForValue(value);
          }
        },
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            family: 'Inter, Poppins, sans-serif',
            size: isMobile ? 10 : 12
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    },
    elements: {
      bar: {
        borderRadius: 4,
        borderSkipped: false
      },
      point: {
        radius: chartType === 'line' ? 4 : 0,
        hoverRadius: 6
      }
    }
  };

  // Export functions removed as requested

  const resetFilters = () => {
    setSelectedYear(new Date().getFullYear());
    setSelectedMonth('all');
    setChartType('bar');
  };

  const renderChart = () => {
    switch(chartType) {
      case 'line':
        return <Line data={chartData} options={options} />;
      case 'bar':
      default:
        return <Bar data={chartData} options={options} />;
    }
  };

  return (
    <div className="dashboard-chart-wrapper">
      {/* Header Section */}
      <div className="chart-header">
        <div className="chart-title-section">
          <h2 className="chart-title">
            <BarChart3 size={24} />
            Riwayat Transaksi Stok {selectedMonth !== 'all' ? 'Harian' : 'Bulanan'}
          </h2>
          <p className="chart-subtitle">
            {selectedMonth !== 'all' 
              ? `Data harian transaksi ${monthNames.long[parseInt(selectedMonth)]} ${selectedYear}`
              : `Data bulanan transaksi tahun ${selectedYear}`
            }
          </p>
        </div>
        
        {/* Reset Action Only */}
        <div className="chart-actions">
          <button 
            className="action-btn reset-btn"
            onClick={resetFilters}
            title="Reset Filters"
          >
            <RotateCcw size={16} />
            {!isMobile && 'Reset'}
          </button>
        </div>
      </div>

      {/* Controls Section */}
      <div className="chart-controls">
        {/* Chart Type Selector */}
        <div className="chart-type-selector">
          <span className="control-label">Tipe Chart:</span>
          <div className="chart-type-buttons">
            <button 
              className={`chart-type-btn ${chartType === 'bar' ? 'active' : ''}`}
              onClick={() => setChartType('bar')}
            >
              <BarChart3 size={16} />
              Bar
            </button>
            <button 
              className={`chart-type-btn ${chartType === 'line' ? 'active' : ''}`}
              onClick={() => setChartType('line')}
            >
              <TrendingUp size={16} />
              Line
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="chart-filters">
          <div className="filter-group">
            <label className="filter-label">
              <Calendar size={16} />
              Tahun:
            </label>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="filter-select"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">
              <Calendar size={16} />
              Bulan:
            </label>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="filter-select"
            >
              <option value="all">Semua Bulan</option>
              {monthNames.long.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="dashboard-chart-container">
        {loading ? (
          <div className="chart-loading">
            <div className="loading-spinner"></div>
            <p>Memuat data chart...</p>
          </div>
        ) : error ? (
          <div className="chart-error">
            <p>{error}</p>
            <p>Chart akan menampilkan riwayat transaksi dari data penjualan dan restock.</p>
          </div>
        ) : (
          <div className="chart-content">
            {renderChart()}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardChart;