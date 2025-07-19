import React from 'react';
import { X, Calendar, Package, Hash, DollarSign, User, ShoppingCart, Truck, Building, PlusCircle } from 'lucide-react';
import { formatCurrency } from '../utils/currency.js';
import './TransactionDetailModal.css';

const TransactionDetailModal = ({ isOpen, onClose, transaction }) => {
    if (!isOpen || !transaction) return null;

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
        return type === 'restock' ? 'Restock Inventori' : 'Penjualan';
    };

    const getTransactionTypeColor = (type) => {
        return type === 'restock' ? '#10b981' : '#3b82f6';
    };

    const getTransactionIcon = (type) => {
        return type === 'restock' ? PlusCircle : ShoppingCart;
    };

    const getModalHeaderClass = (type) => {
        return type === 'restock' ? 'modal-header restock-header' : 'modal-header sales-header';
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
    
    // Get items array from the improved backend response
    const items = transaction.items || transaction.transaction_items || [];
    
    // If no items found, try to create from legacy single-item data
    const legacyItems = items.length === 0 ? [
        {
            product_name: getField(transaction, 'product_name', 'name') || 'Produk tidak diketahui',
            quantity: getField(transaction, 'quantity', 'amount') || 0,
            unit_price: getField(transaction, 'unit_price', 'unit_cost', 'price') || 0,
        }
    ] : items;

    // Calculate subtotal for all items
    const calculateSubtotal = () => {
        return legacyItems.reduce((total, item) => {
            const quantity = item.quantity || 0;
            const unitPrice = item.unit_price || item.unit_cost || item.price || 0;
            return total + (quantity * unitPrice);
        }, 0);
    };

    const subtotal = calculateSubtotal();
    const finalTotal = totalAmount || subtotal;

    // Check if this is a restock transaction
    const isRestock = transaction.transaction_type === 'restock';
    const TransactionIcon = getTransactionIcon(transaction.transaction_type);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className={`modal-content modal-wide ${isRestock ? 'restock-modal' : 'sales-modal'}`} onClick={(e) => e.stopPropagation()}>
                <div className={getModalHeaderClass(transaction.transaction_type)}>
                    <div className="modal-title-section">
                        <h2 className="modal-title">
                            <TransactionIcon size={24} />
                            {isRestock ? 'Detail Restock Inventori' : 'Detail Transaksi Penjualan'}
                        </h2>
                        <div className="transaction-id-badge">
                            ID: {transaction.transaction_id || transaction.id || 'N/A'}
                        </div>
                    </div>
                    <div className="modal-header-actions">
                        <div 
                            className={`transaction-type-badge ${isRestock ? 'restock-badge' : 'sales-badge'}`}
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

                <div className={`modal-body ${isRestock ? 'restock-body' : 'sales-body'}`}>
                    <div className="transaction-info-grid">
                        <div className="info-card">
                            <div className="info-label">
                                <Calendar size={16} />
                                {isRestock ? 'Tanggal Restock' : 'Tanggal Transaksi'}
                            </div>
                            <div className="info-value">
                                {formatDate(transactionDate)}
                            </div>
                        </div>

                        {isRestock ? (
                            // Restock specific info
                            <>
                                {supplierName && (
                                    <div className="info-card restock-card">
                                        <div className="info-label">
                                            <Truck size={16} />
                                            Supplier
                                        </div>
                                        <div className="info-value">
                                            {supplierName}
                                        </div>
                                    </div>
                                )}
                                <div className="info-card restock-card">
                                    <div className="info-label">
                                        <Building size={16} />
                                        Tipe Transaksi
                                    </div>
                                    <div className="info-value">
                                        Penambahan Stok
                                    </div>
                                </div>
                            </>
                        ) : (
                            // Sales specific info
                            customerName && (
                                <div className="info-card sales-card">
                                    <div className="info-label">
                                        <User size={16} />
                                        Customer
                                    </div>
                                    <div className="info-value">
                                        {customerName}
                                    </div>
                                </div>
                            )
                        )}
                    </div>

                    {/* Items Table */}
                    <div className={`items-section ${isRestock ? 'restock-items' : 'sales-items'}`}>
                        <h3 className="section-title">
                            <TransactionIcon size={18} />
                            {isRestock ? 'Detail Barang yang Direstok' : 'Detail Item yang Dibeli'} 
                            ({legacyItems.length} item{legacyItems.length > 1 ? 's' : ''})
                        </h3>
                        <div className={`items-table-wrapper ${isRestock ? 'restock-table' : 'sales-table'}`}>
                            <table className="items-table">
                                <thead>
                                    <tr>
                                        <th>Produk</th>
                                        <th>{isRestock ? 'Qty Ditambah' : 'Qty Dibeli'}</th>
                                        <th>{isRestock ? 'Harga Beli' : 'Harga Satuan'}</th>
                                        <th>{isRestock ? 'Total Biaya' : 'Total Harga'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {legacyItems.map((item, index) => {
                                        const quantity = item.quantity || 0;
                                        const unitPrice = item.unit_price || item.unit_cost || item.price || 0;
                                        const itemTotal = quantity * unitPrice;
                                        
                                        return (
                                            <tr key={index}>
                                                <td className="product-name">
                                                    <div className="product-info">
                                                        <Package size={16} className="product-icon" />
                                                        <span>
                                                            {item.product_name || item.name || 'Produk tidak diketahui'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="quantity">
                                                    <span className={`qty-badge ${isRestock ? 'restock-qty' : 'sales-qty'}`}>
                                                        {isRestock ? '+' : ''}{quantity} unit
                                                    </span>
                                                </td>
                                                <td className={`unit-price ${isRestock ? 'restock-price' : 'sales-price'}`}>
                                                    {formatCurrency(unitPrice)}
                                                </td>
                                                <td className={`item-total ${isRestock ? 'restock-total' : 'sales-total'}`}>
                                                    <strong>{formatCurrency(itemTotal)}</strong>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pricing Summary */}
                    <div className={`pricing-summary ${isRestock ? 'restock-summary' : 'sales-summary'}`}>
                        <div className="summary-row">
                            <span className="summary-label">
                                {isRestock ? 'Subtotal Biaya Restock' : 'Subtotal Penjualan'} ({legacyItems.length} item{legacyItems.length > 1 ? 's' : ''}):
                            </span>
                            <span className="summary-value">{formatCurrency(subtotal)}</span>
                        </div>
                        {finalTotal !== subtotal && (
                            <>
                                <div className="summary-row">
                                    <span className="summary-label">Penyesuaian:</span>
                                    <span className="summary-value adjustment">
                                        {formatCurrency(finalTotal - subtotal)}
                                    </span>
                                </div>
                                <div className="summary-divider"></div>
                            </>
                        )}
                        <div className="summary-row total-row">
                            <span className="summary-label">
                                {isRestock ? 'Total Biaya Restock:' : 'Total Transaksi:'}
                            </span>
                            <span className="summary-value total">{formatCurrency(finalTotal)}</span>
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
