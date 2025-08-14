// api.ts
import axios from 'axios';

const api = axios.create();

// Проверяем токен перед каждым запросом
api.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('access_token');
    const expiresAt = localStorage.getItem('token_expires_at');

    console.log("work")
    console.log(token);
    console.log(expiresAt);
    console.log(Date.now())
    if (token && expiresAt && Date.now() > parseInt(expiresAt)) {
        // Токен истек, обновляем заранее
        console.log("refresh_token");
        await refreshToken();
    }

    const currentToken = localStorage.getItem('access_token');
    if (currentToken) {
        config.headers.Authorization = `Bearer ${currentToken}`;
    }
    return config;
});

const refreshToken = async () => {
    const response = await axios.post('/auth/refresh', null, {
        withCredentials: true
    });
    localStorage.setItem('access_token', response.data.access_token);

    const currentTime = Date.now();
    const expiryTime = currentTime + 15 * 60 * 1000;
    localStorage.setItem("token_expires_at", expiryTime.toString());
};

export default api;
