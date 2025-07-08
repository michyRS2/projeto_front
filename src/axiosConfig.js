// src/axiosConfig.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://projeto-back-zsio.onrender.com',
});

// Intercetar pedidos e injetar o token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default api;
