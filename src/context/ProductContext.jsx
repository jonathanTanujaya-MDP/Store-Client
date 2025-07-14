import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = API_ENDPOINTS.products;

  // Realtime update dengan polling setiap 30 detik
  useEffect(() => {
    const interval = setInterval(() => {
      fetchProducts();
    }, 30000); // Update setiap 30 detik

    return () => clearInterval(interval);
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setProducts(response.data);
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
      const response = await axios.post(API_URL, productToSend);
      setProducts((prevProducts) => [...prevProducts, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error adding product:', err);
      setError('Failed to add product.');
      throw err; // Re-throw to allow form to catch error
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
      const response = await axios.put(`${API_URL}/${id}`, productToSend);
      setProducts((prevProducts) =>
        prevProducts.map((p) => (p.id === id ? response.data : p)) // Use p.id
      );
      return response.data;
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Failed to update product.');
      throw err; // Re-throw to allow form to catch error
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/${id}`);
      setProducts((prevProducts) =>
        prevProducts.filter((p) => p.id !== id) // Use p.id
      );
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product.');
      throw err; // Re-throw to allow form to catch error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const lowStockCount = products.filter(
    (product) => product.stock_quantity <= product.minimum_stock
  ).length;

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
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