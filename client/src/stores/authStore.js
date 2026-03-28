import { create } from 'zustand';
import api from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';

export const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('token'),
    isLoading: false,
    error: null,

    register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.post('/auth/register', userData);
            localStorage.setItem('token', data.token);
            connectSocket(data.token);
            set({
                user: data.user,
                token: data.token,
                isLoading: false
            });
            return true;
        } catch (error) {
            set({
                error: error.response?.data?.error || 'Registration failed',
                isLoading: false
            });
            return false;
        }
    },

    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.post('/auth/login', credentials);
            localStorage.setItem('token', data.token);
            connectSocket(data.token);
            set({
                user: data.user,
                token: data.token,
                isLoading: false
            });
            return true;
        } catch (error) {
            set({
                error: error.response?.data?.error || 'Login failed',
                isLoading: false
            });
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        disconnectSocket();
        set({ user: null, token: null });
    },

    verifyToken: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const { data } = await api.get('/auth/verify');
            connectSocket(token);
            set({ user: data.user });
        } catch (error) {
            localStorage.removeItem('token');
            set({ user: null, token: null });
        }
    },

    clearError: () => set({ error: null })
}));