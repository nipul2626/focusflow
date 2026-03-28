const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get dashboard overview
exports.getOverview = async (req, res) => {
    try {
        const userId = req.userId;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Today's stats
        const todaySessions = await prisma.pomodoroSession.aggregate({
            where: {
                userId,
                completed: true,
                createdAt: { gte: today }
            },
            _sum: { duration: true },
            _count: true
        });

        const todayTasks = await prisma.task.count({
            where: {
                userId,
                status: 'COMPLETED',
                completedAt: { gte: today }
            }
        });

        // Weekly data (last 7 days)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        const weeklySessions = await prisma.pomodoroSession.findMany({
            where: {
                userId,
                completed: true,
                createdAt: { gte: weekAgo }
            },
            select: {
                duration: true,
                createdAt: true
            }
        });

        // Group by date
        const dailyData = {};
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateKey = date.toISOString().split('T')[0];
            dailyData[dateKey] = { date: dateKey, minutes: 0, sessions: 0 };
        }

        weeklySessions.forEach(session => {
            const dateKey = session.createdAt.toISOString().split('T')[0];
            if (dailyData[dateKey]) {
                dailyData[dateKey].minutes += Math.floor(session.duration / 60);
                dailyData[dateKey].sessions += 1;
            }
        });

        // Category breakdown
        const categoryStats = await prisma.task.groupBy({
            by: ['categoryId'],
            where: {
                userId,
                categoryId: { not: null }
            },
            _count: true,
            _sum: {
                actualMinutes: true
            }
        });

        const categoriesWithStats = await Promise.all(
            categoryStats.map(async (stat) => {
                const category = await prisma.category.findUnique({
                    where: { id: stat.categoryId }
                });
                return {
                    category,
                    taskCount: stat._count,
                    totalMinutes: stat._sum.actualMinutes || 0
                };
            })
        );

        // Total stats
        const totalSessions = await prisma.pomodoroSession.count({
            where: { userId, completed: true }
        });

        const totalMinutes = await prisma.pomodoroSession.aggregate({
            where: { userId, completed: true },
            _sum: { duration: true }
        });

        const totalTasks = await prisma.task.count({
            where: { userId, status: 'COMPLETED' }
        });

        res.json({
            today: {
                focusMinutes: Math.floor((todaySessions._sum.duration || 0) / 60),
                sessions: todaySessions._count,
                tasksCompleted: todayTasks
            },
            weeklyTrend: Object.values(dailyData),
            categoryBreakdown: categoriesWithStats,
            totals: {
                sessions: totalSessions,
                minutes: Math.floor((totalMinutes._sum.duration || 0) / 60),
                tasks: totalTasks
            }
        });

    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
};

// Get productivity trends
exports.getTrends = async (req, res) => {
    try {
        const { period } = req.query; // 'week', 'month', 'year'
        const userId = req.userId;

        let startDate = new Date();
        let groupBy = 'day';

        if (period === 'week') {
            startDate.setDate(startDate.getDate() - 7);
        } else if (period === 'month') {
            startDate.setDate(startDate.getDate() - 30);
        } else if (period === 'year') {
            startDate.setFullYear(startDate.getFullYear() - 1);
            groupBy = 'month';
        }

        const sessions = await prisma.pomodoroSession.findMany({
            where: {
                userId,
                completed: true,
                createdAt: { gte: startDate }
            },
            orderBy: { createdAt: 'asc' }
        });

        const tasks = await prisma.task.findMany({
            where: {
                userId,
                status: 'COMPLETED',
                completedAt: { gte: startDate }
            },
            orderBy: { completedAt: 'asc' }
        });

        res.json({
            sessions,
            tasks,
            period,
            groupBy
        });

    } catch (error) {
        console.error('Trends error:', error);
        res.status(500).json({ error: 'Failed to fetch trends' });
    }
};