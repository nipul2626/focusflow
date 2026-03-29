import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '../stores/taskStore';
import { useCategoryStore } from '../stores/categoryStore';
import api from '../services/api';
import GlowButton from './GlowButton';

export default function CreateTaskModal({ isOpen, onClose }) {
    const { createTask } = useTaskStore();
    const { categories } = useCategoryStore();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM',
        estimatedMinutes: '',
        categoryId: '',
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
                taskDescription: formData.description || formData.title,
            });
            setAiSuggestions(data.analysis);

            if (data.analysis.totalEstimate) {
                setFormData((prev) => ({
                    ...prev,
                    estimatedMinutes: data.analysis.totalEstimate,
                    priority: data.analysis.priority || prev.priority,
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
            estimatedMinutes: formData.estimatedMinutes ? parseInt(formData.estimatedMinutes, 10) : null,
            categoryId: formData.categoryId || null,
        });

        if (success) {
            setFormData({ title: '', description: '', priority: 'MEDIUM', estimatedMinutes: '', categoryId: '' });
            setAiSuggestions(null);
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-cyan-300/20 bg-slate-900/90 shadow-[0_30px_80px_rgba(64,33,110,0.35)] p-6 md:p-8"
                            initial={{ opacity: 0, y: 20, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.97 }}
                        >
                            <h2 className="text-3xl font-extrabold text-slate-100 mb-2">Create New Task</h2>
                            <p className="text-slate-300 mb-6">Beautiful, focused input flow matching the app style.</p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-slate-200 mb-2 font-semibold">Title *</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 border border-cyan-300/20 rounded-xl bg-slate-950/70 text-slate-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2 gap-2 flex-wrap">
                                        <label className="block text-slate-200 font-semibold">Description</label>
                                        <GlowButton
                                            type="button"
                                            variant="subtle"
                                            onClick={handleAIAnalysis}
                                            disabled={isAnalyzing}
                                            className="min-w-[160px]"
                                        >
                                            {isAnalyzing ? '🤖 Analyzing...' : '🤖 AI Suggestions'}
                                        </GlowButton>
                                    </div>
                                    <textarea
                                        rows={3}
                                        className="w-full px-4 py-3 border border-cyan-300/20 rounded-xl bg-slate-950/70 text-slate-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                {aiSuggestions && (
                                    <motion.div className="rounded-2xl border border-fuchsia-200 bg-gradient-to-br from-fuchsia-500/10 to-cyan-500/10 p-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                        <h3 className="font-bold text-fuchsia-200 mb-2">🤖 AI Analysis</h3>
                                        <p className="text-sm text-slate-200 mb-3">{aiSuggestions.reasoning}</p>
                                        <div className="flex flex-wrap gap-4 text-sm text-fuchsia-200">
                                            <span>📊 Priority: <strong>{aiSuggestions.priority}</strong></span>
                                            <span>⏱️ Total: <strong>{aiSuggestions.totalEstimate}m</strong></span>
                                        </div>
                                    </motion.div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-slate-200 mb-2 font-semibold">Priority</label>
                                        <select
                                            className="w-full px-4 py-3 border border-cyan-300/20 rounded-xl bg-slate-950/70 text-slate-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
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
                                        <label className="block text-slate-200 mb-2 font-semibold">Estimated Time (min)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="w-full px-4 py-3 border border-cyan-300/20 rounded-xl bg-slate-950/70 text-slate-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                                            value={formData.estimatedMinutes}
                                            onChange={(e) => setFormData({ ...formData, estimatedMinutes: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {categories.length > 0 && (
                                    <div>
                                        <label className="block text-slate-200 mb-2 font-semibold">Category</label>
                                        <select
                                            className="w-full px-4 py-3 border border-cyan-300/20 rounded-xl bg-slate-950/70 text-slate-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                                            value={formData.categoryId}
                                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                        >
                                            <option value="">No category</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="flex gap-3 mt-6">
                                    <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border border-white/10 bg-slate-900 text-slate-200 hover:bg-slate-800">Cancel</button>
                                    <GlowButton type="submit" className="flex-1">Create Task</GlowButton>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
