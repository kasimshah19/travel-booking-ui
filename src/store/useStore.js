import { create } from "zustand";

import api from "../api/axios";

export const useAuthStore = create((set) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true, // App starts in loading state while checking session

    setAccessToken: (token) => set({ accessToken: token }),

    login: (userData, token) => set({
        user: userData,
        accessToken: token,
        isAuthenticated: true
    }),

    logout: async () => {
        try {
            await api.post('/auth/logout');
        } catch (e) {
            console.error("Logout failed on server, forcing local logout");
        }
        set({ user: null, accessToken: null, isAuthenticated: false });
    },

    checkAuth: async () => {
        try {
            // First attempt to refresh token via cookie
            const { data: refreshData } = await api.post('/auth/refresh');
            const token = refreshData.accessToken;

            // Set token so the next call uses it
            set({ accessToken: token });

            // Hydrate user data
            const { data: userData } = await api.get('/auth/me');
            set({ user: userData.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
            // No valid session
            set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
        }
    }
}));

export const useThemeStore = create((set) => ({
    isDarkMode: false,
    toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));
