import axios from "axios";

// Configurar a instância base do Axios
const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true, // Isso é crucial para enviar cookies
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 403) {
            window.history.back();
        }
        // Adicionar tratamento para erro 401
        if (error.response?.status === 401) {
            // Redirecionar para login ou atualizar token
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;