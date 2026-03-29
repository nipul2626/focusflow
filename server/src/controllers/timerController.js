const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


exports.startSession = async (req, res) => {
    try {
        const { taskId, duration, type } = req.body;


        const activeSession = await prisma.pomodoroSession.findFirst({
            where: {
                userId: req.userId,
                endTime: null,
                completed: false
            }
        });

        if (activeSession) {
            return res.status(400).json({
                error: 'You already have an active session. Complete it first.'
            });
        }


        const session = await prisma.pomodoroSession.create({
            data: {
                userId: req.userId,
                taskId: taskId || null,
                duration: duration || 1500,
                type: type || 'FOCUS'
            },
            include: {
                task: true
            }
        });

        res.status(201).json({
            message: 'Session started!',
            session
        });

    } catch (error) {
        console.error('Start session error:', error);
        res.status(500).json({ error: 'Failed to start session' });
    }
};


exports.getCurrentSession = async (req, res) => {
    try {
        const session = await prisma.pomodoroSession.findFirst({
            where: {
                userId: req.userId,
                endTime: null,
                completed: false
            },
            include: {
                task: true
            }
        });

        res.json({ session });

    } catch (error) {
        console.error('Get current session error:', error);
        res.status(500).json({ error: 'Failed to fetch session' });
    }
};


exports.completeSession = async (req, res) => {
    try {
        const { sessionId } = req.body;

        const session = await prisma.pomodoroSession.findFirst({
            where: {
                id: sessionId,
                userId: req.userId
            }
        });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }


        const updatedSession = await prisma.pomodoroSession.update({
            where: { id: sessionId },
            data: {
                endTime: new Date(),
                completed: true
            },
            include: {
                task: true
            }
        });


        if (session.taskId) {
            const task = await prisma.task.findUnique({
                where: { id: session.taskId }
            });

            const minutesSpent = Math.floor(session.duration / 60);

            await prisma.task.update({
                where: { id: session.taskId },
                data: {
                    actualMinutes: (task.actualMinutes || 0) + minutesSpent
                }
            });
        }

        res.json({
            message: 'Session completed!',
            session: updatedSession
        });

    } catch (error) {
        console.error('Complete session error:', error);
        res.status(500).json({ error: 'Failed to complete session' });
    }
};


exports.cancelSession = async (req, res) => {
    try {
        const { sessionId } = req.body;

        const session = await prisma.pomodoroSession.findFirst({
            where: {
                id: sessionId,
                userId: req.userId
            }
        });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        await prisma.pomodoroSession.delete({
            where: { id: sessionId }
        });

        res.json({ message: 'Session cancelled' });

    } catch (error) {
        console.error('Cancel session error:', error);
        res.status(500).json({ error: 'Failed to cancel session' });
    }
};


exports.getSessionStats = async (req, res) => {
    try {
        const { timeframe } = req.query;

        let startDate = new Date();
        if (timeframe === 'today') {
            startDate.setHours(0, 0, 0, 0);
        } else if (timeframe === 'week') {
            startDate.setDate(startDate.getDate() - 7);
        } else if (timeframe === 'month') {
            startDate.setDate(startDate.getDate() - 30);
        }

        const sessions = await prisma.pomodoroSession.findMany({
            where: {
                userId: req.userId,
                completed: true,
                createdAt: { gte: startDate }
            }
        });

        const totalSessions = sessions.length;
        const totalMinutes = sessions.reduce((sum, s) => sum + Math.floor(s.duration / 60), 0);
        const focusSessions = sessions.filter(s => s.type === 'FOCUS').length;

        res.json({
            totalSessions,
            totalMinutes,
            focusSessions,
            sessions
        });

    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};