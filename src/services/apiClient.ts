import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('rentalhub_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMsg = error?.response?.data?.error?.message || error.message || 'API request failed.';
    console.error('API Error:', errorMsg);
    return Promise.reject(error?.response?.data?.error || { code: 'NETWORK_ERROR', message: errorMsg });
  }
);
