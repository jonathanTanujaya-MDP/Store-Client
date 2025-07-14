// PROMPT: Update Frontend untuk menggunakan Sales dan Restock API terpisah

// 1. CREATE: SalesContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const SalesContext = createContext();
export const useSales = () => useContext(SalesContext);

export const SalesProvider = ({ children }) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:5000/api/sales';

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

// 2. CREATE: RestockContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const RestockContext = createContext();
export const useRestock = () => useContext(RestockContext);

export const RestockProvider = ({ children }) => {
  const [restocks, setRestocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:5000/api/restock';

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

// 3. UPDATE: App.jsx - Wrap with new providers
import { SalesProvider } from './context/SalesContext.jsx';
import { RestockProvider } from './context/RestockContext.jsx';

function App() {
  return (
    <Router>
      <UIScaleProvider>
        <ProductProvider>
          <SalesProvider>
            <RestockProvider>
              <Layout>
                <Routes>
                  {/* ...existing routes... */}
                </Routes>
              </Layout>
              <Toaster position="top-right" reverseOrder={false} />
            </RestockProvider>
          </SalesProvider>
        </ProductProvider>
      </UIScaleProvider>
    </Router>
  );
}

// 4. UPDATE: AddTransaction.jsx - Use Sales API
// Ganti axios.post('http://localhost:5000/api/transactions', transactionData) dengan:
// const { createSale } = useSales();
// await createSale({
//   customer_name: customerName,
//   items: validItems.map(item => ({
//     product_id: item.product.id,
//     quantity: item.quantity,
//   })),
//   payment_method: 'cash',
//   notes: ''
// });

// 5. UPDATE: RestockForm.jsx - Use Restock API
// Ganti axios.post('http://localhost:5000/api/transactions', transactionData) dengan:
// const { createRestock } = useRestock();
// await createRestock({
//   supplier_name: supplier || '',
//   items: validItems.map(item => ({
//     product_id: item.product.id,
//     quantity: item.quantity,
//     unit_cost: item.product.purchase_price // or custom price
//   })),
//   invoice_number: '',
//   notes: ''
// });
