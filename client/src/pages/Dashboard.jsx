import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useTaskStore } from '../stores/taskStore';
import { useCategoryStore } from '../stores/categoryStore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Timer from '../components/Timer';
import TaskCard from '../components/TaskCard';
import CreateTaskModal from '../components/CreateTaskModal';

export default function Dashboard() {
    const { user, logout } = useAuthStore();
    const { tasks, fetchTasks, isLoading } = useTaskStore();
    const { categories, fetchCategories } = useCategoryStore();
    const navigate = useNavigate();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchTasks();
        fetchCategories();
    }, []);

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
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-indigo-600">Focus Flow</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">Welcome, {user?.name}!</span>
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
                <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <Timer />
                </section>

                {/* Tasks Section */}
                <section>
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">Your Tasks</h2>
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`px-4 py-2 rounded-lg transition ${
                                        filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
                                    }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setFilter('active')}
                                    className={`px-4 py-2 rounded-lg transition ${
                                        filter === 'active' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
                                    }`}
                                >
                                    Active
                                </button>
                                <button
                                    onClick={() => setFilter('completed')}
                                    className={`px-4 py-2 rounded-lg transition ${
                                        filter === 'completed' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
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
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <motion.div
                            className="bg-white rounded-lg shadow p-12 text-center"
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
                            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
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
            </main>

            {/* Create Task Modal */}
            <CreateTaskModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
}