import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useTaskStore } from '../stores/taskStore';
import { useCategoryStore } from '../stores/categoryStore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Timer from '../components/Timer';
import TaskCard from '../components/TaskCard';
import CreateTaskModal from '../components/CreateTaskModal';
import Sidebar from '../components/Sidebar';
import { TaskSkeleton } from '../components/Skeleton';
import QuickNotes from '../components/QuickNotes';

export default function Dashboard() {
    const { user, logout } = useAuthStore();
    const { tasks, fetchTasks, isLoading } = useTaskStore();
    const navigate = useNavigate();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [filter, setFilter] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        const filters = {};
        if (selectedCategory) {
            filters.categoryId = selectedCategory;
        }
        fetchTasks(filters);
    }, [selectedCategory]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        if (filter === 'active') return task.status !== 'COMPLETED';
        if (filter === 'completed') return task.status === 'COMPLETED';
        return true;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-indigo-600">Focus Flow</h1>
                    <div className="flex items-center gap-4">

                        <button
                            onClick={() => navigate('/analytics')}
                            className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition"
                        >
                            📊 Analytics
                        </button>

                        <button
                            onClick={() => navigate('/profile')}
                            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
                        >
                            👤 Profile
                        </button>

                        <span className="text-gray-600">
        Welcome, {user?.name}!
    </span>

                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                            Logout
                        </button>

                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Timer Section */}
                <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8">
                    <Timer />
                </section>

                {/* Tasks Section with Sidebar */}
                <div className="flex gap-6">
                    {/* Sidebar */}
                    <Sidebar
                        selectedCategory={selectedCategory}
                        onCategorySelect={setSelectedCategory}
                    />

                    {/* Tasks */}
                    <section className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800">Your Tasks</h2>
                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={() => setFilter('all')}
                                        className={`px-4 py-2 rounded-lg transition ${
                                            filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'
                                        }`}
                                    >
                                        All
                                    </button>
                                    <button
                                        onClick={() => setFilter('active')}
                                        className={`px-4 py-2 rounded-lg transition ${
                                            filter === 'active' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'
                                        }`}
                                    >
                                        Active
                                    </button>
                                    <button
                                        onClick={() => setFilter('completed')}
                                        className={`px-4 py-2 rounded-lg transition ${
                                            filter === 'completed' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'
                                        }`}
                                    >
                                        Completed
                                    </button>
                                </div>
                            </div>

                            <motion.button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                + New Task
                            </motion.button>
                        </div>

                        {isLoading ? (
                            <div className="grid gap-4 md:grid-cols-2">
                                <TaskSkeleton />
                                <TaskSkeleton />
                                <TaskSkeleton />
                                <TaskSkeleton />
                            </div>
                        ) : filteredTasks.length === 0 ? (
                            <motion.div
                                className="bg-white/80 backdrop-blur-sm rounded-lg shadow p-12 text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <p className="text-gray-600 text-lg">
                                    {filter === 'all' ? 'No tasks yet. Create your first task!' :
                                        filter === 'active' ? 'No active tasks!' :
                                            'No completed tasks yet!'}
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                className="grid gap-4 md:grid-cols-2"
                                layout
                            >
                                <AnimatePresence>
                                    {filteredTasks.map((task) => (
                                        <TaskCard key={task.id} task={task} />
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </section>

                </div>
            </main>

            <CreateTaskModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
}