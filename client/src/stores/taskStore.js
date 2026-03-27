import { create } from 'zustand';
import api from '../services/api';

export const useTaskStore = create((set, get) => ({
    tasks: [],
    isLoading: false,
    error: null,

    fetchTasks: async (filters = {}) => {
        set({ isLoading: true, error: null });
        try {
            const params = new URLSearchParams(filters);
            const { data } = await api.get(`/tasks?${params}`);
            set({ tasks: data.tasks, isLoading: false });
        } catch (error) {
            set({
                error: error.response?.data?.error || 'Failed to fetch tasks',
                isLoading: false
            });
        }
    },

    createTask: async (taskData) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.post('/tasks', taskData);
            set(state => ({
                tasks: [data.task, ...state.tasks],
                isLoading: false
            }));
            return true;
        } catch (error) {
            set({
                error: error.response?.data?.error || 'Failed to create task',
                isLoading: false
            });
            return false;
        }
    },

    updateTask: async (id, taskData) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.put(`/tasks/${id}`, taskData);
            set(state => ({
                tasks: state.tasks.map(t => t.id === id ? data.task : t),
                isLoading: false
            }));
            return true;
        } catch (error) {
            set({
                error: error.response?.data?.error || 'Failed to update task',
                isLoading: false
            });
            return false;
        }
    },

    deleteTask: async (id) => {
        try {
            await api.delete(`/tasks/${id}`);
            set(state => ({
                tasks: state.tasks.filter(t => t.id !== id)
            }));
            return true;
        } catch (error) {
            set({ error: error.response?.data?.error || 'Failed to delete task' });
            return false;
        }
    },

    completeTask: async (id) => {
        try {
            const { data } = await api.patch(`/tasks/${id}/complete`);
            set(state => ({
                tasks: state.tasks.map(t => t.id === id ? data.task : t)
            }));
            return true;
        } catch (error) {
            set({ error: error.response?.data?.error || 'Failed to complete task' });
            return false;
        }
    }
}));