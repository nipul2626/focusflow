import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useTaskStore } from '../stores/taskStore';
import { useTimerStore } from '../stores/timerStore';
import Timer from '../components/Timer';
import TaskCarousel from '../components/TaskCarousel';
import CreateTaskModal from '../components/CreateTaskModal';
import Sidebar from '../components/Sidebar';
import QuickNotes from '../components/QuickNotes';
import GlowButton from '../components/GlowButton';

export default function Dashboard() {
    const { user, logout } = useAuthStore();
    const { tasks, fetchTasks, isLoading } = useTaskStore();
    const { isRunning: isTimerRunning } = useTimerStore();
    const navigate = useNavigate();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [filter, setFilter] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        const filters = {};
        if (selectedCategory) filters.categoryId = selectedCategory;
        fetchTasks(filters);
    }, [selectedCategory]);

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'all') return true;
        if (filter === 'active') return task.status !== 'COMPLETED';
        if (filter === 'completed') return task.status === 'COMPLETED';
        return true;
    });

    return (
        <div className={`dashboard-shell min-h-screen ${isTimerRunning ? 'timer-active' : ''}`}>
            <div className="dashboard-aurora" />
            <div className="dashboard-grid-overlay" />

            <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/45 backdrop-blur-xl">
                <div className="max-w-[1400px] mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-3 relative z-10">
                    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                        Focus Flow
                    </h1>

                    <div className="flex flex-wrap items-center gap-3">
                        <GlowButton onClick={() => navigate('/analytics')} className="min-w-[120px]">📊 Analytics</GlowButton>
                        <GlowButton variant="subtle" onClick={() => navigate('/profile')} className="min-w-[110px]">👤 Profile</GlowButton>
                        <span className="text-slate-200 font-medium px-2">Welcome, {user?.name}!</span>
                        <GlowButton variant="danger" onClick={() => { logout(); navigate('/'); }} className="min-w-[98px]">Logout</GlowButton>
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-4 py-8 relative z-10">
                <section className="rounded-3xl border border-cyan-300/25 bg-slate-900/55 backdrop-blur-xl shadow-[0_14px_38px_rgba(9,8,24,0.45)] p-8 mb-8 transition-all duration-500">
                    <Timer />
                </section>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                    <aside className="xl:col-span-2 xl:max-h-[640px]">
                        <Sidebar selectedCategory={selectedCategory} onCategorySelect={setSelectedCategory} />
                    </aside>

                    <section className="xl:col-span-7 rounded-3xl border border-violet-200/20 bg-slate-900/55 backdrop-blur-xl shadow-[0_18px_40px_rgba(8,8,24,0.5)] p-6 lg:p-8 min-h-[640px]">
                        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                            <div>
                                <h2 className="text-3xl font-extrabold text-slate-100">Your Tasks</h2>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {['all', 'active', 'completed'].map((value) => (
                                        <button
                                            key={value}
                                            onClick={() => setFilter(value)}
                                            className={`px-4 py-2 rounded-xl capitalize font-medium transition ${
                                                filter === value
                                                    ? 'bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-md'
                                                    : 'bg-white/10 text-slate-200 border border-white/15 hover:border-cyan-300/50'
                                            }`}
                                        >
                                            {value}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                                <GlowButton className="min-w-[150px]" onClick={() => setIsCreateModalOpen(true)}>+ New Task</GlowButton>
                            </motion.div>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400" />
                            </div>
                        ) : (
                            <TaskCarousel tasks={filteredTasks} />
                        )}
                    </section>

                    <aside className="xl:col-span-3 xl:max-h-[640px]">
                        <QuickNotes />
                    </aside>
                </div>
            </main>

            <CreateTaskModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
        </div>
    );
}
