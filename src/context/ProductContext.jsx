import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../utils/apiClient';
import { useAuth } from './AuthContext.jsx';
import { API_ENDPOINTS } from '../config/api';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [canSeePurchasePrice, setCanSeePurchasePrice] = useState(false);
  
  const { isAuthenticated } = useAuth();

  // Get user role from AuthContext
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData && isAuthenticated()) {
      try {
        const user = JSON.parse(userData);
        setUserRole(user.role);
        setCanSeePurchasePrice(user.role === 'owner');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, [isAuthenticated]);

  // Only fetch products if authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  // Realtime update dengan polling setiap 30 detik - only if authenticated
  useEffect(() => {
    if (!isAuthenticated()) return;
    
    const interval = setInterval(() => {
      fetchProducts();
    }, 30000); // Update setiap 30 detik

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const fetchProducts = async () => {
    if (!isAuthenticated()) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/api/products');
      // Handle new response format with role-based data
      if (response.data.products) {
        setProducts(response.data.products);
        setUserRole(response.data.userRole);
        setCanSeePurchasePrice(response.data.canSeePurchasePrice);
      } else {
        // Fallback for old response format
        setProducts(response.data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product) => {
    setLoading(true);
    setError(null);
    try {
      // Ensure correct keys are sent to backend
      const productToSend = {
        name: product.name,
        purchase_price: product.purchase_price,
        selling_price: product.selling_price,
        stock_quantity: product.stock, // Map frontend 'stock' to backend 'stock_quantity'
        minimum_stock: product.min_stock, // Map frontend 'min_stock' to backend 'minimum_stock'
        category: product.category,
      };
      const response = await apiClient.post('/api/products', productToSend);
      
      // Handle new response format
      const newProduct = response.data.product || response.data;
      setProducts((prevProducts) => [...prevProducts, newProduct]);
      return newProduct;
    } catch (err) {
      console.error('Error adding product:', err);
      const errorMessage = err.response?.data?.error || 'Failed to add product.';
      setError(errorMessage);
      throw new Error(errorMessage); // Re-throw with proper error message
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id, updatedProduct) => {
    setLoading(true);
    setError(null);
    try {
      // Ensure correct keys are sent to backend
      const productToSend = {
        name: updatedProduct.name,
        purchase_price: updatedProduct.purchase_price,
        selling_price: updatedProduct.selling_price,
        stock_quantity: updatedProduct.stock, // Map frontend 'stock' to backend 'stock_quantity'
        minimum_stock: updatedProduct.min_stock, // Map frontend 'min_stock' to backend 'minimum_stock'
        category: updatedProduct.category,
      };
      const response = await apiClient.put(`/api/products/${id}`, productToSend);
      
      // Handle new response format
      const updatedProductData = response.data.product || response.data;
      setProducts((prevProducts) =>
        prevProducts.map((p) => (p.id === id ? updatedProductData : p))
      );
      return updatedProductData;
    } catch (err) {
      console.error('Error updating product:', err);
      const errorMessage = err.response?.data?.error || 'Failed to update product.';
      setError(errorMessage);
      throw new Error(errorMessage); // Re-throw with proper error message
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.delete(`/api/products/${id}`);
      setProducts((prevProducts) =>
        prevProducts.filter((p) => p.id !== id)
      );
    } catch (err) {
      console.error('Error deleting product:', err);
      const errorMessage = err.response?.data?.error || 'Failed to delete product.';
      
      // Handle permission errors specifically
      if (err.response?.status === 403) {
        setError('Access denied. Only owners can delete products.');
        throw new Error('Access denied. Only owners can delete products.');
      } else {
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Remove this duplicate useEffect since we already have auth-based fetch above
  // useEffect(() => {
  //   fetchProducts();
  // }, []);

  const lowStockCount = products.filter(
    (product) => product.stock_quantity <= product.minimum_stock
  ).length;

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        userRole,
        canSeePurchasePrice,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        lowStockCount,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};