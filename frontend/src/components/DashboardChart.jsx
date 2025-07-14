import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import './DashboardChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardChart = () => {
  const [chartData, setChartData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Sales Transactions',
        data: new Array(12).fill(0),
        backgroundColor: '#EF4444',
      },
      {
        label: 'Restock Transactions',
        data: new Array(12).fill(0),
        backgroundColor: '#10B981',
      },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch sales and restock data from history
        const [salesResponse, restockResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/sales'),
          axios.get('http://localhost:5000/api/restock')
        ]);

        const salesData = salesResponse.data;
        const restockData = restockResponse.data;

        // Initialize monthly counters
        const salesByMonth = new Array(12).fill(0);
        const restockByMonth = new Array(12).fill(0);

        // Process sales data
        salesData.forEach(sale => {
          if (sale.transaction_date) {
            const month = new Date(sale.transaction_date).getMonth();
            // Count number of transactions per month, not quantities
            salesByMonth[month] += 1;
          }
        });

        // Process restock data  
        restockData.forEach(restock => {
          if (restock.restock_date) {
            const month = new Date(restock.restock_date).getMonth();
            // Count number of transactions per month, not quantities
            restockByMonth[month] += 1;
          }
        });

        setChartData({
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Sales Transactions',
              data: salesByMonth,
              backgroundColor: '#EF4444',
            },
            {
              label: 'Restock Transactions',
              data: restockByMonth,
              backgroundColor: '#10B981',
            },
          ],
        });

      } catch (error) {
        console.error('Error fetching transaction data for chart:', error);
        setError('Failed to load chart data');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Stock Transactions (From History)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <div className="dashboard-chart-container">
      {loading ? (
        <div className="chart-loading">
          <p>Loading chart data...</p>
        </div>
      ) : error ? (
        <div className="chart-error">
          <p>{error}</p>
          <p>Chart will show transaction history from sales and restock data.</p>
        </div>
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
};

export default DashboardChart;