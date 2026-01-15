import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
const API_URL = `${BACKEND_URL}/api`;

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${BACKEND_URL}/storage${path}`;
};

export const apiUrl = (path) => {
  return `${BACKEND_URL}${path}`;
};

// Public API instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
  },
});

// Authenticated API instance
export const apiAuth = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
  },
});

apiAuth.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = sessionStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { BACKEND_URL };
