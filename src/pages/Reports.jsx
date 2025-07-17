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
    FileText,
    Loader
} from 'lucide-react';
import { useSales } from '../context/SalesContext.jsx';
import { useTransactions } from '../context/TransactionContext.jsx';
import { useProducts } from '../context/ProductContext.jsx';
import './Reports.css';

const Reports = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
    const [reportData, setReportData] = useState({
        totalSales: 0,
        totalProfit: 0,
        totalTransactions: 0,
        bestSellingProducts: [],
        salesTrend: 'up',
        loading: true
    });

    const { sales, loading: salesLoading } = useSales();
    const { transactions, loading: transactionsLoading } = useTransactions();
    const { products } = useProducts();

    const periods = [
        { value: 'thisWeek', label: 'Minggu Ini' },
        { value: 'thisMonth', label: 'Bulan Ini' },
        { value: 'lastMonth', label: 'Bulan Lalu' },
        { value: 'thisYear', label: 'Tahun Ini' }
    ];

    // Calculate date ranges based on selected period
    const getDateRange = (period) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        switch (period) {
            case 'today':
                return { start: today, end: new Date(now.getTime() + 24*60*60*1000) };
                
            case 'thisWeek':
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - today.getDay());
                return { start: startOfWeek, end: new Date(now.getTime() + 24*60*60*1000) };
            
            case 'thisMonth':
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                return { start: startOfMonth, end: new Date(now.getTime() + 24*60*60*1000) };
            
            case 'lastMonth':
                const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
                return { start: startOfLastMonth, end: endOfLastMonth };
            
            case 'thisYear':
                const startOfYear = new Date(now.getFullYear(), 0, 1);
                return { start: startOfYear, end: new Date(now.getTime() + 24*60*60*1000) };
            
            default:
                return { start: today, end: new Date(now.getTime() + 24*60*60*1000) };
        }
    };

    // Filter transactions by period and type
    const filterTransactions = (data, period, type = null) => {
        const { start, end } = getDateRange(period);
        
        return data.filter(item => {
            const itemDate = new Date(item.transaction_date || item.created_at);
            const isInRange = itemDate >= start && itemDate <= end;
            
            if (type) {
                const itemType = item.type?.toLowerCase() || 'sale';
                return isInRange && itemType === type;
            }
            
            return isInRange;
        });
    };

    // Calculate best selling products from transactions
    const calculateBestSellingProducts = (filteredTransactions) => {
        const productSales = {};
        
        filteredTransactions.forEach(transaction => {
            if (transaction.items && Array.isArray(transaction.items)) {
                transaction.items.forEach(item => {
                    const productName = item.product_name || 'Unknown Product';
                    const quantity = parseInt(item.quantity) || 0;
                    const price = parseFloat(item.unit_price) || 0;
                    
                    if (!productSales[productName]) {
                        productSales[productName] = { name: productName, sold: 0, revenue: 0 };
                    }
                    
                    productSales[productName].sold += quantity;
                    productSales[productName].revenue += (quantity * price);
                });
            }
        });
        
        return Object.values(productSales)
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 5);
    };

    // Calculate profit (simplified - assuming 20% margin)
    const calculateProfit = (revenue) => {
        return revenue * 0.2; // Simplified profit calculation
    };

    // Real data calculation - replace mock data
    useEffect(() => {
        if (salesLoading || transactionsLoading) {
            setReportData(prev => ({ ...prev, loading: true }));
            return;
        }

        // Use transactions data which has both sales and restock
        const allTransactions = transactions || [];
        const salesTransactions = filterTransactions(allTransactions, selectedPeriod, 'sale');
        
        // Calculate totals
        const totalSales = salesTransactions.reduce((sum, transaction) => {
            return sum + (parseFloat(transaction.total_amount) || 0);
        }, 0);
        
        const totalProfit = calculateProfit(totalSales);
        const totalTransactionCount = salesTransactions.length;
        const bestSelling = calculateBestSellingProducts(salesTransactions);
        
        // Calculate trend (compare with previous period)
        const previousPeriodTransactions = (() => {
            switch (selectedPeriod) {
                case 'thisWeek':
                    return filterTransactions(allTransactions, 'lastWeek', 'sale');
                case 'thisMonth':
                    return filterTransactions(allTransactions, 'lastMonth', 'sale');
                default:
                    return [];
            }
        })();
        
        const previousSales = previousPeriodTransactions.reduce((sum, transaction) => {
            return sum + (parseFloat(transaction.total_amount) || 0);
        }, 0);
        
        const trend = totalSales > previousSales ? 'up' : 'down';

        setReportData({
            totalSales,
            totalProfit,
            totalTransactions: totalTransactionCount,
            bestSellingProducts: bestSelling,
            salesTrend: trend,
            loading: false
        });
    }, [selectedPeriod, sales, transactions, salesLoading, transactionsLoading]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Handle detailed report view
    const handleDetailedReport = () => {
        const reportContent = generateDetailedReport();
        
        // Create new window for detailed report
        const newWindow = window.open('', '_blank', 'width=800,height=600');
        newWindow.document.write(`
            <html>
                <head>
                    <title>Laporan Lengkap - ${periods.find(p => p.value === selectedPeriod)?.label}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        h1 { color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px; }
                        .summary { background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; }
                        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #4F46E5; color: white; }
                        .print-btn { background: #4F46E5; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
                    </style>
                </head>
                <body>
                    ${reportContent}
                    <div style="margin-top: 20px;">
                        <button class="print-btn" onclick="window.print()">Cetak Laporan</button>
                    </div>
                </body>
            </html>
        `);
        newWindow.document.close();
    };

    // Generate detailed report content
    const generateDetailedReport = () => {
        const periodLabel = periods.find(p => p.value === selectedPeriod)?.label;
        const currentDate = new Date().toLocaleDateString('id-ID');
        
        return `
            <h1>Laporan Bisnis Lengkap</h1>
            <div class="summary">
                <h3>Ringkasan Periode: ${periodLabel}</h3>
                <p><strong>Tanggal Generate:</strong> ${currentDate}</p>
                <p><strong>Total Penjualan:</strong> ${formatCurrency(reportData.totalSales)}</p>
                <p><strong>Total Keuntungan:</strong> ${formatCurrency(reportData.totalProfit)}</p>
                <p><strong>Total Transaksi:</strong> ${reportData.totalTransactions}</p>
            </div>
            
            <h3>Produk Terlaris</h3>
            <table>
                <thead>
                    <tr>
                        <th>Peringkat</th>
                        <th>Nama Produk</th>
                        <th>Unit Terjual</th>
                        <th>Revenue</th>
                    </tr>
                </thead>
                <tbody>
                    ${reportData.bestSellingProducts.map((product, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${product.name}</td>
                            <td>${product.sold}</td>
                            <td>${formatCurrency(product.revenue)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    };

    // Handle export to Excel
    const handleExportToExcel = () => {
        const periodLabel = periods.find(p => p.value === selectedPeriod)?.label;
        const currentDate = new Date().toLocaleDateString('id-ID');
        
        // Create CSV content
        const csvContent = generateCSVContent();
        
        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Laporan-Bisnis-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Generate CSV content
    const generateCSVContent = () => {
        const periodLabel = periods.find(p => p.value === selectedPeriod)?.label;
        const currentDate = new Date().toLocaleDateString('id-ID');
        
        let csv = '';
        csv += 'Laporan Bisnis Lengkap\n';
        csv += `Periode:,${periodLabel}\n`;
        csv += `Tanggal Generate:,${currentDate}\n\n`;
        
        // Summary
        csv += 'RINGKASAN\n';
        csv += `Total Penjualan,${reportData.totalSales}\n`;
        csv += `Total Keuntungan,${reportData.totalProfit}\n`;
        csv += `Total Transaksi,${reportData.totalTransactions}\n\n`;
        
        // Best selling products
        csv += 'PRODUK TERLARIS\n';
        csv += 'Peringkat,Nama Produk,Unit Terjual,Revenue\n';
        reportData.bestSellingProducts.forEach((product, index) => {
            csv += `${index + 1},${product.name},${product.sold},${product.revenue}\n`;
        });
        
        return csv;
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
                        <p className="stat-value">
                            {reportData.loading ? 'Memuat...' : formatCurrency(reportData.totalSales)}
                        </p>
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
                        <p className="stat-value">
                            {reportData.loading ? 'Memuat...' : formatCurrency(reportData.totalProfit)}
                        </p>
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
                        <p className="stat-value">
                            {reportData.loading ? 'Memuat...' : reportData.totalTransactions}
                        </p>
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
                </div>
                
                <div className="products-list">
                    {reportData.loading ? (
                        <div className="loading-message">Memuat data produk...</div>
                    ) : reportData.bestSellingProducts.length > 0 ? (
                        reportData.bestSellingProducts.map((product, index) => (
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
                        ))
                    ) : (
                        <div className="no-data-message">
                            Tidak ada data penjualan untuk periode ini
                        </div>
                    )}
                </div>
            </div>

            {/* Report Actions */}
            <div className="report-actions">
                <button 
                    className="report-action-btn detailed-report"
                    onClick={handleDetailedReport}
                    disabled={reportData.loading}
                >
                    <FileText size={20} />
                    <span>Lihat Laporan Lengkap</span>
                </button>
                <button 
                    className="report-action-btn export-excel"
                    onClick={handleExportToExcel}
                    disabled={reportData.loading}
                >
                    <Download size={20} />
                    <span>Export ke Excel</span>
                </button>
            </div>
        </div>
    );
};

export default Reports;
