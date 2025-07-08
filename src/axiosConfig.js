import axios from "axios";

const api = axios.create({
  baseURL: "https://projeto-back-zsio.onrender.com",
  withCredentials: true, // mantém se usares cookies (mas não obrigatório com JWT no header)
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 403) {
      window.history.back();
    }
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
