import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api';

const SalesContext = createContext();
export const useSales = () => useContext(SalesContext);

export const SalesProvider = ({ children }) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = API_ENDPOINTS.sales;

  const fetchSales = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setSales(response.data);
    } catch (err) {
      console.error('Error fetching sales:', err);
      setError('Failed to fetch sales.');
    } finally {
      setLoading(false);
    }
  };

  const createSale = async (saleData) => {
    try {
      const response = await axios.post(API_URL, saleData);
      await fetchSales(); // Refresh data
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const deleteSale = async (saleId) => {
    try {
      await axios.delete(`${API_URL}/${saleId}`);
      await fetchSales(); // Refresh data
      toast.success('Sale deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete sale.');
      throw err;
    }
  };

  return (
    <SalesContext.Provider value={{
      sales,
      loading,
      error,
      fetchSales,
      createSale,
      deleteSale
    }}>
      {children}
    </SalesContext.Provider>
  );
};
