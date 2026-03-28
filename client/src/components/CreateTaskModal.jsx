import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '../stores/taskStore';
import { useCategoryStore } from '../stores/categoryStore';

export default function CreateTaskModal({ isOpen, onClose }) {
    const { createTask } = useTaskStore();
    const { categories } = useCategoryStore();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM',
        estimatedMinutes: '',
        categoryId: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await createTask({
            ...formData,
            estimatedMinutes: formData.estimatedMinutes ? parseInt(formData.estimatedMinutes) : null,
            categoryId: formData.categoryId || null
        });

        if (success) {
            setFormData({
                title: '',
                description: '',
                priority: 'MEDIUM',
                estimatedMinutes: '',
                categoryId: ''
            });
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md z-50"
                        initial={{ opacity: 0, scale: 0.9, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Task</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 mb-2">Title *</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Description</label>
                                <textarea
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Priority</label>
                                <select
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                    <option value="URGENT">Urgent</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Estimated Time (minutes)</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={formData.estimatedMinutes}
                                    onChange={(e) => setFormData({ ...formData, estimatedMinutes: e.target.value })}
                                />
                            </div>

                            {categories.length > 0 && (
                                <div>
                                    <label className="block text-gray-700 mb-2">Category</label>
                                    <select
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    >
                                        <option value="">No category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.icon} {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                                >
                                    Create Task
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}