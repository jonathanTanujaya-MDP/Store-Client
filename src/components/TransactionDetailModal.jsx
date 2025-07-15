import React from 'react';
import { X, Calendar, Package, Hash, DollarSign, User } from 'lucide-react';
import './TransactionDetailModal.css';

const TransactionDetailModal = ({ isOpen, onClose, transaction }) => {
    if (!isOpen || !transaction) return null;

    const formatCurrency = (amount) => {
        if (!amount || isNaN(amount)) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Tanggal tidak tersedia';
        try {
            return new Date(dateString).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Format tanggal tidak valid';
        }
    };

    const getTransactionTypeLabel = (type) => {
        return type === 'restock' ? 'Restock' : 'Penjualan';
    };

    const getTransactionTypeColor = (type) => {
        return type === 'restock' ? '#10b981' : '#3b82f6';
    };

    // Helper function to safely get field values
    const getField = (obj, ...fields) => {
        for (const field of fields) {
            if (obj && obj[field] !== undefined && obj[field] !== null) {
                return obj[field];
            }
        }
        return null;
    };

    // Get the correct date field
    const transactionDate = getField(transaction, 'transaction_date', 'created_at', 'date');
    
    // Get customer name for sales
    const customerName = getField(transaction, 'customer_name', 'customer') || null;
    
    // Get supplier name for restock
    const supplierName = getField(transaction, 'supplier_name', 'supplier') || null;
    
    // Get total amount
    const totalAmount = getField(transaction, 'total_amount', 'total') || 0;
    
    // Get items array or create single item
    const items = transaction.items || transaction.transaction_items || [
        {
            product_name: getField(transaction, 'product_name', 'name') || 'Produk tidak diketahui',
            quantity: getField(transaction, 'quantity', 'amount') || 0,
            unit_price: getField(transaction, 'unit_price', 'unit_cost', 'price') || 0,
        }
    ];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-wide" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-section">
                        <h2 className="modal-title">
                            <Hash size={24} />
                            Detail Transaksi
                        </h2>
                        <div className="transaction-id-badge">
                            ID: {transaction.transaction_id || transaction.id || 'N/A'}
                        </div>
                    </div>
                    <div className="modal-header-actions">
                        <div 
                            className="transaction-type-badge"
                            style={{ 
                                backgroundColor: getTransactionTypeColor(transaction.transaction_type),
                                color: 'white'
                            }}
                        >
                            {getTransactionTypeLabel(transaction.transaction_type)}
                        </div>
                        <button className="modal-close-btn" onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="modal-body">
                    <div className="transaction-info-grid">
                        <div className="info-card">
                            <div className="info-label">
                                <Calendar size={16} />
                                Tanggal Transaksi
                            </div>
                            <div className="info-value">
                                {formatDate(transactionDate)}
                            </div>
                        </div>

                        {customerName && (
                            <div className="info-card">
                                <div className="info-label">
                                    <User size={16} />
                                    Customer
                                </div>
                                <div className="info-value">
                                    {customerName}
                                </div>
                            </div>
                        )}

                        {supplierName && (
                            <div className="info-card">
                                <div className="info-label">
                                    <User size={16} />
                                    Supplier
                                </div>
                                <div className="info-value">
                                    {supplierName}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Items Table */}
                    <div className="items-section">
                        <h3 className="section-title">
                            <Package size={18} />
                            Detail Item ({items.length} item{items.length > 1 ? 's' : ''})
                        </h3>
                        <div className="items-table-wrapper">
                            <table className="items-table">
                                <thead>
                                    <tr>
                                        <th>Produk</th>
                                        <th>Jumlah</th>
                                        <th>Harga Satuan</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => (
                                        <tr key={index}>
                                            <td className="product-name">
                                                {item.product_name || item.name || 'Produk tidak diketahui'}
                                            </td>
                                            <td className="quantity">
                                                {item.quantity || 0} unit
                                            </td>
                                            <td className="unit-price">
                                                {formatCurrency(item.unit_price || item.unit_cost || item.price || 0)}
                                            </td>
                                            <td className="item-total">
                                                {formatCurrency((item.quantity || 0) * (item.unit_price || item.unit_cost || item.price || 0))}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Total Section */}
                    <div className="total-section">
                        <div className="total-row">
                            <span className="total-label">Total Transaksi:</span>
                            <span className="total-value">{formatCurrency(totalAmount)}</span>
                        </div>
                    </div>

                    {transaction.notes && (
                        <div className="notes-section">
                            <h4>Catatan:</h4>
                            <p>{transaction.notes}</p>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="modal-btn-secondary" onClick={onClose}>
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetailModal;
