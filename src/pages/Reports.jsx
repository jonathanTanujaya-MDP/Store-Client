
import React, { useState, useEffect } from 'react';
import { 
    BarChart3, 
    TrendingUp, 
    TrendingDown, 
    DollarSign, 
    Package, 
    Calendar,
    Download,
    Eye,
    FileText
} from 'lucide-react';
import './Reports.css';

const Reports = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
    const [reportData, setReportData] = useState({
        totalSales: 0,
        totalProfit: 0,
        totalTransactions: 0,
        bestSellingProducts: [],
        salesTrend: 'up'
    });

    const periods = [
        { value: 'thisWeek', label: 'Minggu Ini' },
        { value: 'thisMonth', label: 'Bulan Ini' },
        { value: 'lastMonth', label: 'Bulan Lalu' },
        { value: 'thisYear', label: 'Tahun Ini' }
    ];

    // Mock data - replace with real data from context
    useEffect(() => {
        setReportData({
            totalSales: 15750000,
            totalProfit: 3150000,
            totalTransactions: 124,
            bestSellingProducts: [
                { name: 'Produk A', sold: 45, revenue: 2250000 },
                { name: 'Produk B', sold: 32, revenue: 1600000 },
                { name: 'Produk C', sold: 28, revenue: 1400000 }
            ],
            salesTrend: 'up'
        });
    }, [selectedPeriod]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="reports-page">
            <div className="reports-header">
                <div className="reports-title-section">
                    <h1 className="reports-title">
                        <BarChart3 size={32} />
                        Laporan Bisnis
                    </h1>
                    <p className="reports-subtitle">
                        Analisis performa penjualan dan keuntungan bisnis Anda
                    </p>
                </div>
                
                <div className="period-selector">
                    <Calendar size={20} />
                    <select 
                        value={selectedPeriod} 
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="period-select"
                    >
                        {periods.map(period => (
                            <option key={period.value} value={period.value}>
                                {period.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card sales-card">
                    <div className="stat-icon">
                        <DollarSign size={28} />
                    </div>
                    <div className="stat-content">
                        <h3>Total Penjualan</h3>
                        <p className="stat-value">{formatCurrency(reportData.totalSales)}</p>
                        <div className="stat-trend positive">
                            <TrendingUp size={16} />
                            <span>+12.5% dari periode sebelumnya</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card profit-card">
                    <div className="stat-icon">
                        <TrendingUp size={28} />
                    </div>
                    <div className="stat-content">
                        <h3>Total Keuntungan</h3>
                        <p className="stat-value">{formatCurrency(reportData.totalProfit)}</p>
                        <div className="stat-trend positive">
                            <TrendingUp size={16} />
                            <span>+8.3% dari periode sebelumnya</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card transactions-card">
                    <div className="stat-icon">
                        <Package size={28} />
                    </div>
                    <div className="stat-content">
                        <h3>Total Transaksi</h3>
                        <p className="stat-value">{reportData.totalTransactions}</p>
                        <div className="stat-trend positive">
                            <TrendingUp size={16} />
                            <span>+15.2% dari periode sebelumnya</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Best Selling Products */}
            <div className="report-section">
                <div className="section-header">
                    <h2>Produk Terlaris</h2>
                    <div className="section-actions">
                        <button className="action-btn view-btn">
                            <Eye size={16} />
                            Detail
                        </button>
                        <button className="action-btn export-btn">
                            <Download size={16} />
                            Export
                        </button>
                    </div>
                </div>
                
                <div className="products-list">
                    {reportData.bestSellingProducts.map((product, index) => (
                        <div key={index} className="product-item">
                            <div className="product-rank">#{index + 1}</div>
                            <div className="product-info">
                                <h4>{product.name}</h4>
                                <p>{product.sold} unit terjual</p>
                            </div>
                            <div className="product-revenue">
                                {formatCurrency(product.revenue)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Report Actions */}
            <div className="report-actions">
                <button className="report-action-btn detailed-report">
                    <FileText size={20} />
                    <span>Laporan Lengkap</span>
                </button>
                <button className="report-action-btn export-excel">
                    <Download size={20} />
                    <span>Export ke Excel</span>
                </button>
            </div>
        </div>
    );
};

export default Reports;
