import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Landing() {
    const navigate = useNavigate();

    // typing effect
    const text = "Focus smarter. Stay consistent.";
    const [displayText, setDisplayText] = useState("");

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setDisplayText(text.slice(0, i));
            i++;
            if (i > text.length) clearInterval(interval);
        }, 40);
        return () => clearInterval(interval);
    }, []);


    return (
        <div className="relative min-h-screen text-white pt-24">

            {/* 🧠 HERO */}
            <section className="section flex flex-col items-center justify-center text-center gap-4">
                <motion.h1
                    className="text-5xl md:text-7xl font-bold mb-4"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Focus Flow
                </motion.h1>

                <p className="text-purple-300 mb-6 h-6">
                    {displayText}
                </p>

                <p className="text-gray-400 max-w-xl mb-10">
                    A calm productivity app for students to manage tasks,
                    focus deeply, and build consistency.
                </p>

                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-3 rounded-xl glass hover:scale-105 transition"
                    >
                        Login
                    </button>

                    <button
                        onClick={() => navigate('/signup')}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 transition"
                    >
                        Sign Up
                    </button>
                </div>
            </section>

            {/* 💻 DASHBOARD PREVIEW */}
            <section className="section flex justify-center">
                <motion.div
                    className="glass rounded-2xl p-6 w-full max-w-3xl shadow-xl shadow-purple-500/10"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                >
                    <div className="flex justify-between items-center mb-4">
    <span className="text-white font-semibold text-lg">
        Today's Tasks
    </span>

                        <span className="text-sm text-purple-300 bg-purple-500/10 px-2 py-1 rounded-md">
        2/5 completed
    </span>
                    </div>

                    <div className="space-y-3">

                        {[
                            { title: "Study React Hooks", done: true },
                            { title: "Pomodoro Session", done: false },
                            { title: "Revise DBMS", done: false }
                        ].map((task, i) => (
                            <motion.div
                                key={i}
                                className="flex items-center justify-between glass p-3 rounded-lg hover:bg-white/20 transition group"
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className="flex items-center gap-3">

                                    {/* checkbox */}
                                    <div className={`w-4 h-4 rounded-full border 
                    ${task.done ? "bg-purple-500 border-purple-500" : "border-gray-400"}`} />

                                    <span className={`${task.done ? "line-through text-gray-400" : "text-white"}`}>
                    {task.title}
                </span>
                                </div>

                                {/* right side mini tag */}
                                <span className="text-xs text-purple-300 opacity-0 group-hover:opacity-100 transition">
                focus
            </span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* 📌 FEATURES */}
            <section id="features" className="section max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
                {[
                    "Smart Task Management",
                    "Pomodoro Timer",
                    "AI Productivity Insights"
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        className="glass p-6 rounded-xl hover:scale-105 transition"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                    >
                        {item}
                    </motion.div>
                ))}
            </section>

            {/* ⚙️ HOW IT WORKS */}
            <section id="how" className="section max-w-5xl mx-auto text-center">
                <h2 className="text-3xl font-semibold mb-12 text-white">
                    How it Works
                </h2>

                <div className="grid md:grid-cols-3 gap-6">

                    {[
                        {
                            step: "01",
                            title: "Add Tasks",
                            desc: "Quickly organize what you need to do"
                        },
                        {
                            step: "02",
                            title: "Stay Focused",
                            desc: "Use Pomodoro sessions to stay consistent"
                        },
                        {
                            step: "03",
                            title: "Improve",
                            desc: "Track progress and build discipline"
                        }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            className="glass p-6 rounded-xl relative overflow-hidden group"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                        >
                            {/* step number */}
                            <div className="text-purple-400 text-sm mb-2">
                                {item.step}
                            </div>

                            <h3 className="text-lg font-semibold mb-2 text-white">
                                {item.title}
                            </h3>

                            <p className="text-gray-400 text-sm">
                                {item.desc}
                            </p>

                            {/* hover glow */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-purple-500/10 blur-xl" />
                        </motion.div>
                    ))}
                </div>
            </section>

            <footer className="mt-20 border-t border-white/10 py-10 text-center text-gray-400 text-sm">
                <p>© {new Date().getFullYear()} Focus Flow</p>
                <p className="mt-2">Built for calm and focused productivity</p>
            </footer>
        </div>
    );
}