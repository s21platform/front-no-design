import axios from 'axios';

// Создаем экземпляр axios
const api = axios.create();

// Интерцептор запроса — добавляет токен в заголовки
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
