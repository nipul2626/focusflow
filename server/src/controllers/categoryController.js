const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            where: { userId: req.userId },
            orderBy: { order: 'asc' },
            include: {
                _count: {
                    select: { tasks: true }
                }
            }
        });

        res.json({ categories });

    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};

// Create category
exports.createCategory = async (req, res) => {
    try {
        const { name, color, icon, description } = req.body;

        if (!name || !color) {
            return res.status(400).json({ error: 'Name and color are required' });
        }

        const category = await prisma.category.create({
            data: {
                name,
                color,
                icon,
                description,
                userId: req.userId
            }
        });

        res.status(201).json({
            message: 'Category created successfully',
            category
        });

    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({ error: 'Failed to create category' });
    }
};

// Update category
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, color, icon, description } = req.body;

        const existingCategory = await prisma.category.findFirst({
            where: { id, userId: req.userId }
        });

        if (!existingCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const category = await prisma.category.update({
            where: { id },
            data: { name, color, icon, description }
        });

        res.json({
            message: 'Category updated successfully',
            category
        });

    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({ error: 'Failed to update category' });
    }
};

// Delete category
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await prisma.category.findFirst({
            where: { id, userId: req.userId }
        });

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Delete category (tasks will have categoryId set to null)
        await prisma.category.delete({
            where: { id }
        });

        res.json({ message: 'Category deleted successfully' });

    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
};