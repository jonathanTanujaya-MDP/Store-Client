import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext.jsx';
import axios from 'axios';
import { useSales } from '../context/SalesContext.jsx';
import toast from 'react-hot-toast';
import { Search, Package, User, Calendar, DollarSign, CheckCircle, XCircle, Loader, Minus, Plus, X, ShoppingCart, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../utils/currency.js';
import './AddTransaction.css';

const AddTransaction = () => {
  const { products, fetchProducts } = useProducts();
  const { createSale } = useSales();
  const [items, setItems] = useState([{ productId: '', product: null, quantity: 1, searchTerm: '', filteredProducts: [] }]);
  const [customerName, setCustomerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  // Calculate total amount when items change
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
  const filterProducts = (searchTerm, itemIndex) => {
    if (searchTerm) {
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      updateItem(itemIndex, { filteredProducts: filtered });
    } else {
      updateItem(itemIndex, { filteredProducts: [] });
    }
  };

  // Update specific item
  const updateItem = (index, updates) => {
    setItems(prevItems => 
      prevItems.map((item, i) => 
        i === index ? { ...item, ...updates } : item
      )
    );
  };

  // Add new item row
  const addItem = (afterIndex = null) => {
    const newItem = { 
      productId: '', 
      product: null, 
      quantity: 1, 
      searchTerm: '', 
      filteredProducts: [] 
    };
    
    if (afterIndex !== null) {
      // Insert after specific index
      setItems(prev => [
        ...prev.slice(0, afterIndex + 1),
        newItem,
        ...prev.slice(afterIndex + 1)
      ]);
    } else {
      // Add at the end
      setItems(prev => [...prev, newItem]);
    }
  };

  // Remove item row
  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Handle product selection
  const handleProductSelect = (product, itemIndex) => {
    updateItem(itemIndex, {
      product: product,
      productId: product.id,
      searchTerm: product.name,
      filteredProducts: []
    });
  };

  // Handle search term change
  const handleSearchChange = (value, itemIndex) => {
    updateItem(itemIndex, { searchTerm: value });
    filterProducts(value, itemIndex);
  };

  // Handle quantity change
  const handleQuantityChange = (value, itemIndex) => {
    const quantity = Math.max(1, parseInt(value) || 1);
    updateItem(itemIndex, { quantity });
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

      const validItems = items.filter(item => item.product && item.quantity > 0);
      
      if (validItems.length === 0) {
        toast.error('Please select at least one product');
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
      setItems([{ productId: '', product: null, quantity: 1, searchTerm: '', filteredProducts: [] }]);
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
        
        <div className="transaction-summary">
          <div className="summary-card">
            <div className="summary-label">Total Items</div>
            <div className="summary-value">{items.filter(item => item.product).length}</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Total Amount</div>
            <div className="summary-value">{formatCurrency(totalAmount)}</div>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="transaction-form">
        {/* Customer Information Section */}
        <div className="customer-section">
          <div className="section-title">
            <User size={20} />
            <span>Customer Information</span>
          </div>
          <div className="form-group">
            <label htmlFor="customerName">Customer Name <span className="required-indicator">*</span></label>
            <div className="input-with-icon">
              <User className="input-icon" />
              <input
                id="customerName"
                type="text"
                className="form-input customer-input"
                placeholder="Enter customer name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="items-section">
          <div className="section-title">
            <ShoppingCart size={20} />
            <span>Transaction Items</span>
            <div className="items-count">
              {items.filter(item => item.product).length} item{items.filter(item => item.product).length !== 1 ? 's' : ''} selected
            </div>
          </div>

          {items.map((item, index) => (
            <div key={index} className="item-card">
              <div className="item-card-header">
                <div className="item-number-badge">
                  <Package size={16} />
                  Item {index + 1}
                </div>
                {items.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeItem(index)}
                    className="remove-item-btn"
                    title="Remove this item"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="item-card-content">
                {/* Product Search */}
                <div className="product-search-section">
                  <label>Select Product <span className="required-indicator">*</span></label>
                  <div className="input-with-icon">
                    <Search className="input-icon" />
                    <input
                      type="text"
                      className="form-input product-search-input"
                      placeholder="Search for a product..."
                      value={item.searchTerm}
                      onChange={(e) => handleSearchChange(e.target.value, index)}
                    />
                  </div>
                  {item.filteredProducts.length > 0 && item.searchTerm && (
                    <ul className="product-search-results">
                      {item.filteredProducts.map(product => (
                        <li key={product.id} onClick={() => handleProductSelect(product, index)}>
                          <div className="product-item">
                            <div className="product-name">{product.name}</div>
                            <div className="product-details">
                              Stock: {product.stock_quantity} | Price: {formatCurrency(product.selling_price)}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  {item.product && (
                    <div className="selected-product-card">
                      <div className="product-info-row">
                        <div className="product-name-selected">{item.product.name}</div>
                        <div className="product-price">{formatCurrency(item.product.selling_price)}</div>
                      </div>
                      <div className="product-stock-info">
                        Available Stock: <span className="stock-count">{item.product.stock_quantity}</span> units
                      </div>
                    </div>
                  )}
                </div>

                {/* Quantity and Total */}
                <div className="quantity-total-section">
                  <div className="quantity-section">
                    <label>Quantity</label>
                    <div className="quantity-input-group">
                      <button 
                        type="button" 
                        onClick={() => handleQuantityChange(item.quantity - 1, index)}
                        className="quantity-button"
                        disabled={item.quantity <= 1}
                        title="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        type="number"
                        className="form-input quantity-input"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(e.target.value, index)}
                        min="1"
                        max={item.product ? item.product.stock_quantity : 999}
                        placeholder="1"
                        title="Quantity to sell"
                      />
                      <button 
                        type="button" 
                        onClick={() => handleQuantityChange(item.quantity + 1, index)}
                        className="quantity-button"
                        disabled={item.product && item.quantity >= item.product.stock_quantity}
                        title="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    {item.product && item.quantity > item.product.stock_quantity && (
                      <p className="error-message">
                        <AlertTriangle size={16} />
                        Insufficient stock! Available: {item.product.stock_quantity}
                      </p>
                    )}
                  </div>

                  {/* Subtotal */}
                  {item.product && (
                    <div className="subtotal-section">
                      <label>Subtotal</label>
                      <div className="subtotal-display">
                        <DollarSign size={16} />
                        {formatCurrency(item.product.selling_price * item.quantity)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Add Item Button */}
          <div className="add-item-section">
            <button 
              type="button" 
              onClick={() => addItem(items.length - 1)} 
              className="add-item-btn"
              title="Add another item"
            >
              <Plus size={16} />
              Add Another Item
            </button>
          </div>
        </div>

        {/* Total Summary Section */}
        <div className="total-summary-section">
          <div className="summary-row">
            <span className="summary-label">Items Count:</span>
            <span className="summary-value">{items.filter(item => item.product).length} item{items.filter(item => item.product).length !== 1 ? 's' : ''}</span>
          </div>
          <div className="summary-row total-row">
            <span className="summary-label">Total Amount:</span>
            <span className="summary-value">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader className="spinner" size={20} />
              Processing...
            </>
          ) : (
            <>
              <CheckCircle size={20} />
              Submit Transaction
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;