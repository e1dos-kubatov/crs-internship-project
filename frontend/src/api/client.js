import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';
const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');
const TOKEN_KEY = 'carRentalToken';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const unwrap = (response) => response.data?.data ?? response.data;

const formatError = (error) => {
  const message = error.response?.data?.message || error.message || 'Request failed';
  return new Error(message);
};

export const request = async (promise) => {
  try {
    return unwrap(await promise);
  } catch (error) {
    throw formatError(error);
  }
};

export const authApi = {
  login: (payload) => request(api.post('/auth/login', payload)),
  register: (payload) => request(api.post('/auth/register', payload)),
  me: () => request(api.get('/auth/me')),
  oauthStatus: () => request(api.get('/auth/oauth2/status')),
  oauthUrl: (provider) => `${BACKEND_BASE_URL}/oauth2/authorization/${provider}`,
};

export const carsApi = {
  list: () => request(api.get('/cars')),
  get: (id) => request(api.get(`/cars/${id}`)),
  adminList: () => request(api.get('/cars/admin/all')),
  mine: () => request(api.get('/cars/my')),
  create: (payload) => request(api.post('/cars', payload)),
  update: (id, payload) => request(api.put(`/cars/${id}`, payload)),
  remove: (id) => request(api.delete(`/cars/${id}`)),
  decide: (id, payload) => request(api.patch(`/cars/${id}/decision`, payload)),
};

export const rentalsApi = {
  create: (payload) => request(api.post('/rentals', payload)),
  mine: () => request(api.get('/rentals/my-rentals')),
  all: () => request(api.get('/rentals/history')),
  updateStatus: (id, status) => request(api.patch(`/rentals/${id}/status`, { status })),
};

export const paymentsApi = {
  createIntent: (payload) => request(api.post('/payments/intents', payload)),
  confirm: (id, payload) => request(api.post(`/payments/${id}/confirm`, payload)),
  mine: () => request(api.get('/payments/my')),
  byRental: (rentalId) => request(api.get(`/payments/rentals/${rentalId}`)),
  refund: (id, payload) => request(api.post(`/payments/${id}/refunds`, payload)),
};

export const ordersApi = {
  create: (payload) => request(api.post('/orders', payload)),
  mine: () => request(api.get('/orders/my')),
  all: () => request(api.get('/orders')),
  update: (id, payload) => request(api.put(`/orders/${id}`, payload)),
  decide: (id, payload) => request(api.patch(`/orders/${id}/decision`, payload)),
  remove: (id) => request(api.delete(`/orders/${id}`)),
};

export const adminApi = {
  users: () => request(api.get('/admin/users')),
  banUser: (id, payload) => request(api.patch(`/admin/users/${id}/ban`, payload)),
  unbanUser: (id) => request(api.patch(`/admin/users/${id}/unban`)),
  deleteUser: (id) => request(api.delete(`/admin/users/${id}`)),
  logs: () => request(api.get('/admin/logs')),
};
