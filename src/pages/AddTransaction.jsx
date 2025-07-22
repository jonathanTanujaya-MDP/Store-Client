import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext.jsx';
import axios from 'axios';
import { useSales } from '../context/SalesContext.jsx';
import toast from 'react-hot-toast';
import { Search, Package, User, Calendar, DollarSign, CheckCircle, XCircle, Loader, Minus, Plus, X, ShoppingCart, AlertTriangle, LayoutDashboard } from 'lucide-react';
import { formatCurrency } from '../utils/currency.js';
import './AddTransaction.css';

const AddTransaction = () => {
  const { products, fetchProducts } = useProducts();
  const { createSale } = useSales();
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({ productId: '', product: null, quantity: 1, searchTerm: '', filteredProducts: [] });
  const [totalAmount, setTotalAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const total = items.reduce((sum, item) => {
      if (item.product && item.quantity > 0) {
        return sum + (item.product.selling_price * item.quantity);
      }
      return sum;
    }, 0);
    setTotalAmount(total);
  }, [items]);

  // Filter products for search
  const filterProducts = (searchTerm) => {
    if (searchTerm) {
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setCurrentItem(prev => ({ ...prev, filteredProducts: filtered }));
    } else {
      setCurrentItem(prev => ({ ...prev, filteredProducts: [] }));
    }
  };

  // Add item to list
  const addItemToList = () => {
    if (currentItem.product && currentItem.quantity > 0) {
      setItems(prev => [...prev, { ...currentItem }]);
      setCurrentItem({ productId: '', product: null, quantity: 1, searchTerm: '', filteredProducts: [] });
    }
  };

  // Remove item from list
  const removeItemFromList = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  // Handle product selection
  const handleProductSelect = (product) => {
    setCurrentItem(prev => ({
      ...prev,
      product: product,
      productId: product.id,
      searchTerm: product.name,
      filteredProducts: []
    }));
  };

  // Handle search term change
  const handleSearchChange = (value) => {
    setCurrentItem(prev => ({ ...prev, searchTerm: value }));
    filterProducts(value);
  };

  // Handle quantity change
  const handleQuantityChange = (value) => {
    const quantity = Math.max(1, parseInt(value) || 1);
    setCurrentItem(prev => ({ ...prev, quantity }));
  };

  // Submit transaction
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate
      if (!customerName.trim()) {
        toast.error('Please enter customer name');
        setIsSubmitting(false);
        return;
      }

      if (items.length === 0) {
        toast.error('Please add at least one item to the transaction');
        setIsSubmitting(false);
        return;
      }

      const validItems = items.filter(item => item.product && item.quantity > 0);
      
      if (validItems.length === 0) {
        toast.error('Please add at least one valid item to the transaction');
        setIsSubmitting(false);
        return;
      }

      // Check stock availability
      for (const item of validItems) {
        if (item.quantity > item.product.stock_quantity) {
          toast.error(`Insufficient stock for ${item.product.name}. Available: ${item.product.stock_quantity}`);
          setIsSubmitting(false);
          return;
        }
      }

      await createSale({
        customer_name: customerName,
        items: validItems.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      });
      
      toast.success(`Transaction successful! ${validItems.length} item(s) sold.`);
      
      // Reset form
      setItems([]);
      setCurrentItem({ productId: '', product: null, quantity: 1, searchTerm: '', filteredProducts: [] });
      setCustomerName('');
      await fetchProducts(); // Refresh product list
      
    } catch (error) {
      console.error('Error submitting transaction:', error);
      toast.error(`Failed to submit transaction: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-transaction-page">
      <div className="add-transaction-header">
        <div className="add-transaction-title-section">
          <h1 className="add-transaction-title">
            <ShoppingCart size={32} />
            Add New Transaction
          </h1>
          <p className="add-transaction-subtitle">
            Record your product sales efficiently
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="transaction-form">
        {/* Customer & Product Search Combined Section */}
        <div className="customer-search-combined">
          <div className="combined-inputs-row">
            {/* Customer Name Input */}
            <div className="customer-input-group">
              <label htmlFor="customerName" className="section-label">
                <User size={16} style={{display: 'inline', marginRight: '0.5rem'}} />
                Customer Name <span className="required-indicator">*</span>
              </label>
              <div className="customer-input-wrapper">
                <User className="input-icon" size={20} />
                <input
                  id="customerName"
                  type="text"
                  className="customer-input"
                  placeholder="Search or enter customer name..."
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Product Search Input */}
            <div className="search-input-group">
              <label className="section-label">
                <Search size={16} style={{display: 'inline', marginRight: '0.5rem'}} />
                Search & Add Product
              </label>
              <div className="product-search-container">
                <div className="search-input-wrapper">
                  <Search className="input-icon" size={20} />
                  <input
                    type="text"
                    className="product-search-input"
                    placeholder="Type to search products..."
                    value={currentItem.searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    autoComplete="off"
                  />
                  
                  {/* Autocomplete Dropdown */}
                  {currentItem.filteredProducts.length > 0 && currentItem.searchTerm && (
                    <div className="autocomplete-dropdown">
                      {currentItem.filteredProducts.slice(0, 5).map(product => (
                        <div
                          key={product.id}
                          className="autocomplete-item"
                          onClick={() => handleProductSelect(product)}
                        >
                          <div className="product-info">
                            <span className="product-name">{product.name}</span>
                            <span className="product-meta">
                              Stock: {product.stock_quantity} • {formatCurrency(product.selling_price)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Consolidated Product Info & Quantity Control */}
          {currentItem.product && (
            <div className="consolidated-product-info">
              <div className="product-header">
                <div className="product-main-info">
                  <h4>{currentItem.product.name}</h4>
                  <div className="product-meta">
                    <span>Model: {currentItem.product.id || 'N/A'}</span>
                    <span>Stock: {currentItem.product.stock_quantity} units</span>
                    <span>Category: {currentItem.product.category || 'General'}</span>
                  </div>
                </div>
                <div className="product-price-main">
                  {formatCurrency(currentItem.product.selling_price)}
                </div>
              </div>

              <div className="add-item-row">
                {/* Quantity Control - Inline */}
                <div className="quantity-control-inline">
                  <button 
                    type="button" 
                    onClick={() => handleQuantityChange(currentItem.quantity - 1)}
                    className="qty-btn"
                    disabled={currentItem.quantity <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <input
                    type="number"
                    className="qty-input"
                    value={currentItem.quantity}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                    min="1"
                    max={currentItem.product ? currentItem.product.stock_quantity : 999}
                  />
                  <button 
                    type="button" 
                    onClick={() => handleQuantityChange(currentItem.quantity + 1)}
                    className="qty-btn"
                    disabled={currentItem.product && currentItem.quantity >= currentItem.product.stock_quantity}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="quantity-price-row" style={{borderTop: 'none', padding: '0', marginLeft: '1rem'}}>
                  <div className="quantity-simple">
                    <span>Total:</span>
                    <span className="subtotal-simple">{formatCurrency(currentItem.product.selling_price * currentItem.quantity)}</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Add Button */}
              <button 
                type="button" 
                onClick={addItemToList}
                className="add-btn-enhanced"
                disabled={!currentItem.product}
              >
                <Plus size={16} />
                Add Item to Transaction
              </button>

              {/* Error Message */}
              {currentItem.product && currentItem.quantity > currentItem.product.stock_quantity && (
                <div className="error-message">
                  <AlertTriangle size={14} />
                  Insufficient stock! Available: {currentItem.product.stock_quantity}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Items Section - Show added items */}
        {items.length > 0 && (
          <div className="items-section">
            <div className="section-title">
              <Package size={20} />
              <span>Transaction Items</span>
              <div className="items-count">{items.length} items</div>
            </div>

            {/* Simplified Items List */}
            <div className="items-list-simplified">
              <div className="items-list-header">
                <h4>Added Items</h4>
                <span className="items-count-badge">{items.length}</span>
              </div>
              <div className="items-list">
                {items.map((item, index) => (
                  <div key={index} className="item-row-flat">
                    <div className="item-info-flat">
                      <div className="item-name-flat">
                        <span className="item-checkmark">✓</span>
                        {item.product.name}
                      </div>
                      <div className="item-calculation-flat">
                        <span>×{item.quantity}</span>
                        <span>=</span>
                        <span>{formatCurrency(item.product.selling_price * item.quantity)}</span>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeItemFromList(index)}
                      className="remove-btn-minimal"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Total Summary Section */}
        <div className="total-summary-section">
          <div className="summary-cards-container">
            <div className="summary-card">
              <div className="summary-card-icon">
                <Package size={24} />
              </div>
              <div className="summary-card-content">
                <div className="summary-card-label">Total Items</div>
                <div className="summary-card-value">{items.length}</div>
              </div>
            </div>
            <div className="summary-card total-amount-card">
              <div className="summary-card-icon">
                <DollarSign size={24} />
              </div>
              <div className="summary-card-content">
                <div className="summary-card-label">Total Amount</div>
                <div className="summary-card-value">{formatCurrency(totalAmount)}</div>
              </div>
            </div>
          </div>
          
          <div className="summary-row total-row">
            <span className="summary-label">Final Total:</span>
            <span className="summary-value">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="submit-button-container">
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader className="spinner" size={20} />
                Processing Transaction...
              </>
            ) : (
              <>
                <CheckCircle className="submit-icon" size={20} />
                Save Transaction
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTransaction;