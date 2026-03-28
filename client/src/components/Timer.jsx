import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTimerStore } from '../stores/timerStore';

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
        fetchCurrentSession
    } = useTimerStore();

    useEffect(() => {
        fetchCurrentSession();
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = session ? ((session.duration - timeRemaining) / session.duration) * 100 : 0;
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            {/* Circular Timer */}
            <div className="relative">
                <svg width="300" height="300" className="transform -rotate-90">
                    {/* Background circle */}
                    <circle
                        cx="150"
                        cy="150"
                        r={radius}
                        stroke="#e5e7eb"
                        strokeWidth="12"
                        fill="none"
                    />

                    {/* Progress circle */}
                    <motion.circle
                        cx="150"
                        cy="150"
                        r={radius}
                        stroke="#6366f1"
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

                {/* Time display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-bold text-gray-800">
            {formatTime(timeRemaining)}
          </span>
                    <span className="text-sm text-gray-500 mt-2">
            {session?.type === 'FOCUS' ? 'Focus Time' :
                session?.type === 'SHORT_BREAK' ? 'Short Break' :
                    session?.type === 'LONG_BREAK' ? 'Long Break' :
                        'Ready'}
          </span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4 mt-8">
                {!isRunning ? (
                    <motion.button
                        onClick={() => startSession(null, 1500)}
                        className="px-8 py-3 bg-indigo-600 text-white rounded-full font-semibold text-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Start Focus
                    </motion.button>
                ) : (
                    <>
                        {isPaused ? (
                            <motion.button
                                onClick={resumeSession}
                                className="px-8 py-3 bg-green-600 text-white rounded-full font-semibold"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Resume
                            </motion.button>
                        ) : (
                            <motion.button
                                onClick={pauseSession}
                                className="px-8 py-3 bg-yellow-600 text-white rounded-full font-semibold"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Pause
                            </motion.button>
                        )}

                        <motion.button
                            onClick={completeSession}
                            className="px-8 py-3 bg-green-600 text-white rounded-full font-semibold"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Complete
                        </motion.button>

                        <motion.button
                            onClick={cancelSession}
                            className="px-8 py-3 bg-red-600 text-white rounded-full font-semibold"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Cancel
                        </motion.button>
                    </>
                )}
            </div>

            {/* Session info */}
            {session?.task && (
                <div className="mt-6 text-center">
                    <p className="text-gray-600">Working on:</p>
                    <p className="text-lg font-semibold text-gray-800">{session.task.title}</p>
                </div>
            )}
        </div>
    );
}