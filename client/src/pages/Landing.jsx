import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Landing() {
    const navigate = useNavigate();

    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 120]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

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
        <div className="relative min-h-screen text-white pt-24 overflow-hidden">

            {/* 🌊 BACKGROUND */}
            <div className="absolute inset-0 -z-10 animated-gradient" />

            {/* FLOATING SHAPES */}
            <motion.div
                className="absolute top-20 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl"
                animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
            />
            <motion.div
                className="absolute bottom-20 right-10 w-32 h-32 bg-pink-500/20 rounded-full blur-xl"
                animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
                transition={{ duration: 8, repeat: Infinity }}
            />

            {/* 🧠 HERO */}
            <motion.section
                className="section flex flex-col items-center justify-center text-center gap-4"
                style={{ y, opacity }}
            >
                <motion.h1
                    className="text-5xl sm:text-6xl md:text-7xl font-bold"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Focus Flow
                </motion.h1>

                <p className="text-purple-300 h-6">
                    {displayText}
                </p>

                <p className="text-gray-300 max-w-xl">
                    A calm productivity app for students to manage tasks,
                    focus deeply, and build consistency.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <motion.button
                        onClick={() => navigate('/login')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 rounded-xl glass"
                    >
                        Login
                    </motion.button>

                    <motion.button
                        onClick={() => navigate('/signup')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500"
                    >
                        Sign Up
                    </motion.button>
                </div>
            </motion.section>

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
                                    <div className={`w-4 h-4 rounded-full border 
                                        ${task.done ? "bg-purple-500 border-purple-500" : "border-gray-400"}`} />

                                    <span className={`${task.done ? "line-through text-gray-400" : "text-white"}`}>
                                        {task.title}
                                    </span>
                                </div>

                                <span className="text-xs text-purple-300 opacity-0 group-hover:opacity-100 transition">
                                    focus
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* 📌 FEATURES */}
            <section id="features" className="section max-w-6xl mx-auto text-center">

                <motion.h2
                    className="text-3xl md:text-4xl font-semibold mb-12 text-white"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                >
                    Everything you need to stay focused
                </motion.h2>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">

                    {[
                        { icon: '⏱️', title: 'Pomodoro Timer', desc: '25-min focus sessions with smart breaks' },
                        { icon: '🤖', title: 'AI Suggestions', desc: 'Smart task breakdown and time estimates' },
                        { icon: '📊', title: 'Analytics', desc: 'Track your productivity over time' },
                        { icon: '🎯', title: 'Categories', desc: 'Organize tasks by projects' },
                        { icon: '🎵', title: 'Focus Music', desc: 'Control music during focus sessions' },
                        { icon: '⚡', title: 'Real-time Sync', desc: 'Instant updates across your workflow' }
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            className="glass p-6 rounded-2xl transition group relative overflow-hidden"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.08 }}
                            whileHover={{ y: -6 }}
                        >
                            {/* glow effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-purple-500/10 blur-xl" />

                            <div className="relative z-10">
                                <div className="text-3xl mb-3">{feature.icon}</div>

                                <h3 className="font-semibold text-lg mb-1">
                                    {feature.title}
                                </h3>

                                <p className="text-gray-400 text-sm">
                                    {feature.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ⚙️ HOW IT WORKS */}
            <section id="how" className="section max-w-5xl mx-auto text-center">
                <h2 className="text-3xl font-semibold mb-12">
                    How it Works
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { step: "01", title: "Add Tasks", desc: "Organize your work" },
                        { step: "02", title: "Stay Focused", desc: "Use Pomodoro" },
                        { step: "03", title: "Improve", desc: "Track progress" }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            className="glass p-6 rounded-xl"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                        >
                            <div className="text-purple-400 text-sm">{item.step}</div>
                            <h3 className="font-semibold">{item.title}</h3>
                            <p className="text-gray-400 text-sm">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-white/10 py-10 text-center text-gray-400 text-sm">
                <p>© {new Date().getFullYear()} Focus Flow</p>
                <p className="mt-2">Built for calm and focused productivity</p>
            </footer>
        </div>
    );
}