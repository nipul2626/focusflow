import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCategoryStore } from '../stores/categoryStore';
import CategoryModal from './CategoryModal';
import GlowButton from './GlowButton';

export default function Sidebar({ onCategorySelect, selectedCategory }) {
    const { categories, fetchCategories, deleteCategory } = useCategoryStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <>
            <div className="rounded-3xl border border-white/10 bg-slate-900/55 backdrop-blur-xl shadow-[0_12px_30px_rgba(8,8,24,0.55)] p-4 lg:p-5 xl:sticky xl:top-24 xl:h-[640px]">
                <div className="flex justify-between items-center gap-3 mb-4">
                    <h3 className="text-xl font-bold text-slate-100">Categories</h3>
                    <GlowButton className="w-11" onClick={() => setIsModalOpen(true)}>+</GlowButton>
                </div>

                <div className="space-y-2">
                    <button
                        onClick={() => onCategorySelect(null)}
                        className={`w-full text-left px-4 py-2.5 rounded-xl font-medium transition ${
                            !selectedCategory
                                ? 'bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow'
                                : 'bg-slate-900/40 text-slate-200 hover:bg-slate-900/70'
                        }`}
                    >
                        📋 All Tasks
                    </button>

                    {categories.map((category) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="group relative"
                        >
                            <button
                                onClick={() => onCategorySelect(category.id)}
                                className="w-full text-left px-4 py-2.5 rounded-xl transition border"
                                style={{
                                    borderColor: selectedCategory === category.id ? category.color : '#e5e7eb',
                                    backgroundColor: selectedCategory === category.id ? `${category.color}22` : 'rgba(15,23,42,0.55)',
                                    color: selectedCategory === category.id ? category.color : '#e2e8f0',
                                }}
                            >
                                <span className="mr-2">{category.icon}</span>
                                {category.name}
                            </button>

                            <button
                                onClick={() => deleteCategory(category.id)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition text-rose-500 hover:text-rose-700"
                                title="Delete category"
                            >
                                ×
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>

            <CategoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}
