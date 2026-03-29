import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '../stores/taskStore';
import { useTimerStore } from '../stores/timerStore';

const FALLBACK_COLORS = [
    '142, 249, 252', '142, 252, 204', '142, 252, 157', '215, 252, 142',
    '252, 252, 142', '252, 208, 142', '252, 142, 142', '252, 142, 239',
    '204, 142, 252', '142, 202, 252',
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

function getRingRadius(count, cardWidth = 180) {
    if (count <= 1) return 0;
    const raw = (cardWidth / 2) / Math.tan(Math.PI / count);
    return Math.max(280, Math.round(raw + 30));
}

export default function TaskCarousel({ tasks }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const { completeTask, deleteTask } = useTaskStore();
    const { startSession } = useTimerStore();

    const displayItems = useMemo(() => {
        const maxItems = 10;
        const realTasks = tasks.slice(0, maxItems).map((task, index) => ({
            kind: 'task',
            id: task.id,
            task,
            color: priorityColors[task.priority] || FALLBACK_COLORS[index % FALLBACK_COLORS.length],
        }));

        if (realTasks.length === 0) {
            const placeholders = Array.from({ length: 9 }).map((_, index) => ({
                kind: 'placeholder',
                id: `placeholder-${index}`,
                color: FALLBACK_COLORS[index % FALLBACK_COLORS.length],
            }));
            return [...placeholders, { kind: 'cta', id: 'cta-create', color: '129, 140, 248' }];
        }

        const minVisualCount = 8;
        const placeholdersNeeded = Math.max(0, Math.min(maxItems - realTasks.length, minVisualCount - realTasks.length));
        const placeholders = Array.from({ length: placeholdersNeeded }).map((_, index) => ({
            kind: 'placeholder',
            id: `placeholder-${index}`,
            color: FALLBACK_COLORS[(realTasks.length + index) % FALLBACK_COLORS.length],
        }));

        return [...realTasks, ...placeholders];
    }, [tasks]);

    const canExpand = tasks.length > 0;
    const ringRadius = getRingRadius(displayItems.length);

    return (
        <div
            className="relative w-full min-h-[520px]"
            onMouseEnter={() => canExpand && setIsExpanded(true)}
            onMouseLeave={() => canExpand && setIsExpanded(false)}
        >
            <div className="relative min-h-[480px] flex items-center justify-center overflow-hidden">
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ opacity: canExpand && isExpanded ? 0 : 1, scale: canExpand && isExpanded ? 0.92 : 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                    <div className="task-ring" style={{ '--quantity': displayItems.length, '--translateZ': `${ringRadius}px` }}>
                        {displayItems.map((item, index) => (
                            <article key={item.id} className="task-ring-card" style={{ '--index': index, '--color-card': item.color }}>
                                <div className="task-ring-content">
                                    {item.kind === 'task' && (
                                        <>
                                            <h3 className="text-base font-semibold text-white line-clamp-2">{item.task.title}</h3>
                                            {item.task.description && <p className="text-xs text-white/80 mt-2 line-clamp-3">{item.task.description}</p>}
                                        </>
                                    )}
                                    {item.kind === 'placeholder' && (
                                        <div className="h-full flex items-center justify-center text-white/70 text-sm text-center px-3">Your next task could be here</div>
                                    )}
                                    {item.kind === 'cta' && (
                                        <div className="h-full flex flex-col items-center justify-center text-white text-center px-3">
                                            <p className="font-semibold text-lg">Ready to focus?</p>
                                            <p className="text-sm mt-1 opacity-80">Create your first task</p>
                                        </div>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                </motion.div>

                <AnimatePresence>
                    {canExpand && isExpanded && (
                        <motion.div
                            key="expanded-grid"
                            className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {tasks.slice(0, 8).map((task, index) => {
                                const color = priorityColors[task.priority] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
                                return (
                                    <motion.div
                                        key={task.id}
                                        className="relative rounded-2xl p-[2px] shadow-xl"
                                        style={{ background: `linear-gradient(135deg, rgba(${color},1), rgba(${color},0.4))` }}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                    >
                                        <div className="bg-white/95 rounded-2xl p-5 h-full border border-white">
                                            <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{task.title}</h3>
                                            {task.description && <p className="text-sm text-gray-600 mt-2 line-clamp-3">{task.description}</p>}

                                            <div className="flex flex-wrap gap-2 mt-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status] || statusColors.TODO}`}>{task.status.replace('_', ' ')}</span>
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">{task.priority}</span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 mt-4">
                                                <button onClick={() => startSession(task.id, (task.estimatedMinutes || 25) * 60)} className="px-3 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition text-sm font-medium">▶ Start Timer</button>
                                                {task.status !== 'COMPLETED' ? (
                                                    <button onClick={() => completeTask(task.id)} className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-medium">✓ Done</button>
                                                ) : (
                                                    <button onClick={() => deleteTask(task.id)} className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium">🗑 Delete</button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {!isExpanded && canExpand && <p className="absolute left-1/2 -translate-x-1/2 -bottom-2 text-sm text-slate-300">✨ Hover to expand tasks</p>}
            {!canExpand && <p className="absolute left-1/2 -translate-x-1/2 -bottom-2 text-sm text-slate-300">✨ Create a task to unlock expanded view</p>}
        </div>
    );
}