const { PrismaClient } = require('@prisma/client');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const prisma = new PrismaClient();

// Get profile
exports.getProfile = async (req, res) => {
    try {
        const profile = await prisma.profile.findUnique({
            where: { userId: req.userId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                }
            }
        });

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.json({ profile });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

// Update profile
exports.updateProfile = async (req, res) => {
    try {
        const { displayName, bio, accentColor, focusDuration, shortBreak, longBreak } = req.body;

        const profile = await prisma.profile.update({
            where: { userId: req.userId },
            data: {
                displayName,
                bio,
                accentColor,
                focusDuration: focusDuration ? parseInt(focusDuration) : undefined,
                shortBreak: shortBreak ? parseInt(shortBreak) : undefined,
                longBreak: longBreak ? parseInt(longBreak) : undefined
            }
        });

        res.json({
            message: 'Profile updated',
            profile
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

// Upload avatar
exports.uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: 'image',
            folder: 'focus-flow/avatars',
            transformation: [
                { width: 200, height: 200, crop: 'fill', gravity: 'face' },
                { quality: 'auto' }
            ]
        });

        // Delete temp file
        fs.unlinkSync(req.file.path);

        // Update profile
        const profile = await prisma.profile.update({
            where: { userId: req.userId },
            data: { avatarUrl: result.secure_url }
        });

        res.json({
            message: 'Avatar uploaded',
            avatarUrl: result.secure_url,
            profile
        });

    } catch (error) {
        console.error('Upload avatar error:', error);

        // Clean up temp file on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({ error: 'Failed to upload avatar' });
    }
};

// Delete avatar
exports.deleteAvatar = async (req, res) => {
    try {
        const profile = await prisma.profile.update({
            where: { userId: req.userId },
            data: { avatarUrl: null }
        });

        res.json({
            message: 'Avatar removed',
            profile
        });

    } catch (error) {
        console.error('Delete avatar error:', error);
        res.status(500).json({ error: 'Failed to delete avatar' });
    }
};