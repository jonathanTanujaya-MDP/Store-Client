import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { UIScaleProvider } from './context/UIScaleContext.jsx';
import { SalesProvider } from './context/SalesContext.jsx';
import { RestockProvider } from './context/RestockContext.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Products from './pages/Products.jsx';
import History from './pages/History.jsx';
import Reports from './pages/Reports.jsx';
import StockAlerts from './pages/StockAlerts.jsx';
import AddTransaction from './pages/AddTransaction.jsx';
import Restock from './pages/Restock.jsx';
import useHotkeys from './hooks/useHotkeys.js';
import usePageTitle from './hooks/usePageTitle.js';

// Component wrapper untuk hotkeys yang ada di dalam Router context
function AppContent() {
  useHotkeys(); // Enable global hotkeys
  usePageTitle(); // Dynamic page titles
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/products" element={
        <PrivateRoute>
          <Layout>
            <Products />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/history" element={
        <PrivateRoute>
          <Layout>
            <History />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/reports" element={
        <PrivateRoute>
          <Layout>
            <Reports />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/stock-alerts" element={
        <PrivateRoute>
          <Layout>
            <StockAlerts />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/add-transaction" element={
        <PrivateRoute>
          <Layout>
            <AddTransaction />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/restock" element={
        <PrivateRoute>
          <Layout>
            <Restock />
          </Layout>
        </PrivateRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <UIScaleProvider>
        <SalesProvider>
          <RestockProvider>
            <AppContent />
            <Toaster position="top-right" reverseOrder={false} />
          </RestockProvider>
        </SalesProvider>
      </UIScaleProvider>
    </Router>
  );
}

export default App;