import axios from "axios";

// Configurar a instância base do Axios
const api = axios.create({
    baseURL: "https://projeto-back-zsio.onrender.com",
    withCredentials: false,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if(token){
            config.headers.Authorization = 'Bearer ${token}';
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;