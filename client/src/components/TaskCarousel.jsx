import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '../stores/taskStore';

const FALLBACK_COLORS = [
    '142, 249, 252',
    '142, 252, 204',
    '142, 252, 157',
    '215, 252, 142',
    '252, 252, 142',
    '252, 208, 142',
    '252, 142, 142',
    '252, 142, 239',
    '204, 142, 252',
    '142, 202, 252',
];

const priorityColors = {
    LOW: '107, 114, 128',
    MEDIUM: '245, 158, 11',
    HIGH: '249, 115, 22',
    URGENT: '239, 68, 68',
};

const statusColors = {
    TODO: 'bg-gray-100 text-gray-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
};

export default function TaskCarousel({ tasks }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const { completeTask, deleteTask } = useTaskStore();

    const displayItems = useMemo(() => {
        const maxItems = 8;
        const realTasks = tasks.slice(0, maxItems).map((task, index) => ({
            kind: 'task',
            id: task.id,
            task,
            color: priorityColors[task.priority] || FALLBACK_COLORS[index % FALLBACK_COLORS.length],
        }));

        const placeholdersNeeded = Math.max(0, Math.min(6, maxItems - realTasks.length));
        const placeholders = Array.from({ length: placeholdersNeeded }).map((_, index) => ({
            kind: 'placeholder',
            id: `placeholder-${index}`,
            color: FALLBACK_COLORS[(realTasks.length + index) % FALLBACK_COLORS.length],
        }));

        return [...realTasks, ...placeholders];
    }, [tasks]);

    if (displayItems.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No tasks yet. Create your first task!</p>
            </div>
        );
    }

    return (
        <div
            className="relative w-full min-h-[520px] flex items-center justify-center"
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <AnimatePresence mode="wait">
                {!isExpanded ? (
                    <motion.div
                        key="carousel"
                        className="relative w-full h-[420px] flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div
                            className="task-ring"
                            style={{ '--quantity': displayItems.length }}
                        >
                            {displayItems.map((item, index) => (
                                <article
                                    key={item.id}
                                    className="task-ring-card"
                                    style={{
                                        '--index': index,
                                        '--color-card': item.color,
                                    }}
                                >
                                    <div className="task-ring-content">
                                        {item.kind === 'task' ? (
                                            <>
                                                <h3 className="text-base font-semibold text-white line-clamp-2">{item.task.title}</h3>
                                                {item.task.description && (
                                                    <p className="text-xs text-white/80 mt-2 line-clamp-3">{item.task.description}</p>
                                                )}
                                                <div className="mt-3 flex gap-2 flex-wrap">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${statusColors[item.task.status] || statusColors.TODO}`}>
                            {item.task.status.replace('_', ' ')}
                          </span>
                                                    <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-white/20 text-white">
                            {item.task.priority}
                          </span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="h-full flex items-center justify-center text-white/70 text-sm text-center px-3">
                                                Add more tasks to fill the carousel
                                            </div>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>

                        <p className="absolute -bottom-10 text-sm text-gray-500">✨ Hover to expand tasks</p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="grid"
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {displayItems.filter((item) => item.kind === 'task').map((item, index) => (
                            <motion.div
                                key={item.id}
                                className="relative rounded-2xl p-[2px] shadow-xl"
                                style={{ background: `linear-gradient(135deg, rgba(${item.color},1), rgba(${item.color},0.45))` }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <div className="bg-white rounded-2xl p-5 h-full">
                                    <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{item.task.title}</h3>
                                    {item.task.description && (
                                        <p className="text-sm text-gray-600 mt-2 line-clamp-3">{item.task.description}</p>
                                    )}

                                    <div className="flex flex-wrap gap-2 mt-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[item.task.status] || statusColors.TODO}`}>
                      {item.task.status.replace('_', ' ')}
                    </span>
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {item.task.priority}
                    </span>
                                    </div>

                                    <div className="flex gap-2 mt-4">
                                        {item.task.status !== 'COMPLETED' && (
                                            <button
                                                onClick={() => completeTask(item.task.id)}
                                                className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-medium"
                                            >
                                                ✓ Done
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteTask(item.task.id)}
                                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}