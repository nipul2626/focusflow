const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


exports.register = async (req, res) => {
    try {
        const { email, password, name } = req.body;


        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }


        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }


        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);


        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                profile: {
                    create: {}
                }
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true
            }
        });


        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(201).json({
            message: 'User registered successfully',
            user,
            token
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;


        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password' });
        }


        const user = await prisma.user.findUnique({
            where: { email },
            include: { profile: true }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }


        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }


        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );


        const { password: _, ...userWithoutPassword } = user;

        res.json({
            message: 'Login successful',
            user: userWithoutPassword,
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
};

exports.verify = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                profile: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });

    } catch (error) {
        console.error('Verify error:', error);
        res.status(500).json({ error: 'Server error during verification' });
    }
};

exports.logout = (req, res) => {
    res.json({ message: 'Logged out successfully' });
};