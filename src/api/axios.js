import axios from 'axios';
import { useAuthStore } from '../store/useStore';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
    withCredentials: true, // Send HTTP-Only cookies
});

// Attach access token to every request
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 Unauthorized (Token refresh logic)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Skip interceptor logic if the request is already trying to hit auth endpoints
        // to prevent infinite loops (like checkAuth failing and forcing a logout)
        if (originalRequest.url?.includes('/auth/')) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt silent refresh
                const { data } = await axios.post(
                    `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                // Save new token to Zustand
                useAuthStore.getState().setAccessToken(data.accessToken);

                // Update authorization header and retry original request
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed (token totally expired or invalid)
                useAuthStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
