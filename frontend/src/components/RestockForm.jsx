import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext.jsx';
import axios from 'axios';
import { useRestock } from '../context/RestockContext.jsx';
import toast from 'react-hot-toast';
import { Loader, Package, Plus, Minus, Truck, ClipboardList, Search, CheckCircle, X, ShoppingCart } from 'lucide-react';
import './RestockForm.css';

const RestockForm = () => {
  const { products, fetchProducts, addProduct } = useProducts();
  const { createRestock } = useRestock();
  const [items, setItems] = useState([{ productId: '', product: null, quantity: 1, searchTerm: '', filteredProducts: [] }]);
  const [supplier, setSupplier] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddNewProduct, setShowAddNewProduct] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    category: '',
    purchase_price: '',
    selling_price: '',
    minimum_stock: ''
  });

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
    updateItem(itemIndex, { quantity: Math.max(1, parseInt(value) || 1) });
  };

  // Add new product
  const handleAddNewProduct = async () => {
    try {
      if (!newProductForm.name || !newProductForm.category || !newProductForm.purchase_price || !newProductForm.selling_price) {
        toast.error('Please fill all required fields for new product');
        return;
      }

      const productData = {
        ...newProductForm,
        purchase_price: parseFloat(newProductForm.purchase_price),
        selling_price: parseFloat(newProductForm.selling_price),
        minimum_stock: parseInt(newProductForm.minimum_stock) || 5,
        stock: 0 // Initial stock is 0, will be updated by restock
      };

      await addProduct(productData);
      await fetchProducts(); // Refresh products list
      
      // Reset form
      setNewProductForm({
        name: '',
        category: '',
        purchase_price: '',
        selling_price: '',
        minimum_stock: ''
      });
      setShowAddNewProduct(false);
      toast.success('New product added successfully!');
    } catch (error) {
      toast.error('Failed to add new product');
    }
  };

  // Submit restock
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate items
      const validItems = items.filter(item => item.product && item.quantity > 0);
      
      if (validItems.length === 0) {
        toast.error('Please select at least one product to restock');
        setIsSubmitting(false);
        return;
      }

      await createRestock({
        supplier_name: supplier || '',
        items: validItems.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          unit_cost: item.product.purchase_price // Using purchase_price from product as unit_cost
        })),
        // invoice_number: '', // Add if you have a field for this
        // notes: '' // Add if you have a field for this
      });
      
      toast.success(`Successfully restocked ${validItems.length} product(s)!`);
      
      // Reset form
      setItems([{ productId: '', product: null, quantity: 1, searchTerm: '', filteredProducts: [] }]);
      setSupplier('');
      await fetchProducts(); // Refresh product list
      
    } catch (error) {
      console.error('Error submitting restock:', error);
      toast.error(`Failed to restock: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="restock-form-container">
      <form onSubmit={handleSubmit} className="restock-form">
        {/* Add New Product Checkbox */}
        <div className="new-product-section">
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={showAddNewProduct}
              onChange={(e) => setShowAddNewProduct(e.target.checked)}
            />
            <span className="checkmark"></span>
            Add New Product to Database
          </label>
        </div>

        {/* New Product Form */}
        {showAddNewProduct && (
          <div className="new-product-form">
            <h3>Add New Product</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter product name"
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter category"
                  value={newProductForm.category}
                  onChange={(e) => setNewProductForm(prev => ({ ...prev, category: e.target.value }))}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Purchase Price *</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  placeholder="0.00"
                  value={newProductForm.purchase_price}
                  onChange={(e) => setNewProductForm(prev => ({ ...prev, purchase_price: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Selling Price *</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  placeholder="0.00"
                  value={newProductForm.selling_price}
                  onChange={(e) => setNewProductForm(prev => ({ ...prev, selling_price: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Minimum Stock</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="5"
                  value={newProductForm.minimum_stock}
                  onChange={(e) => setNewProductForm(prev => ({ ...prev, minimum_stock: e.target.value }))}
                />
              </div>
            </div>
            <button type="button" onClick={handleAddNewProduct} className="add-product-btn">
              <Plus size={16} /> Add Product
            </button>
          </div>
        )}

        {/* Supplier Field */}
        <div className="form-group">
          <label htmlFor="supplier">Supplier (Optional)</label>
          <div className="input-with-icon">
            <Truck className="input-icon" />
            <input
              id="supplier"
              type="text"
              className="form-input"
              placeholder="e.g., PT. Maju Mundur"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
            />
          </div>
        </div>

        {/* Items Section */}
        <div className="items-section">
          <div className="section-header">
            <h3><ShoppingCart size={20} /> Restock Items</h3>
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

                {/* Inline layout: Item Number + Search + Quantity */}
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
                            {product.name} (Stock: {product.stock_quantity})
                          </li>
                        ))}
                      </ul>
                    )}
                    {item.product && (
                      <p className="selected-product-info">
                        Selected: {item.product.name} (Current Stock: {item.product.stock_quantity})
                      </p>
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
                        placeholder="1"
                        title="Quantity to restock"
                      />
                      <button 
                        type="button" 
                        onClick={() => handleQuantityChange(item.quantity + 1, index)}
                        className="quantity-button"
                        title="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
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

        {/* Submit Button */}
        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? (
              <><Loader className="spinner" size={20} /> Processing...</>
            ) : (
              <><CheckCircle size={20} /> Restock Products</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RestockForm;