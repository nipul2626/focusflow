import { create } from 'zustand';
import api from '../services/api';

export const useAnalyticsStore = create((set) => ({
    overview: null,
    trends: null,
    isLoading: false,
    error: null,

    fetchOverview: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.get('/analytics/overview');
            set({ overview: data, isLoading: false });
        } catch (error) {
            set({
                error: error.response?.data?.error || 'Failed to fetch analytics',
                isLoading: false
            });
        }
    },

    fetchTrends: async (period = 'week') => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.get(`/analytics/trends?period=${period}`);
            set({ trends: data, isLoading: false });
        } catch (error) {
            set({
                error: error.response?.data?.error || 'Failed to fetch trends',
                isLoading: false
            });
        }
    }
}));