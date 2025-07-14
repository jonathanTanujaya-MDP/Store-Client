import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext.jsx';
import axios from 'axios';
import { useSales } from '../context/SalesContext.jsx';
import toast from 'react-hot-toast';
import { Search, Package, User, Calendar, DollarSign, CheckCircle, XCircle, Loader, Minus, Plus, X, ShoppingCart } from 'lucide-react';
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
      <h1 className="add-transaction-title">Add New Transaction</h1>
      <p className="add-transaction-subtitle">Record your product sales efficiently</p>
      
      <form onSubmit={handleSubmit} className="transaction-form">
        {/* Customer Information */}
        <div className="form-group">
          <label htmlFor="customerName">Customer Name <span className="required-indicator">*</span></label>
          <div className="input-with-icon">
            <User className="input-icon" />
            <input
              id="customerName"
              type="text"
              className="form-input"
              placeholder="Enter customer name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Items Section */}
        <div className="items-section">
          <div className="section-header">
            <h3><ShoppingCart size={20} /> Transaction Items</h3>
          </div>

          {items.map((item, index) => (
            <div key={index} className="item-container">
              <div className="item-row">
                {/* Remove item button - top right */}
                <div className="item-header">
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

                {/* Inline layout: Item Number + Search + Quantity + Subtotal */}
                <div className="item-fields">
                  {/* Item Number */}
                  <span className="item-number">Item {index + 1}</span>
                  
                  {/* Product Search */}
                  <div className="form-group product-search-group">
                    <div className="input-with-icon">
                      <Search className="input-icon" />
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Search for a product..."
                        value={item.searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value, index)}
                      />
                    </div>
                    {item.filteredProducts.length > 0 && item.searchTerm && (
                      <ul className="product-search-results">
                        {item.filteredProducts.map(product => (
                          <li key={product.id} onClick={() => handleProductSelect(product, index)}>
                            {product.name} (Stock: {product.stock_quantity}) - Rp {product.selling_price?.toLocaleString('id-ID')}
                          </li>
                        ))}
                      </ul>
                    )}
                    {item.product && (
                      <div className="selected-product-info">
                        <p><strong>Selected:</strong> {item.product.name}</p>
                        <p><strong>Available Stock:</strong> {item.product.stock_quantity}</p>
                        <p><strong>Price:</strong> Rp {item.product.selling_price?.toLocaleString('id-ID')}</p>
                      </div>
                    )}
                  </div>

                  {/* Quantity Input */}
                  <div className="form-group quantity-group">
                    <div className="quantity-input-group">
                      <button 
                        type="button" 
                        onClick={() => handleQuantityChange(item.quantity - 1, index)}
                        className="quantity-button"
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
                      <p className="error-message">Insufficient stock! Available: {item.product.stock_quantity}</p>
                    )}
                  </div>

                  {/* Subtotal Display */}
                  {item.product && (
                    <div className="form-group subtotal-group">
                      <div className="subtotal-display">
                        Rp {(item.product.selling_price * item.quantity).toLocaleString('id-ID')}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Add Item Button - appears only after the last item */}
              {index === items.length - 1 && (
                <div className="add-item-container">
                  <button 
                    type="button" 
                    onClick={() => addItem(index)} 
                    className="add-item-inline-btn"
                    title="Add item after this one"
                  >
                    <Plus size={16} /> Add Item Below
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Total Price Display */}
        <div className="total-price-display">
          <label>Total Amount</label>
          <div className="input-with-icon">
            <DollarSign className="input-icon" />
            <span className="total-price-value">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? (
            <><Loader className="spinner" size={20} /> Processing...</>
          ) : (
            <><CheckCircle size={20} /> Submit Transaction</>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;