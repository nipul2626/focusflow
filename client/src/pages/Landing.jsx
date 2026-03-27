import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <div className="min-h-screen flex flex-col items-center justify-center px-4">
                <motion.h1
                    className="text-7xl font-bold text-white mb-6 text-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Focus Flow
                </motion.h1>

                <motion.p
                    className="text-2xl text-white/90 mb-12 text-center max-w-2xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    Smart Productivity with AI-Powered Task Management
                </motion.p>

                <motion.div
                    className="flex gap-4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <button
                        onClick={() => navigate('/login')}
                        className="px-8 py-4 bg-white text-indigo-600 rounded-full font-semibold text-lg hover:bg-gray-100 transition"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate('/signup')}
                        className="px-8 py-4 bg-indigo-600 text-white rounded-full font-semibold text-lg border-2 border-white hover:bg-indigo-700 transition"
                    >
                        Sign Up
                    </button>
                </motion.div>
            </div>
        </div>
    );
}