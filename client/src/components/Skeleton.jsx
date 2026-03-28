import { motion } from 'framer-motion';

export default function Skeleton({ className = '', variant = 'default' }) {
    const variants = {
        default: 'h-4 w-full',
        title: 'h-8 w-3/4',
        text: 'h-4 w-full',
        circle: 'h-12 w-12 rounded-full',
        card: 'h-48 w-full rounded-lg'
    };

    return (
        <div className={`${variants[variant]} ${className} bg-gray-200 rounded overflow-hidden relative`}>
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
                animate={{
                    x: ['-100%', '100%']
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'linear'
                }}
            />
        </div>
    );
}

export function TaskSkeleton() {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <Skeleton variant="title" />
            <Skeleton variant="text" />
            <Skeleton variant="text" className="w-2/3" />
            <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
            </div>
        </div>
    );
}