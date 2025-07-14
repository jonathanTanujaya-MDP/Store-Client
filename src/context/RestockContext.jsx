import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api';

const RestockContext = createContext();
export const useRestock = () => useContext(RestockContext);

export const RestockProvider = ({ children }) => {
  const [restocks, setRestocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = API_ENDPOINTS.restock;

  const fetchRestocks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setRestocks(response.data);
    } catch (err) {
      console.error('Error fetching restocks:', err);
      setError('Failed to fetch restocks.');
    } finally {
      setLoading(false);
    }
  };

  const createRestock = async (restockData) => {
    try {
      const response = await axios.post(API_URL, restockData);
      await fetchRestocks(); // Refresh data
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const deleteRestock = async (restockId) => {
    try {
      await axios.delete(`${API_URL}/${restockId}`);
      await fetchRestocks(); // Refresh data
      toast.success('Restock deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete restock.');
      throw err;
    }
  };

  const getStockMovements = async (productId = null) => {
    try {
      const url = productId ? `${API_URL}/movements/${productId}` : `${API_URL}/movements`;
      const response = await axios.get(url);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  return (
    <RestockContext.Provider value={{
      restocks,
      loading,
      error,
      fetchRestocks,
      createRestock,
      deleteRestock,
      getStockMovements
    }}>
      {children}
    </RestockContext.Provider>
  );
};
