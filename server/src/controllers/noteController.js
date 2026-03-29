const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


exports.getNotes = async (req, res) => {
    try {
        const { taskId } = req.query;

        const where = { userId: req.userId };
        if (taskId) {
            where.taskId = taskId;
        }

        const notes = await prisma.note.findMany({
            where,
            include: {
                task: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ notes });

    } catch (error) {
        console.error('Get notes error:', error);
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
};


exports.createNote = async (req, res) => {
    try {
        const { content, taskId } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }

        const note = await prisma.note.create({
            data: {
                content,
                taskId: taskId || null,
                userId: req.userId
            },
            include: {
                task: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        });

        res.status(201).json({
            message: 'Note created',
            note
        });

    } catch (error) {
        console.error('Create note error:', error);
        res.status(500).json({ error: 'Failed to create note' });
    }
};


exports.updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        const existingNote = await prisma.note.findFirst({
            where: { id, userId: req.userId }
        });

        if (!existingNote) {
            return res.status(404).json({ error: 'Note not found' });
        }

        const note = await prisma.note.update({
            where: { id },
            data: { content }
        });

        res.json({
            message: 'Note updated',
            note
        });

    } catch (error) {
        console.error('Update note error:', error);
        res.status(500).json({ error: 'Failed to update note' });
    }
};


exports.deleteNote = async (req, res) => {
    try {
        const { id } = req.params;

        const note = await prisma.note.findFirst({
            where: { id, userId: req.userId }
        });

        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        await prisma.note.delete({ where: { id } });

        res.json({ message: 'Note deleted' });

    } catch (error) {
        console.error('Delete note error:', error);
        res.status(500).json({ error: 'Failed to delete note' });
    }
};