
import React, { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Package, DollarSign, ClipboardList, Minus, Plus, Loader, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import './ProductForm.css';

// Create dynamic schema based on user role
const createSchema = (isOwner) => {
  const baseSchema = {
    name: yup.string().required('Product Name is required'),
    selling_price: yup.number().typeError('Must be a number').positive('Must be positive').required('Selling Price is required'),
    stock: yup.number().typeError('Must be a number').integer('Must be an integer').min(0, 'Cannot be negative').required('Stock is required'),
    min_stock: yup.number().typeError('Must be a number').integer('Must be an integer').min(0, 'Cannot be negative').required('Minimum Stock is required'),
    category: yup.string().required('Category is required'),
  };

  // Add purchase_price validation only for owners
  if (isOwner) {
    baseSchema.purchase_price = yup.number().typeError('Must be a number').positive('Must be positive').required('Purchase Price is required');
  }

  return yup.object().shape(baseSchema);
};

const ProductForm = ({ product, onSubmit, onClose }) => {
  const { user } = useAuth();
  
  // Get user role - from auth context or localStorage
  const currentUserRole = user?.role || JSON.parse(localStorage.getItem('userData') || '{}')?.role || 'admin';
  const isOwner = currentUserRole === 'owner';
  
  const schema = createSchema(isOwner);
  
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const stockQuantity = watch('stock', 0);
  const minStockQuantity = watch('min_stock', 0);

  // Auto save handler for Ctrl+S
  const handleAutoSave = useCallback((data) => {
    if (Object.keys(errors).length === 0) {
      onSubmit(data);
      toast.success('Product saved automatically!');
    } else {
      toast.error('Please fix form errors before saving');
    }
  }, [onSubmit, errors]);

  useEffect(() => {
    if (product) {
      reset(product);
    } else {
      reset();
    }
  }, [product, reset]);

  // Listen for hotkey save event
  useEffect(() => {
    const handleSaveEvent = () => {
      const formData = watch();
      handleAutoSave(formData);
    };

    document.addEventListener('hotkey-save', handleSaveEvent);
    return () => document.removeEventListener('hotkey-save', handleSaveEvent);
  }, [handleAutoSave, watch]);

  const handleFormSubmit = (data) => {
    // For admin users, preserve the existing purchase_price if editing a product
    if (!isOwner && product && product.purchase_price) {
      data.purchase_price = product.purchase_price;
    }
    onSubmit(data);
  };

  return (
    <div className="product-form-overlay">
      <div className="product-form-container">
        <h2 className="product-form-title">{product ? 'Edit Product' : 'Add New Product'}</h2>
        <p className="product-form-subtitle">{product ? 'Update product details' : 'Add a new product to your inventory'}</p>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="product-form">
          <div className="form-group">
            <label htmlFor="name">Product Name <span className="required-indicator">*</span></label>
            <div className="input-with-icon">
              <Package className="input-icon" />
              <input id="name" type="text" {...register('name')} className={`form-input ${errors.name ? 'input-error' : ''}`} placeholder="Enter product name" />
            </div>
            {errors.name && <p className="error-message">{errors.name.message}</p>}
          </div>

          {/* Only show purchase price for owners */}
          {isOwner && (
            <div className="form-group">
              <label htmlFor="purchase_price">Purchase Price <span className="required-indicator">*</span></label>
              <div className="input-with-icon">
                <DollarSign className="input-icon" />
                <input id="purchase_price" type="number" step="0.01" {...register('purchase_price')} className={`form-input ${errors.purchase_price ? 'input-error' : ''}`} placeholder="Enter purchase price" />
              </div>
              {errors.purchase_price && <p className="error-message">{errors.purchase_price.message}</p>}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="selling_price">Selling Price <span className="required-indicator">*</span></label>
            <div className="input-with-icon">
              <DollarSign className="input-icon" />
              <input id="selling_price" type="number" step="0.01" {...register('selling_price')} className={`form-input ${errors.selling_price ? 'input-error' : ''}`} placeholder="Enter selling price" />
            </div>
            {errors.selling_price && <p className="error-message">{errors.selling_price.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock <span className="required-indicator">*</span></label>
            <div className="quantity-input-group">
              <button type="button" onClick={() => setValue('stock', Math.max(0, stockQuantity - 1))} className="quantity-button"><Minus size={16} /></button>
              <input id="stock" type="number" {...register('stock')} className={`form-input quantity-input ${errors.stock ? 'input-error' : ''}`} placeholder="Enter current stock" />
              <button type="button" onClick={() => setValue('stock', stockQuantity + 1)} className="quantity-button"><Plus size={16} /></button>
            </div>
            {errors.stock && <p className="error-message">{errors.stock.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="min_stock">Minimum Stock <span className="required-indicator">*</span></label>
            <div className="quantity-input-group">
              <button type="button" onClick={() => setValue('min_stock', Math.max(0, minStockQuantity - 1))} className="quantity-button"><Minus size={16} /></button>
              <input id="min_stock" type="number" {...register('min_stock')} className={`form-input quantity-input ${errors.min_stock ? 'input-error' : ''}`} placeholder="Enter minimum stock alert level" />
              <button type="button" onClick={() => setValue('min_stock', minStockQuantity + 1)} className="quantity-button"><Plus size={16} /></button>
            </div>
            {errors.min_stock && <p className="error-message">{errors.min_stock.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="category">Category <span className="required-indicator">*</span></label>
            <div className="input-with-icon">
              <ClipboardList className="input-icon" />
              <input id="category" type="text" {...register('category')} className={`form-input ${errors.category ? 'input-error' : ''}`} placeholder="Enter product category" />
            </div>
            {errors.category && <p className="error-message">{errors.category.message}</p>}
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? <Loader className="spinner" size={20} /> : <><CheckCircle size={20} /> {product ? 'Update Product' : 'Add Product'}</>}
            </button>
            <button type="button" onClick={onClose} className="cancel-button">
              <XCircle size={20} /> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
