import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTimerStore } from '../stores/timerStore';
import { useTaskStore } from '../stores/taskStore';
import { useCategoryStore } from '../stores/categoryStore';

export default function Timer() {
    const {
        session,
        timeRemaining,
        isRunning,
        isPaused,
        startSession,
        pauseSession,
        resumeSession,
        completeSession,
        cancelSession,
        fetchCurrentSession,
    } = useTimerStore();

    const { tasks, fetchTasks } = useTaskStore();
    const { categories, fetchCategories } = useCategoryStore();

    const [timerMode, setTimerMode] = useState('manual');
    const [manualMinutes, setManualMinutes] = useState(25);
    const [selectedCategoryId, setSelectedCategoryId] = useState('all');
    const [selectedTaskId, setSelectedTaskId] = useState('');

    useEffect(() => {
        fetchCurrentSession();
        fetchTasks();
        fetchCategories();
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const filteredTasks = useMemo(() => {
        if (selectedCategoryId === 'all') return tasks;
        return tasks.filter((task) => task.categoryId === selectedCategoryId);
    }, [tasks, selectedCategoryId]);

    const selectedTask = useMemo(() => tasks.find((task) => task.id === selectedTaskId), [tasks, selectedTaskId]);

    const selectedDuration = useMemo(() => {
        if (timerMode === 'task' && selectedTask?.estimatedMinutes) return selectedTask.estimatedMinutes;
        return manualMinutes;
    }, [timerMode, selectedTask, manualMinutes]);

    const progress = session ? ((session.duration - timeRemaining) / session.duration) * 100 : 0;
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    const handleStart = async () => {
        const durationMinutes = Math.max(1, Number(selectedDuration) || 25);
        const durationSeconds = durationMinutes * 60;
        const taskId = timerMode === 'task' ? selectedTaskId || null : null;
        await startSession(taskId, durationSeconds);
    };

    return (
        <div className={`timer-shell ${isRunning ? 'timer-shell-active' : ''}`}>
            <div className="timer-controls-row mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="text-slate-200 font-semibold">Mode:</span>
                    <label className="cosmic-toggle scale-75 origin-left">
                        <input
                            className="toggle"
                            type="checkbox"
                            checked={timerMode === 'task'}
                            onChange={(e) => setTimerMode(e.target.checked ? 'task' : 'manual')}
                        />
                        <div className="slider">
                            <div className="cosmos" />
                            <div className="energy-line" />
                            <div className="energy-line" />
                            <div className="energy-line" />
                            <div className="toggle-orb">
                                <div className="inner-orb" />
                                <div className="ring" />
                            </div>
                            <div className="particles">
                                {['30deg', '60deg', '90deg', '120deg', '150deg', '180deg'].map((angle) => (
                                    <div key={angle} className="particle" style={{ '--angle': angle }} />
                                ))}
                            </div>
                        </div>
                    </label>
                    <span className="text-sm text-slate-300">{timerMode === 'manual' ? 'Manual' : 'Task Linked'}</span>
                </div>

                <div className="text-sm text-cyan-200">Current Duration: <strong>{selectedDuration} min</strong></div>
            </div>

            {!isRunning && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="rounded-2xl border border-white/15 bg-slate-900/60 p-4">
                        <label className="block text-sm text-slate-300 mb-2">Manual Minutes</label>
                        <input
                            type="number"
                            min="1"
                            max="240"
                            disabled={timerMode !== 'manual'}
                            value={manualMinutes}
                            onChange={(e) => setManualMinutes(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl bg-slate-950/70 border border-cyan-300/30 text-white disabled:opacity-40"
                        />
                    </div>

                    <div className="rounded-2xl border border-white/15 bg-slate-900/60 p-4 space-y-3">
                        <label className="block text-sm text-slate-300">Task Category</label>
                        <select
                            disabled={timerMode !== 'task'}
                            value={selectedCategoryId}
                            onChange={(e) => setSelectedCategoryId(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl bg-slate-950/70 border border-fuchsia-300/30 text-white disabled:opacity-40"
                        >
                            <option value="all">All Categories</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.icon} {category.name}</option>
                            ))}
                        </select>

                        <select
                            disabled={timerMode !== 'task'}
                            value={selectedTaskId}
                            onChange={(e) => setSelectedTaskId(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl bg-slate-950/70 border border-cyan-300/30 text-white disabled:opacity-40"
                        >
                            <option value="">Select Task</option>
                            {filteredTasks.map((task) => (
                                <option key={task.id} value={task.id}>{task.title}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            <div className="flex flex-col items-center">
                <div className="relative">
                    <svg width="300" height="300" className="transform -rotate-90">
                        <circle cx="150" cy="150" r={radius} stroke="rgba(255,255,255,0.2)" strokeWidth="12" fill="none" />
                        <motion.circle
                            cx="150"
                            cy="150"
                            r={radius}
                            stroke={isRunning ? '#22d3ee' : '#a78bfa'}
                            strokeWidth="12"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 0.5 }}
                        />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-6xl font-bold text-white">{formatTime(timeRemaining)}</span>
                        <span className="text-sm text-slate-200 mt-2">
              {session?.type === 'FOCUS' ? 'Focus Time' : 'Ready'}
            </span>
                        {session && <span className="text-xs text-cyan-200 mt-1">Current {Math.max(0, session.duration - timeRemaining)} / {session.duration}s</span>}
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-8">
                    {!isRunning ? (
                        <motion.button onClick={handleStart} className="px-8 py-3 bg-white text-slate-900 rounded-full font-semibold text-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            ▶ Start {timerMode === 'task' ? 'Task' : 'Focus'}
                        </motion.button>
                    ) : (
                        <>
                            {isPaused ? (
                                <motion.button onClick={resumeSession} className="px-8 py-3 bg-emerald-500 text-white rounded-full font-semibold" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Resume</motion.button>
                            ) : (
                                <motion.button onClick={pauseSession} className="px-8 py-3 bg-amber-500 text-white rounded-full font-semibold" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Pause</motion.button>
                            )}

                            <motion.button onClick={completeSession} className="px-8 py-3 bg-green-600 text-white rounded-full font-semibold" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>✓ Complete</motion.button>
                            <motion.button onClick={cancelSession} className="px-8 py-3 bg-red-600 text-white rounded-full font-semibold" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>✕ Cancel</motion.button>
                        </>
                    )}
                </div>

                {session?.task && (
                    <div className="mt-6 text-center">
                        <p className="text-slate-300">Working on:</p>
                        <p className="text-lg font-semibold text-cyan-200">{session.task.title}</p>
                    </div>
                )}
            </div>
        </div>
    );
}