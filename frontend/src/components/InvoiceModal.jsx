import React from 'react';
import { X, FileText, Calendar, User, Package, ShoppingCart } from 'lucide-react';
import { formatCurrency } from '../utils/currency.js';
import './InvoiceModal.css';

const InvoiceModal = ({ isOpen, transaction, onClose }) => {
  if (!isOpen || !transaction) return null;

  const isRestockTransaction = transaction.restock_id !== undefined;
  const transactionDate = isRestockTransaction 
    ? transaction.restock_date 
    : transaction.transaction_date;

  return (
    <div className="invoice-modal-overlay" onClick={onClose}>
      <div className="invoice-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="invoice-header">
          <div className="invoice-title">
            <FileText size={24} />
            <h2>{isRestockTransaction ? 'Restock Invoice' : 'Sales Invoice'}</h2>
          </div>
          <button onClick={onClose} className="close-button">
            <X size={20} />
          </button>
        </div>

        <div className="invoice-body">
          {/* Company Header */}
          <div className="company-header">
            <h1>Store Management System</h1>
            <p>Invoice #{transaction.sales_id || transaction.restock_id}</p>
          </div>

          {/* Transaction Info */}
          <div className="transaction-info">
            <div className="info-row">
              <Calendar size={16} />
              <span>Date: {new Date(transactionDate).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="info-row">
              <User size={16} />
              <span>
                {isRestockTransaction 
                  ? `Supplier: ${transaction.supplier_name || 'Unknown Supplier'}`
                  : `Customer: ${transaction.customer_name || 'Walk-in Customer'}`
                }
              </span>
            </div>
            <div className="info-row">
              <ShoppingCart size={16} />
              <span>Type: {isRestockTransaction ? 'Restock Transaction' : 'Sales Transaction'}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="items-table">
            <h3>Transaction Items</h3>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {transaction.items && transaction.items.length > 0 ? (
                  transaction.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.product_name || 'Unknown Product'}</td>
                      <td>{item.quantity || 0}</td>
                      <td>{formatCurrency(item.unit_price || item.unit_cost || 0)}</td>
                      <td>{formatCurrency((item.quantity || 0) * (item.unit_price || item.unit_cost || 0))}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-items">No items found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Total Amount */}
          <div className="invoice-total">
            <div className="total-row">
              <span>Total Amount:</span>
              <span className="total-amount">
                {formatCurrency(transaction.total_amount || transaction.total_cost || 0)}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="invoice-footer">
            <p>Thank you for your business!</p>
            <p className="print-note">Generated on {new Date().toLocaleString('id-ID')}</p>
          </div>
        </div>

        <div className="invoice-actions">
          <button onClick={() => window.print()} className="print-button">
            <FileText size={16} />
            Print Invoice
          </button>
          <button onClick={onClose} className="close-button-footer">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
