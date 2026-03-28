import { create } from 'zustand';
import api from '../services/api';

export const useTimerStore = create((set, get) => ({
    session: null,
    timeRemaining: 0,
    isRunning: false,
    isPaused: false,
    intervalId: null,

    startSession: async (taskId = null, duration = 1500) => {
        try {
            const { data } = await api.post('/timer/start', {
                taskId,
                duration,
                type: 'FOCUS'
            });

            set({
                session: data.session,
                timeRemaining: duration,
                isRunning: true,
                isPaused: false
            });

            get().startCountdown();
            return true;
        } catch (error) {
            console.error('Start session error:', error);
            return false;
        }
    },

    startCountdown: () => {
        const intervalId = setInterval(() => {
            const { timeRemaining, isRunning, isPaused } = get();

            if (!isRunning || isPaused) {
                return;
            }

            if (timeRemaining <= 0) {
                get().completeSession();
                return;
            }

            set({ timeRemaining: timeRemaining - 1 });
        }, 1000);

        set({ intervalId });
    },

    pauseSession: () => {
        set({ isPaused: true });
    },

    resumeSession: () => {
        set({ isPaused: false });
    },

    completeSession: async () => {
        const { session, intervalId } = get();

        if (intervalId) {
            clearInterval(intervalId);
        }

        if (session) {
            try {
                await api.post('/timer/complete', { sessionId: session.id });
            } catch (error) {
                console.error('Complete session error:', error);
            }
        }

        set({
            session: null,
            timeRemaining: 0,
            isRunning: false,
            isPaused: false,
            intervalId: null
        });
    },

    cancelSession: async () => {
        const { session, intervalId } = get();

        if (intervalId) {
            clearInterval(intervalId);
        }

        if (session) {
            try {
                await api.post('/timer/cancel', { sessionId: session.id });
            } catch (error) {
                console.error('Cancel session error:', error);
            }
        }

        set({
            session: null,
            timeRemaining: 0,
            isRunning: false,
            isPaused: false,
            intervalId: null
        });
    },

    fetchCurrentSession: async () => {
        try {
            const { data } = await api.get('/timer/current');
            if (data.session) {
                const elapsed = Math.floor((new Date() - new Date(data.session.startTime)) / 1000);
                const remaining = Math.max(0, data.session.duration - elapsed);

                set({
                    session: data.session,
                    timeRemaining: remaining,
                    isRunning: remaining > 0,
                    isPaused: false
                });

                if (remaining > 0) {
                    get().startCountdown();
                }
            }
        } catch (error) {
            console.error('Fetch session error:', error);
        }
    }
}));