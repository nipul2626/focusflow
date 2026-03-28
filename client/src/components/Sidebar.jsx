import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCategoryStore } from '../stores/categoryStore';
import CategoryModal from './CategoryModal';

export default function Sidebar({ onCategorySelect, selectedCategory }) {
    const { categories, fetchCategories, deleteCategory } = useCategoryStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <>
            <div className="w-64 bg-white/10 backdrop-blur-md rounded-xl p-4 h-fit sticky top-24">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Categories</h3>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                        +
                    </button>
                </div>

                <div className="space-y-2">
                    <button
                        onClick={() => onCategorySelect(null)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition ${
                            !selectedCategory
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'hover:bg-gray-100'
                        }`}
                    >
                        📋 All Tasks
                    </button>

                    {categories.map(category => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="group relative"
                        >
                            <button
                                onClick={() => onCategorySelect(category.id)}
                                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                                    selectedCategory === category.id
                                        ? 'text-white'
                                        : 'hover:bg-gray-100'
                                }`}
                                style={{
                                    backgroundColor: selectedCategory === category.id ? category.color : 'transparent'
                                }}
                            >
                                <span className="mr-2">{category.icon}</span>
                                {category.name}
                            </button>

                            <button
                                onClick={() => deleteCategory(category.id)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition text-red-500 hover:text-red-700"
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