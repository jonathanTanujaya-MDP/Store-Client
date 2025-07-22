// API Configuration - Production Ready
const API_BASE_URL = 'https://store-omega-livid.vercel.app';

export const API_ENDPOINTS = {
  auth: `${API_BASE_URL}/api/auth`,
  products: `${API_BASE_URL}/api/products`,
  sales: `${API_BASE_URL}/api/sales`,
  transactions: `${API_BASE_URL}/api/transactions`,
  restock: `${API_BASE_URL}/api/restock`,
  reports: `${API_BASE_URL}/api/reports`,
};

export default API_BASE_URL;
