const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all tasks for user
exports.getTasks = async (req, res) => {
    try {
        const { status, categoryId, search } = req.query;

        // Build filter
        const where = {
            userId: req.userId,
            isArchived: false
        };

        if (status) {
            where.status = status;
        }

        if (categoryId) {
            where.categoryId = categoryId;
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        const tasks = await prisma.task.findMany({
            where,
            include: {
                category: true
            },
            orderBy: [
                { order: 'asc' },
                { createdAt: 'desc' }
            ]
        });

        res.json({ tasks });

    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};

// Create task
exports.createTask = async (req, res) => {
    try {
        const { title, description, priority, estimatedMinutes, dueDate, categoryId } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                priority: priority || 'MEDIUM',
                estimatedMinutes,
                dueDate: dueDate ? new Date(dueDate) : null,
                categoryId,
                userId: req.userId
            },
            include: {
                category: true
            }
        });

        res.status(201).json({
            message: 'Task created successfully',
            task
        });

    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
};

// Get single task
exports.getTaskById = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await prisma.task.findFirst({
            where: {
                id,
                userId: req.userId
            },
            include: {
                category: true
            }
        });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ task });

    } catch (error) {
        console.error('Get task error:', error);
        res.status(500).json({ error: 'Failed to fetch task' });
    }
};

// Update task
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, priority, estimatedMinutes, dueDate, categoryId } = req.body;

        // Check task exists and belongs to user
        const existingTask = await prisma.task.findFirst({
            where: { id, userId: req.userId }
        });

        if (!existingTask) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const task = await prisma.task.update({
            where: { id },
            data: {
                title,
                description,
                status,
                priority,
                estimatedMinutes,
                dueDate: dueDate ? new Date(dueDate) : null,
                categoryId
            },
            include: {
                category: true
            }
        });

        res.json({
            message: 'Task updated successfully',
            task
        });

    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
};

// Delete task (soft delete - archive)
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await prisma.task.findFirst({
            where: { id, userId: req.userId }
        });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        await prisma.task.update({
            where: { id },
            data: { isArchived: true }
        });

        res.json({ message: 'Task archived successfully' });

    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
};

// Mark task complete
exports.completeTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await prisma.task.findFirst({
            where: { id, userId: req.userId }
        });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const updatedTask = await prisma.task.update({
            where: { id },
            data: {
                status: 'COMPLETED',
                completedAt: new Date()
            },
            include: {
                category: true
            }
        });

        res.json({
            message: 'Task completed!',
            task: updatedTask
        });

    } catch (error) {
        console.error('Complete task error:', error);
        res.status(500).json({ error: 'Failed to complete task' });
    }
};

// Restore archived task
exports.restoreTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await prisma.task.update({
            where: { id },
            data: { isArchived: false }
        });

        res.json({
            message: 'Task restored successfully',
            task
        });

    } catch (error) {
        console.error('Restore task error:', error);
        res.status(500).json({ error: 'Failed to restore task' });
    }
};