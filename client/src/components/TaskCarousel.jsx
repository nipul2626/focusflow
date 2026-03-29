import { useMemo, useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
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

export default function TaskCarousel({ tasks }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const { completeTask, deleteTask } = useTaskStore();
    const { startSession } = useTimerStore();

    const displayItems = useMemo(() => {
        const maxItems = 8;
        const realTasks = tasks.slice(0, maxItems).map((task, index) => ({
            kind: 'task',
            id: task.id,
            task,
            color: priorityColors[task.priority] || FALLBACK_COLORS[index % FALLBACK_COLORS.length],
        }));

        if (realTasks.length === 0) {
            const placeholders = Array.from({ length: 7 }).map((_, index) => ({
                kind: 'placeholder',
                id: `placeholder-${index}`,
                color: FALLBACK_COLORS[index % FALLBACK_COLORS.length],
            }));
            return [
                ...placeholders,
                { kind: 'cta', id: 'cta-create', color: '129, 140, 248' },
            ];
        }

        const placeholdersNeeded = Math.max(0, Math.min(4, maxItems - realTasks.length));
        const placeholders = Array.from({ length: placeholdersNeeded }).map((_, index) => ({
            kind: 'placeholder',
            id: `placeholder-${index}`,
            color: FALLBACK_COLORS[(realTasks.length + index) % FALLBACK_COLORS.length],
        }));

        return [...realTasks, ...placeholders];
    }, [tasks]);

    const canExpand = tasks.length > 0;

    return (
        <div className="relative w-full min-h-[520px]" onMouseEnter={() => canExpand && setIsExpanded(true)} onMouseLeave={() => canExpand && setIsExpanded(false)}>
            <LayoutGroup>
                <div className="relative min-h-[480px] flex items-center justify-center">
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{ opacity: canExpand && isExpanded ? 0.15 : 1, scale: canExpand && isExpanded ? 0.94 : 1, filter: canExpand && isExpanded ? 'blur(2px)' : 'blur(0px)' }}
                        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="task-ring" style={{ '--quantity': displayItems.length }}>
                            {displayItems.map((item, index) => (
                                <motion.article key={item.id} layoutId={`task-${item.id}`} className="task-ring-card" style={{ '--index': index, '--color-card': item.color }}>
                                    <div className="task-ring-content">
                                        {item.kind === 'task' && (
                                            <>
                                                <h3 className="text-base font-semibold text-white line-clamp-2">{item.task.title}</h3>
                                                {item.task.description && <p className="text-xs text-white/80 mt-2 line-clamp-3">{item.task.description}</p>}
                                            </>
                                        )}
                                        {item.kind === 'placeholder' && <div className="h-full flex items-center justify-center text-white/70 text-sm text-center px-3">Your next task could be here</div>}
                                        {item.kind === 'cta' && <div className="h-full flex flex-col items-center justify-center text-white text-center px-3"><p className="font-semibold text-lg">Ready to focus?</p><p className="text-sm mt-1 opacity-80">Create your first task</p></div>}
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    </motion.div>

                    <AnimatePresence>
                        {canExpand && isExpanded && (
                            <motion.div key="expanded-grid" className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }} transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}>
                                {displayItems.filter((item) => item.kind === 'task').map((item, index) => (
                                    <motion.div key={item.id} layoutId={`task-${item.id}`} className="relative rounded-2xl p-[2px] shadow-xl" style={{ background: `linear-gradient(135deg, rgba(${item.color},1), rgba(${item.color},0.4))` }} initial={{ opacity: 0, y: 14, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: index * 0.04, type: 'spring', stiffness: 180, damping: 18 }}>
                                        <div className="bg-white/95 rounded-2xl p-5 h-full border border-white">
                                            <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{item.task.title}</h3>
                                            {item.task.description && <p className="text-sm text-gray-600 mt-2 line-clamp-3">{item.task.description}</p>}

                                            <div className="flex flex-wrap gap-2 mt-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[item.task.status] || statusColors.TODO}`}>{item.task.status.replace('_', ' ')}</span>
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">{item.task.priority}</span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 mt-4">
                                                <button onClick={() => startSession(item.task.id, (item.task.estimatedMinutes || 25) * 60)} className="px-3 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition text-sm font-medium">▶ Start Timer</button>
                                                {item.task.status !== 'COMPLETED' ? (
                                                    <button onClick={() => completeTask(item.task.id)} className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-medium">✓ Done</button>
                                                ) : (
                                                    <button onClick={() => deleteTask(item.task.id)} className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium">🗑 Delete</button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </LayoutGroup>

            {!isExpanded && canExpand && <p className="absolute left-1/2 -translate-x-1/2 -bottom-2 text-sm text-slate-300">✨ Hover to expand tasks</p>}
            {!canExpand && <p className="absolute left-1/2 -translate-x-1/2 -bottom-2 text-sm text-slate-300">✨ Create a task to unlock expanded view</p>}
        </div>
    );
}