// API Configuration
const API_BASE_URL = 'https://store-server-production-3e10.up.railway.app';

export const API_ENDPOINTS = {
  products: `${API_BASE_URL}/api/products`,
  sales: `${API_BASE_URL}/api/sales`,
  transactions: `${API_BASE_URL}/api/transactions`,
  restock: `${API_BASE_URL}/api/restock`,
};

export default API_BASE_URL;
