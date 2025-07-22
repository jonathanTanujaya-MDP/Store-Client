import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        // Invalid stored data, clear it
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API_ENDPOINTS.auth}/login`, {
        username,
        password
      });

      const { token, user: userData } = response.data;

      // Store in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Update state
      setUser(userData);
      
      toast.success(`Welcome back, ${userData.username}!`);
      return { success: true, user: userData };
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Login failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('authToken');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
