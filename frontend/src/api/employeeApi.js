import axios from 'axios';
import {
  mockGetAllEmployees,
  mockGetEmployeeById,
  mockCreateEmployee,
  mockUpdateEmployee,
  mockDeleteEmployee,
  mockSearchEmployees,
} from './mockData';

// Determine whether backend is available
// In production (Vercel), always use mock data
// In dev, try backend first, fallback to mock
const isProd = import.meta.env.PROD;

const API = axios.create({
  baseURL: '/api/employees',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 3000,
});

// Try backend first, fall back to mock data
async function withFallback(apiCall, mockCall) {
  if (isProd) {
    return mockCall();
  }
  try {
    const response = await apiCall();
    return response.data;
  } catch {
    // Backend is not available, use mock data
    return mockCall();
  }
}

export const getAllEmployees = () =>
  withFallback(
    () => API.get('/'),
    () => mockGetAllEmployees()
  );

export const getEmployeeById = (id) =>
  withFallback(
    () => API.get(`/${id}`),
    () => mockGetEmployeeById(id)
  );

export const createEmployee = (data) =>
  withFallback(
    () => API.post('/', data),
    () => mockCreateEmployee(data)
  );

export const updateEmployee = (id, data) =>
  withFallback(
    () => API.put(`/${id}`, data),
    () => mockUpdateEmployee(id, data)
  );

export const deleteEmployee = (id) =>
  withFallback(
    () => API.delete(`/${id}`),
    () => mockDeleteEmployee(id)
  );

export const searchEmployees = (query) =>
  withFallback(
    () => API.get(`/search?query=${encodeURIComponent(query)}`),
    () => mockSearchEmployees(query)
  );

export default API;
