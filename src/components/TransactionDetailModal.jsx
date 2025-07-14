import React from 'react';
import { X, Calendar, Package, Hash, DollarSign, User } from 'lucide-react';
import './TransactionDetailModal.css';

const TransactionDetailModal = ({ isOpen, onClose, transaction }) => {
    if (!isOpen || !transaction) return null;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTransactionTypeLabel = (type) => {
        return type === 'restock' ? 'Restock' : 'Penjualan';
    };

    const getTransactionTypeColor = (type) => {
        return type === 'restock' ? '#10b981' : '#3b82f6';
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Detail Transaksi</h2>
                    <button className="modal-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="transaction-overview">
                        <div className="transaction-id">
                            <Hash size={16} />
                            <span>ID: {transaction.transaction_id}</span>
                        </div>
                        <div 
                            className="transaction-type"
                            style={{ 
                                backgroundColor: getTransactionTypeColor(transaction.transaction_type),
                                color: 'white'
                            }}
                        >
                            {getTransactionTypeLabel(transaction.transaction_type)}
                        </div>
                    </div>

                    <div className="transaction-details">
                        <div className="detail-row">
                            <div className="detail-label">
                                <Calendar size={16} />
                                Tanggal
                            </div>
                            <div className="detail-value">
                                {formatDate(transaction.created_at)}
                            </div>
                        </div>

                        <div className="detail-row">
                            <div className="detail-label">
                                <Package size={16} />
                                Produk
                            </div>
                            <div className="detail-value">
                                {transaction.product_name}
                            </div>
                        </div>

                        <div className="detail-row">
                            <div className="detail-label">
                                <Package size={16} />
                                Jumlah
                            </div>
                            <div className="detail-value">
                                {transaction.quantity} unit
                            </div>
                        </div>

                        <div className="detail-row">
                            <div className="detail-label">
                                <DollarSign size={16} />
                                Harga Satuan
                            </div>
                            <div className="detail-value">
                                {formatCurrency(transaction.unit_price)}
                            </div>
                        </div>

                        <div className="detail-row total-row">
                            <div className="detail-label">
                                <DollarSign size={16} />
                                Total
                            </div>
                            <div className="detail-value total-value">
                                {formatCurrency(transaction.total_amount)}
                            </div>
                        </div>

                        {transaction.notes && (
                            <div className="detail-row">
                                <div className="detail-label">
                                    <User size={16} />
                                    Catatan
                                </div>
                                <div className="detail-value">
                                    {transaction.notes}
                                </div>
                            </div>
                        )}
                    </div>
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
