import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCategoryStore } from '../stores/categoryStore';
import GlowButton from './GlowButton';

const PRESET_COLORS = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308',
    '#84cc16', '#22c55e', '#10b981', '#14b8a6',
    '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
    '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
];

const PRESET_ICONS = ['💼', '🏠', '🎯', '💡', '📚', '💪', '🎨', '🛒', '✈️', '❤️'];

export default function CategoryModal({ isOpen, onClose, category = null }) {
    const { createCategory, updateCategory } = useCategoryStore();

    const [formData, setFormData] = useState({
        name: category?.name || '',
        color: category?.color || '#6366f1',
        icon: category?.icon || '📁',
        description: category?.description || '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = category
            ? await updateCategory(category.id, formData)
            : await createCategory(formData);

        if (success) {
            onClose();
            setFormData({ name: '', color: '#6366f1', icon: '📁', description: '' });
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
                            className="bg-white/90 border border-white rounded-3xl shadow-[0_30px_80px_rgba(64,33,110,0.35)] p-8 w-full max-w-md"
                            initial={{ opacity: 0, y: 20, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.97 }}
                        >
                            <h2 className="text-3xl font-extrabold text-slate-800 mb-6">
                                {category ? 'Edit Category' : 'Create Category'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-slate-700 mb-2 font-semibold">Name *</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-700 mb-2 font-semibold">Icon</label>
                                    <div className="grid grid-cols-5 gap-2">
                                        {PRESET_ICONS.map((icon) => (
                                            <button
                                                key={icon}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, icon })}
                                                className={`p-3 text-2xl rounded-xl border-2 transition ${
                                                    formData.icon === icon ? 'border-fuchsia-400 bg-fuchsia-50' : 'border-gray-200 bg-white hover:border-indigo-300'
                                                }`}
                                            >
                                                {icon}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-slate-700 mb-2 font-semibold">Color</label>
                                    <div className="grid grid-cols-8 gap-2">
                                        {PRESET_COLORS.map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, color })}
                                                className={`w-9 h-9 rounded-lg border-2 transition ${formData.color === color ? 'border-slate-700 scale-110' : 'border-transparent'}`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-slate-700 mb-2 font-semibold">Description</label>
                                    <textarea
                                        rows={2}
                                        className="w-full px-4 py-3 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-slate-700 hover:bg-slate-50">Cancel</button>
                                    <GlowButton type="submit" className="flex-1">{category ? 'Update' : 'Create'}</GlowButton>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}