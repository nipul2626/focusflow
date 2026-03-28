import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTaskStore } from '../stores/taskStore';

export default function TaskCard({ task }) {
    const { completeTask, deleteTask } = useTaskStore();
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);

    const handleMouseMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        setRotateY(mouseX / 10);
        setRotateX(-mouseY / 10);
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
    };

    const priorityColors = {
        LOW: 'bg-gray-100 text-gray-800',
        MEDIUM: 'bg-yellow-100 text-yellow-800',
        HIGH: 'bg-orange-100 text-orange-800',
        URGENT: 'bg-red-100 text-red-800'
    };

    const statusColors = {
        TODO: 'bg-gray-100 text-gray-800',
        IN_PROGRESS: 'bg-blue-100 text-blue-800',
        COMPLETED: 'bg-green-100 text-green-800'
    };

    return (
        <motion.div
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, rotateX, rotateY }}
            exit={{ opacity: 0, x: -100 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transformStyle: 'preserve-3d',
                perspective: 1000
            }}
            transition={{
                rotateX: { duration: 0.2 },
                rotateY: { duration: 0.2 }
            }}
        >
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-800">
                    {task.title}
                </h3>
                {task.category && (
                    <span
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                            backgroundColor: task.category.color + '20',
                            color: task.category.color
                        }}
                    >
            {task.category.icon} {task.category.name}
          </span>
                )}
            </div>

            {task.description && (
                <p className="text-gray-600 mb-4 line-clamp-2">{task.description}</p>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
          {task.status.replace('_', ' ')}
        </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
                {task.estimatedMinutes && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            Est: {task.estimatedMinutes}m
          </span>
                )}
            </div>

            <div className="flex gap-2">
                {task.status !== 'COMPLETED' && (
                    <button
                        onClick={() => completeTask(task.id)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm"
                    >
                        ✓ Complete
                    </button>
                )}
                <button
                    onClick={() => deleteTask(task.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                >
                    Delete
                </button>
            </div>
        </motion.div>
    );
}