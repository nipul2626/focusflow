import { create } from 'zustand';
import api from '../services/api';

export const useCategoryStore = create((set) => ({
    categories: [],
    isLoading: false,
    error: null,

    fetchCategories: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.get('/categories');
            set({ categories: data.categories, isLoading: false });
        } catch (error) {
            set({
                error: error.response?.data?.error || 'Failed to fetch categories',
                isLoading: false
            });
        }
    },

    createCategory: async (categoryData) => {
        try {
            const { data } = await api.post('/categories', categoryData);
            set(state => ({
                categories: [...state.categories, data.category]
            }));
            return true;
        } catch (error) {
            set({ error: error.response?.data?.error || 'Failed to create category' });
            return false;
        }
    },

    updateCategory: async (id, categoryData) => {
        try {
            const { data } = await api.put(`/categories/${id}`, categoryData);
            set(state => ({
                categories: state.categories.map(c => c.id === id ? data.category : c)
            }));
            return true;
        } catch (error) {
            set({ error: error.response?.data?.error || 'Failed to update category' });
            return false;
        }
    },

    deleteCategory: async (id) => {
        try {
            await api.delete(`/categories/${id}`);
            set(state => ({
                categories: state.categories.filter(c => c.id !== id)
            }));
            return true;
        } catch (error) {
            set({ error: error.response?.data?.error || 'Failed to delete category' });
            return false;
        }
    }
}));