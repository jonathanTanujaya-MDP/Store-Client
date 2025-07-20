
import React, { useState } from 'react';
import { Package, Plus, TrendingUp, Search, Minus, User, ShoppingCart, CheckCircle, DollarSign } from 'lucide-react';
import { useProducts } from '../context/ProductContext.jsx';
import { formatCurrency } from '../utils/currency.js';
import toast from 'react-hot-toast';
import './Restock.css';

const Restock = () => {
  const [activeTab, setActiveTab] = useState('restock');
  const { products } = useProducts();
  
  // Restock form state
  const [supplier, setSupplier] = useState('');
  const [restockItems, setRestockItems] = useState([]);
  const [currentRestockItem, setCurrentRestockItem] = useState({
    product: null,
    quantity: 1,
    searchTerm: '',
    filteredProducts: []
  });
  
  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    buyingPrice: '',
    sellingPrice: '',
    initialStock: 1,
    minStock: 5,
    supplier: ''
  });

  // Filter products for restock search
  const handleRestockProductSearch = (value) => {
    setCurrentRestockItem(prev => ({
      ...prev,
      searchTerm: value,
      filteredProducts: value.trim() ? 
        products.filter(p => p.name.toLowerCase().includes(value.toLowerCase())).slice(0, 5) : 
        []
    }));
  };

  const handleRestockProductSelect = (product) => {
    setCurrentRestockItem(prev => ({
      ...prev,
      product: product,
      searchTerm: product.name,
      filteredProducts: []
    }));
  };

  const addRestockItemToList = () => {
    if (currentRestockItem.product && currentRestockItem.quantity > 0) {
      setRestockItems(prev => [...prev, { ...currentRestockItem }]);
      setCurrentRestockItem({
        product: null,
        quantity: 1,
        searchTerm: '',
        filteredProducts: []
      });
    }
  };

  const removeRestockItemFromList = (index) => {
    setRestockItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleRestock = async () => {
    if (restockItems.length === 0) {
      toast.error('Please add at least one item to restock');
      return;
    }
    
    const validItems = restockItems.filter(item => item.product && item.quantity > 0);
    
    if (validItems.length === 0) {
      toast.error('Please ensure all items have valid products and quantities');
      return;
    }
    
    try {
      // Implement restock logic here
      toast.success(`Successfully restocked ${validItems.length} item(s)`);
      // Reset form
      setRestockItems([]);
      setCurrentRestockItem({
        product: null,
        quantity: 1,
        searchTerm: '',
        filteredProducts: []
      });
      setSupplier('');
    } catch (error) {
      toast.error('Failed to restock products. Please try again.');
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.buyingPrice || !newProduct.sellingPrice) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      // Implement add product logic here
      toast.success(`Successfully added new product: ${newProduct.name}`);
      // Reset form
      setNewProduct({
        name: '',
        category: '',
        buyingPrice: '',
        sellingPrice: '',
        initialStock: 1,
        minStock: 5,
        supplier: ''
      });
    } catch (error) {
      toast.error('Failed to add new product. Please try again.');
    }
  };

  return (
    <div className="restock-page">
      <div className="restock-header">
        <div className="restock-title-section">
          <h1 className="restock-title">
            <ShoppingCart size={32} />
            Stock Management
          </h1>
          <p className="restock-subtitle">
            Manage your inventory efficiently and add new products
          </p>
        </div>
        
        <div className="tab-selector">
          <button
            className={`tab-btn ${activeTab === 'restock' ? 'active' : ''}`}
            onClick={() => setActiveTab('restock')}
          >
            <TrendingUp size={18} />
            Restock Existing
          </button>
          <button
            className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            <Plus size={18} />
            Add New Product
          </button>
        </div>
      </div>
      
      <div className="restock-content">
        {activeTab === 'restock' && (
          <div className="restock-form-container">
            {/* Main Content Area (Left Column) */}
            <div className="main-restock-content">
              {/* Supplier Information Section */}
              <div className="supplier-section">
                <div className="section-title">
                  <User size={20} />
                  <span>Supplier Information</span>
                </div>
                <div className="form-group">
                  <label className="form-label">Supplier (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., PT. Maju Mundur"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                  />
                </div>
              </div>

              {/* Product Selection Section */}
              <div className="product-section">
                <div className="section-title">
                  <Package size={20} />
                  <span>Add Items to Restock</span>
                </div>
                
                {/* Add Item Card */}
                <div className="add-item-card">
                  <div className="add-item-row">
                    <div className="product-search-container">
                      <div className="search-input-wrapper">
                        <Search className="search-icon" size={16} />
                        <input
                          type="text"
                          className="product-search-input"
                          placeholder="Type to search products..."
                          value={currentRestockItem.searchTerm}
                          onChange={(e) => handleRestockProductSearch(e.target.value)}
                          autoComplete="off"
                        />
                        
                        {/* Autocomplete Dropdown */}
                        {currentRestockItem.filteredProducts.length > 0 && currentRestockItem.searchTerm && (
                          <div className="autocomplete-dropdown">
                            {currentRestockItem.filteredProducts.map(product => (
                              <div
                                key={product.id}
                                className="autocomplete-item"
                                onClick={() => handleRestockProductSelect(product)}
                              >
                                <div className="product-info">
                                  <span className="product-name">{product.name}</span>
                                  <span className="product-meta">
                                    Current Stock: {product.stock_quantity} • {formatCurrency(product.selling_price)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Quantity Control */}
                    <div className="quantity-control-inline">
                      <button 
                        className="qty-btn"
                        onClick={() => setCurrentRestockItem(prev => ({
                          ...prev,
                          quantity: Math.max(1, prev.quantity - 1)
                        }))}
                        disabled={currentRestockItem.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        type="number"
                        className="qty-input"
                        value={currentRestockItem.quantity}
                        onChange={(e) => setCurrentRestockItem(prev => ({
                          ...prev,
                          quantity: Math.max(1, parseInt(e.target.value) || 1)
                        }))}
                      />
                      <button 
                        className="qty-btn"
                        onClick={() => setCurrentRestockItem(prev => ({
                          ...prev,
                          quantity: prev.quantity + 1
                        }))}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Selected Product Info */}
                  {currentRestockItem.product && (
                    <div className="consolidated-product-info">
                      <div className="product-header">
                        <div className="product-main-info">
                          <h4>{currentRestockItem.product.name}</h4>
                          <div className="product-meta">
                            <span>Current Stock: {currentRestockItem.product.stock_quantity}</span>
                            <span>Category: {currentRestockItem.product.category || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="product-price-main">
                          {formatCurrency(currentRestockItem.product.selling_price)}
                        </div>
                      </div>
                      <div className="quantity-price-row">
                        <div className="quantity-simple">
                          <span>Adding:</span>
                          <span className="quantity-value">{currentRestockItem.quantity}</span>
                          <span>units</span>
                        </div>
                        <div className="subtotal-simple">
                          New Total: {currentRestockItem.product.stock_quantity + currentRestockItem.quantity} units
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Add Button */}
                  <button 
                    className="add-btn-enhanced"
                    onClick={addRestockItemToList}
                    disabled={!currentRestockItem.product}
                  >
                    <Plus size={16} />
                    Add to Restock List
                  </button>
                </div>
              </div>

              {/* Items List */}
              {restockItems.length > 0 && (
                <div className="items-list-section">
                  <div className="section-title">
                    <CheckCircle size={20} />
                    <span>Items to Restock</span>
                  </div>
                  <div className="items-list-simplified">
                    <div className="items-list-header">
                      <h4>Ready to Restock ({restockItems.length} items)</h4>
                    </div>
                    {restockItems.map((item, index) => (
                      <div key={index} className="item-row-flat">
                        <div className="item-info-flat">
                          <div className="item-name-flat">
                            <span className="item-checkmark">✓</span>
                            {item.product.name}
                          </div>
                          <div className="item-calculation-flat">
                            <span>Current: {item.product.stock_quantity}</span>
                            <span>→</span>
                            <span>Adding: {item.quantity}</span>
                            <span>→</span>
                            <strong>New Total: {item.product.stock_quantity + item.quantity}</strong>
                          </div>
                        </div>
                        <button 
                          className="remove-btn-minimal"
                          onClick={() => removeRestockItemFromList(index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Summary (Right Column) */}
            <div className="restock-sidebar">
              {/* Restock Summary Card */}
              <div className="restock-summary-card">
                <div className="restock-summary-header">
                  <TrendingUp size={20} />
                  <h3>Restock Summary</h3>
                </div>
                
                <div className="restock-stats">
                  <div className="stat-item">
                    <span className="stat-value">{restockItems.length}</span>
                    <span className="stat-label">Items</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{restockItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                    <span className="stat-label">Total Units</span>
                  </div>
                </div>

                <div className="sidebar-actions">
                  <button 
                    className="quick-action-btn quick-action-primary"
                    onClick={handleRestock}
                    disabled={restockItems.length === 0}
                  >
                    <CheckCircle size={16} />
                    Complete Restock
                  </button>
                  {restockItems.length > 0 && (
                    <button 
                      className="quick-action-btn quick-action-secondary"
                      onClick={() => setRestockItems([])}
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              {/* Supplier Info in Sidebar */}
              {supplier && (
                <div className="sidebar-supplier-info">
                  <h4>Supplier</h4>
                  <p>{supplier}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'add' && (
          <div className="add-product-form-container">
            <div className="add-product-form-content">
              {/* Left Column */}
              <div className="add-product-left-column">
                {/* Product Information Section */}
                <div className="add-form-section product-info-card">
                  <div className="add-section-header">
                    <div className="add-section-icon">
                      <Package size={20} />
                    </div>
                    <h3 className="add-section-title">Product Info</h3>
                  </div>
                  
                  <div className="add-form-row">
                    <div className="add-form-field">
                      <label className="add-form-label">Product Name</label>
                      <input
                        type="text"
                        className="add-form-input"
                        placeholder="Enter product name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      />
                    </div>
                    <div className="add-form-field">
                      <label className="add-form-label">Category</label>
                      <input
                        type="text"
                        className="add-form-input"
                        placeholder="e.g., Electronics"
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing Information Section */}
                <div className="add-form-section pricing-info-card">
                  <div className="add-section-header">
                    <div className="add-section-icon">
                      <DollarSign size={20} />
                    </div>
                    <h3 className="add-section-title">Pricing Info</h3>
                  </div>
                  
                  <div className="add-form-row">
                    <div className="add-form-field">
                      <label className="add-form-label">Buying Price</label>
                      <input
                        type="number"
                        className="add-form-input"
                        placeholder="0"
                        value={newProduct.buyingPrice}
                        onChange={(e) => setNewProduct({...newProduct, buyingPrice: e.target.value})}
                      />
                    </div>
                    <div className="add-form-field">
                      <label className="add-form-label">Selling Price</label>
                      <input
                        type="number"
                        className="add-form-input"
                        placeholder="0"
                        value={newProduct.sellingPrice}
                        onChange={(e) => setNewProduct({...newProduct, sellingPrice: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="add-product-right-column">
                {/* Stock Information Section */}
                <div className="add-form-section stock-info-card">
                  <div className="add-section-header">
                    <div className="add-section-icon">
                      <TrendingUp size={20} />
                    </div>
                    <h3 className="add-section-title">Stock Info</h3>
                  </div>
                  
                  <div className="add-form-row">
                    <div className="add-form-field">
                      <label className="add-form-label">Initial Stock</label>
                      <input
                        type="number"
                        className="add-form-input"
                        value={newProduct.initialStock}
                        onChange={(e) => setNewProduct({...newProduct, initialStock: parseInt(e.target.value) || 1})}
                      />
                    </div>
                    <div className="add-form-field">
                      <label className="add-form-label">Minimum Stock Alert</label>
                      <input
                        type="number"
                        className="add-form-input"
                        value={newProduct.minStock}
                        onChange={(e) => setNewProduct({...newProduct, minStock: parseInt(e.target.value) || 5})}
                      />
                    </div>
                  </div>
                </div>

                {/* Supplier Information Section */}
                <div className="add-form-section supplier-info-card">
                  <div className="add-section-header">
                    <div className="add-section-icon">
                      <User size={20} />
                    </div>
                    <h3 className="add-section-title">Supplier Info</h3>
                  </div>
                  
                  <div className="add-form-field full-width">
                    <label className="add-form-label">Supplier</label>
                    <input
                      type="text"
                      className="add-form-input"
                      placeholder="e.g., PT. Supplier Utama"
                      value={newProduct.supplier}
                      onChange={(e) => setNewProduct({...newProduct, supplier: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Add Button */}
            <div className="add-product-footer">
              <button 
                className="add-product-submit-btn"
                onClick={handleAddProduct}
              >
                <Plus size={18} />
                Add New Product
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Restock;