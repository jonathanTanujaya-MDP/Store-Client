import React, { createContext, useContext, useState, useEffect } from 'react';
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
      // Clear any existing session first to prevent conflicts
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      setUser(null);

      // Small delay to ensure clean state
      await new Promise(resolve => setTimeout(resolve, 100));

      const response = await fetch(`${API_ENDPOINTS.auth}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        const errorMessage = error.error || error.message || 'Login failed';
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }

      const data = await response.json();
      const { token, user: userData } = data;

      // Store in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Update state
      setUser(userData);
      
      toast.success(`Welcome back, ${userData.username}!`);
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'Network error occurred';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    // Clear all authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    // Clear state immediately
    setUser(null);
    
    // Clear any cached data
    sessionStorage.clear();
    
    toast.info('Logged out successfully');
  };

  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('authToken');
  };

  // Quick switch function for account switching
  const switchAccount = async (username, password) => {
    try {
      setIsLoading(true);
      
      // Don't show logout message for switching
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      setUser(null);

      // Quick login without extra delays
      const response = await fetch(`${API_ENDPOINTS.auth}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        const errorMessage = error.error || error.message || 'Switch account failed';
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }

      const data = await response.json();
      const { token, user: userData } = data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
      
      toast.success(`Switched to ${userData.username}`);
      return { success: true, user: userData };
    } catch (error) {
      console.error('Switch account error:', error);
      const errorMessage = error.message || 'Network error occurred';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    login,
    logout,
    switchAccount,
    isAuthenticated,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
