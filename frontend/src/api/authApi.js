import axios from 'axios';

const isProd = import.meta.env.PROD;

const AUTH_API = axios.create({
  baseURL: '/api/auth',
  headers: { 'Content-Type': 'application/json' },
  timeout: 5000,
});

export const loginUser = async (email, password) => {
  if (isProd) {
    // Mock login for Vercel
    return new Promise(resolve => setTimeout(() => resolve({
      success: true,
      message: 'Mock Login successful',
      user: { id: 'mock-1', name: 'Demo User', email }
    }), 500));
  }
  const response = await AUTH_API.post('/login', { email, password });
  return response.data;
};

export const registerUser = async (name, email, password) => {
  if (isProd) {
    // Mock register for Vercel
    return new Promise(resolve => setTimeout(() => resolve({
      success: true,
      message: 'Mock Registration successful',
      user: { id: 'mock-2', name, email }
    }), 500));
  }
  const response = await AUTH_API.post('/register', { name, email, password });
  return response.data;
};
