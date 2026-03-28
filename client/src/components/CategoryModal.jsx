import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCategoryStore } from '../stores/categoryStore';

const PRESET_COLORS = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308',
    '#84cc16', '#22c55e', '#10b981', '#14b8a6',
    '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
    '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'
];

const PRESET_ICONS = ['💼', '🏠', '🎯', '💡', '📚', '💪', '🎨', '🛒', '✈️', '❤️'];

export default function CategoryModal({ isOpen, onClose, category = null }) {
    const { createCategory, updateCategory } = useCategoryStore();

    const [formData, setFormData] = useState({
        name: category?.name || '',
        color: category?.color || '#6366f1',
        icon: category?.icon || '📁',
        description: category?.description || ''
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
                        className="fixed inset-0 bg-black/50 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    <motion.div
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md z-50"
                        initial={{ opacity: 0, scale: 0.9, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            {category ? 'Edit Category' : 'Create Category'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 mb-2">Name *</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Icon</label>
                                <div className="grid grid-cols-5 gap-2">
                                    {PRESET_ICONS.map(icon => (
                                        <button
                                            key={icon}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, icon })}
                                            className={`p-3 text-2xl rounded-lg border-2 transition ${
                                                formData.icon === icon
                                                    ? 'border-indigo-500 bg-indigo-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Color</label>
                                <div className="grid grid-cols-8 gap-2">
                                    {PRESET_COLORS.map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, color })}
                                            className={`w-10 h-10 rounded-lg border-2 transition ${
                                                formData.color === color
                                                    ? 'border-gray-800 scale-110'
                                                    : 'border-gray-200'
                                            }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Description</label>
                                <textarea
                                    rows={2}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

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
                                    {category ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}