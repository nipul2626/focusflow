import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimerStore } from '../stores/timerStore';

export default function EnhancedTimer() {
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

    const [particles, setParticles] = useState([]);

    useEffect(() => {
        fetchCurrentSession();
    }, []);

    // Generate particles
    useEffect(() => {
        const newParticles = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 2,
            duration: Math.random() * 20 + 15
        }));
        setParticles(newParticles);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Gradient colors based on session type
    const getGradientColors = () => {
        if (!session) return 'from-indigo-400 via-purple-500 to-pink-500';

        switch (session.type) {
            case 'FOCUS':
                return 'from-purple-500 via-pink-500 to-red-400';
            case 'SHORT_BREAK':
                return 'from-blue-400 via-cyan-500 to-teal-400';
            case 'LONG_BREAK':
                return 'from-green-400 via-emerald-500 to-teal-500';
            default:
                return 'from-indigo-400 via-purple-500 to-pink-500';
        }
    };

    const getSessionLabel = () => {
        if (!session) return '🎯 Ready to Focus';
        switch (session.type) {
            case 'FOCUS':
                return session.task ? `📝 ${session.task.title}` : '🎯 Focus Time';
            case 'SHORT_BREAK':
                return '☕ Short Break';
            case 'LONG_BREAK':
                return '🌴 Long Break';
            default:
                return '⏱️ Session';
        }
    };

    const progress = session ? ((session.duration - timeRemaining) / session.duration) * 100 : 0;

    return (
        <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl">
            {/* Animated Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${getGradientColors()} animate-gradient-shift`}>
                {/* Wave Animation */}
                <svg
                    className="absolute bottom-0 w-full h-full opacity-20"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1440 320"
                    preserveAspectRatio="none"
                >
                    <motion.path
                        fill="rgba(255, 255, 255, 0.3)"
                        d="M0,160L48,165.3C96,171,192,181,288,165.3C384,149,480,107,576,112C672,117,768,171,864,181.3C960,192,1056,160,1152,138.7C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        animate={{
                            d: [
                                "M0,160L48,165.3C96,171,192,181,288,165.3C384,149,480,107,576,112C672,117,768,171,864,181.3C960,192,1056,160,1152,138.7C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                                "M0,192L48,197.3C96,203,192,213,288,197.3C384,181,480,139,576,144C672,149,768,203,864,213.3C960,224,1056,192,1152,170.7C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                                "M0,160L48,165.3C96,171,192,181,288,165.3C384,149,480,107,576,112C672,117,768,171,864,181.3C960,192,1056,160,1152,138.7C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                            ]
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.path
                        fill="rgba(255, 255, 255, 0.2)"
                        d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,229.3C672,235,768,213,864,197.3C960,181,1056,171,1152,181.3C1248,192,1344,224,1392,240L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        animate={{
                            d: [
                                "M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,229.3C672,235,768,213,864,197.3C960,181,1056,171,1152,181.3C1248,192,1344,224,1392,240L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                                "M0,256L48,245.3C96,235,192,213,288,218.7C384,224,480,256,576,261.3C672,267,768,245,864,229.3C960,213,1056,203,1152,213.3C1248,224,1344,256,1392,272L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                                "M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,229.3C672,235,768,213,864,197.3C960,181,1056,171,1152,181.3C1248,192,1344,224,1392,240L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                            ]
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </svg>

                {/* Floating Particles */}
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        className="absolute rounded-full bg-white/30"
                        style={{
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                            width: particle.size,
                            height: particle.size
                        }}
                        animate={{
                            y: [0, -100, 0],
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: particle.duration,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
                {/* Session Label */}
                <motion.div
                    className="mb-8 px-6 py-3 bg-white/20 backdrop-blur-md rounded-full"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <p className="text-white text-lg font-medium">{getSessionLabel()}</p>
                </motion.div>

                {/* Timer Display */}
                <div className="relative mb-12">
                    {/* Progress Ring */}
                    <svg width="300" height="300" className="transform -rotate-90">
                        {/* Background circle */}
                        <circle
                            cx="150"
                            cy="150"
                            r="135"
                            stroke="rgba(255, 255, 255, 0.2)"
                            strokeWidth="10"
                            fill="none"
                        />

                        {/* Progress circle */}
                        <motion.circle
                            cx="150"
                            cy="150"
                            r="135"
                            stroke="white"
                            strokeWidth="10"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 135}
                            strokeDashoffset={2 * Math.PI * 135 * (1 - progress / 100)}
                            initial={{ strokeDashoffset: 2 * Math.PI * 135 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 135 * (1 - progress / 100) }}
                            transition={{ duration: 1 }}
                        />
                    </svg>

                    {/* Time Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                            className="text-8xl font-bold text-white drop-shadow-lg"
                            key={timeRemaining}
                            initial={{ scale: 1.1, opacity: 0.8 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            {formatTime(timeRemaining)}
                        </motion.span>
                        {session && (
                            <motion.span
                                className="text-white/80 text-sm mt-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                Current: {formatTime(session.duration - timeRemaining)} / {formatTime(session.duration)}
                            </motion.span>
                        )}
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                    {!isRunning ? (
                        <motion.button
                            onClick={() => startSession(null, 1500)}
                            className="px-8 py-4 bg-white/90 hover:bg-white text-gray-800 rounded-full font-semibold text-lg shadow-xl backdrop-blur-sm flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="text-2xl">▶</span>
                            Start Focus
                        </motion.button>
                    ) : (
                        <>
                            {isPaused ? (
                                <motion.button
                                    onClick={resumeSession}
                                    className="px-6 py-3 bg-white/90 hover:bg-white text-gray-800 rounded-full font-semibold shadow-lg backdrop-blur-sm"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    ▶ Resume
                                </motion.button>
                            ) : (
                                <motion.button
                                    onClick={pauseSession}
                                    className="px-6 py-3 bg-white/90 hover:bg-white text-gray-800 rounded-full font-semibold shadow-lg backdrop-blur-sm"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    ⏸ Pause
                                </motion.button>
                            )}

                            <motion.button
                                onClick={completeSession}
                                className="px-6 py-3 bg-green-500/90 hover:bg-green-500 text-white rounded-full font-semibold shadow-lg backdrop-blur-sm"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                ✓ Complete
                            </motion.button>

                            <motion.button
                                onClick={cancelSession}
                                className="px-6 py-3 bg-red-500/90 hover:bg-red-500 text-white rounded-full font-semibold shadow-lg backdrop-blur-sm"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                ✕ Cancel
                            </motion.button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}