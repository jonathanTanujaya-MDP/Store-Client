import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { UIScaleProvider } from './context/UIScaleContext.jsx';
import { ProductProvider } from './context/ProductContext.jsx';
import { SalesProvider } from './context/SalesContext.jsx';
import { RestockProvider } from './context/RestockContext.jsx';
import Layout from './components/Layout.jsx';
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
    <Layout>
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/products' element={<Products />} />
        <Route path='/history' element={<History />} /> {/* Changed route path and element */}
        <Route path='/reports' element={<Reports />} />
        <Route path='/stock-alerts' element={<StockAlerts />} />
        <Route path='/add-transaction' element={<AddTransaction />} />
        <Route path='/restock' element={<Restock />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <UIScaleProvider>
        <ProductProvider>
          <SalesProvider>
            <RestockProvider>
              <AppContent />
              <Toaster position="top-right" reverseOrder={false} />
            </RestockProvider>
          </SalesProvider>
        </ProductProvider>
      </UIScaleProvider>
    </Router>
  );
}

export default App;