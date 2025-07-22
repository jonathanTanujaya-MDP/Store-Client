// API Configuration - Using Environment Variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://store-server-production-3e10.up.railway.app';

export const API_ENDPOINTS = {
  auth: `${API_BASE_URL}/api/auth`,
  products: `${API_BASE_URL}/api/products`,
  sales: `${API_BASE_URL}/api/sales`,
  transactions: `${API_BASE_URL}/api/transactions`,
  restock: `${API_BASE_URL}/api/restock`,
  reports: `${API_BASE_URL}/api/reports`,
};

// Enhanced login function to handle errors properly
export async function login(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || 'Login gagal');
    }

    const data = await response.json();
    // Simpan token di localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  } catch (error) {
    console.error('Terjadi kesalahan saat login:', error.message);
    throw error;
  }
}

export default API_BASE_URL;
