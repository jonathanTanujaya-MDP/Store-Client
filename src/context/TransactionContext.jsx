import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../utils/apiClient';
import { useAuth } from './AuthContext.jsx';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api';

const TransactionContext = createContext();

export const useTransactions = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { isAuthenticated } = useAuth();

  const fetchTransactions = async () => {
    if (!isAuthenticated()) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/api/transactions');
      setTransactions(response.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to fetch transactions.');
    } finally {
      setLoading(false);
    }
  };

  const clearAllTransactions = async () => {
    if (!isAuthenticated()) return;
    
    setLoading(true);
    setError(null);
    try {
      await apiClient.delete('/api/transactions/clear');
      setTransactions([]); // Clear transactions in state
      toast.success('All transaction history cleared!');
    } catch (err) {
      console.error('Error clearing transactions:', err);
      setError('Failed to clear transactions.');
      toast.error('Failed to clear transaction history.');
      throw err; // Re-throw to allow component to catch error
    } finally {
      setLoading(false);
    }
  };

  // Only fetch transactions if authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      fetchTransactions();
    }
  }, [isAuthenticated]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        loading,
        error,
        fetchTransactions,
        clearAllTransactions, // Add clearAllTransactions to context value
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};