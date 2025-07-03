import { useState } from 'react';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../routes';
import { ApiRoutes } from '../routes/const/apiRoutes';
import { AppRoutes } from '../routes/const/appRoutes';

interface UseAuthenticatedRequestResult {
    sendRequest: <T>(config: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
    isLoading: boolean;
    error: Error | null;
}

export const useAuthenticatedRequest = (): UseAuthenticatedRequestResult => {
    const navigate = useNavigate();
    const { setAuth } = useAuth();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const refreshAccessToken = async (): Promise<string> => {
        try {
            const response = await axios.post(ApiRoutes.refreshToken(), {}, {
                withCredentials: true // для получения refresh token из куки
            });
            
            const { access_token } = response.data;
            localStorage.setItem('access_token', access_token);
            return access_token;
        } catch (error) {
            throw error;
        }
    };

    const sendRequest = async <T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        setIsLoading(true);
        setError(null);

        try {
            // Добавляем токен к запросу
            const accessToken = localStorage.getItem('access_token');
            const configWithAuth = {
                ...config,
                headers: {
                    ...config.headers,
                    Authorization: `Bearer ${accessToken}`
                }
            };

            try {
                // Пытаемся выполнить запрос
                const response = await axios(configWithAuth);
                return response;
            } catch (error) {
                const axiosError = error as AxiosError;
                
                // Если получили 401, пробуем обновить токен
                if (axiosError.response?.status === 401) {
                    try {
                        // Пробуем обновить токен
                        const newAccessToken = await refreshAccessToken();
                        
                        // Повторяем исходный запрос с новым токеном
                        const newConfigWithAuth = {
                            ...config,
                            headers: {
                                ...config.headers,
                                Authorization: `Bearer ${newAccessToken}`
                            }
                        };
                        
                        return await axios(newConfigWithAuth);
                    } catch (refreshError) {
                        // Если не удалось обновить токен, выходим из аккаунта
                        localStorage.removeItem('access_token');
                        setAuth(false);
                        navigate(AppRoutes.main());
                        throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
                    }
                }
                
                throw error;
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            setError(axiosError);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return { sendRequest, isLoading, error };
}; 