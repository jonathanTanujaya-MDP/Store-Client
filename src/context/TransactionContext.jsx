import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast'; // Import toast

const TransactionContext = createContext();

export const useTransactions = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:5000/api/transactions'; // Sesuaikan dengan URL backend Anda

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setTransactions(response.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to fetch transactions.');
    } finally {
      setLoading(false);
    }
  };

  const clearAllTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/clear`);
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

  useEffect(() => {
    fetchTransactions();
  }, []);

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