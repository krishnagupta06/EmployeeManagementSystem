import axios from 'axios';

const AUTH_API = axios.create({
  baseURL: '/api/auth',
  headers: { 'Content-Type': 'application/json' },
  timeout: 5000,
});

export const loginUser = async (email, password) => {
  const response = await AUTH_API.post('/login', { email, password });
  return response.data;
};

export const registerUser = async (name, email, password) => {
  const response = await AUTH_API.post('/register', { name, email, password });
  return response.data;
};
