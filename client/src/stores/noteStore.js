import { create } from 'zustand';
import api from '../services/api';

export const useNoteStore = create((set) => ({
    notes: [],
    isLoading: false,
    error: null,

    fetchNotes: async (taskId = null) => {
        set({ isLoading: true, error: null });
        try {
            const params = taskId ? `?taskId=${taskId}` : '';
            const { data } = await api.get(`/notes${params}`);
            set({ notes: data.notes, isLoading: false });
        } catch (error) {
            set({
                error: error.response?.data?.error || 'Failed to fetch notes',
                isLoading: false
            });
        }
    },

    createNote: async (content, taskId = null) => {
        try {
            const { data } = await api.post('/notes', { content, taskId });
            set(state => ({
                notes: [data.note, ...state.notes]
            }));
            return true;
        } catch (error) {
            set({ error: error.response?.data?.error || 'Failed to create note' });
            return false;
        }
    },

    updateNote: async (id, content) => {
        try {
            const { data } = await api.put(`/notes/${id}`, { content });
            set(state => ({
                notes: state.notes.map(n => n.id === id ? data.note : n)
            }));
            return true;
        } catch (error) {
            set({ error: error.response?.data?.error || 'Failed to update note' });
            return false;
        }
    },

    deleteNote: async (id) => {
        try {
            await api.delete(`/notes/${id}`);
            set(state => ({
                notes: state.notes.filter(n => n.id !== id)
            }));
            return true;
        } catch (error) {
            set({ error: error.response?.data?.error || 'Failed to delete note' });
            return false;
        }
    }
}));