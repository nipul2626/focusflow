import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '../stores/taskStore';
import { useCategoryStore } from '../stores/categoryStore';
import api from '../services/api';

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

    const [aiSuggestions, setAiSuggestions] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAIAnalysis = async () => {
        if (!formData.title && !formData.description) {
            alert('Please enter a task title or description first');
            return;
        }

        setIsAnalyzing(true);
        try {
            const { data } = await api.post('/ai/analyze-task', {
                taskDescription: formData.description || formData.title
            });

            setAiSuggestions(data.analysis);

            // Auto-fill suggestions
            if (data.analysis.totalEstimate) {
                setFormData(prev => ({
                    ...prev,
                    estimatedMinutes: data.analysis.totalEstimate,
                    priority: data.analysis.priority || prev.priority
                }));
            }

        } catch (error) {
            console.error('AI analysis error:', error);
            alert('AI analysis failed. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

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
            setAiSuggestions(null);
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

                        <motion.div
                            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
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
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-gray-700">Description</label>
                                    <button
                                        type="button"
                                        onClick={handleAIAnalysis}
                                        disabled={isAnalyzing}
                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 text-sm"
                                    >
                                        {isAnalyzing ? '🤖 Analyzing...' : '🤖 AI Suggestions'}
                                    </button>
                                </div>
                                <textarea
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            {/* AI Suggestions */}
                            {aiSuggestions && (
                                <motion.div
                                    className="bg-purple-50 border border-purple-200 rounded-lg p-4"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                >
                                    <h3 className="font-semibold text-purple-800 mb-2">🤖 AI Analysis</h3>
                                    <p className="text-sm text-gray-700 mb-3">{aiSuggestions.reasoning}</p>

                                    {aiSuggestions.subtasks && aiSuggestions.subtasks.length > 0 && (
                                        <div className="mb-2">
                                            <p className="text-sm font-medium text-gray-700 mb-1">Suggested subtasks:</p>
                                            <ul className="text-sm text-gray-600 space-y-1">
                                                {aiSuggestions.subtasks.map((subtask, idx) => (
                                                    <li key={idx}>
                                                        • {subtask.title} ({subtask.estimatedMinutes}m)
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="flex gap-4 text-sm">
                    <span className="text-purple-700">
                      📊 Priority: <strong>{aiSuggestions.priority}</strong>
                    </span>
                                        <span className="text-purple-700">
                      ⏱️ Total: <strong>{aiSuggestions.totalEstimate}m</strong>
                    </span>
                                    </div>
                                </motion.div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
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
                                    <label className="block text-gray-700 mb-2">Estimated Time (min)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={formData.estimatedMinutes}
                                        onChange={(e) => setFormData({ ...formData, estimatedMinutes: e.target.value })}
                                    />
                                </div>
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
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}