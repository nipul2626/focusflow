const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
});


app.use(cors());
app.use(express.json());


app.set('io', io);


app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Focus Flow API is running!',
        timestamp: new Date().toISOString()
    });
});


const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const categoryRoutes = require('./routes/category.routes');
const timerRoutes = require('./routes/timer.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const aiRoutes = require('./routes/ai.routes');
const noteRoutes = require('./routes/note.routes');
const profileRoutes = require('./routes/profile.routes');
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/timer', timerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/profile', profileRoutes);

io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error('Authentication error'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.userId;
        next();
    } catch (error) {
        next(new Error('Authentication error'));
    }
});


io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.userId}`);


    socket.join(`user:${socket.userId}`);


    socket.on('timer:start', (data) => {
        io.to(`user:${socket.userId}`).emit('timer:started', data);
    });

    socket.on('timer:pause', (data) => {
        io.to(`user:${socket.userId}`).emit('timer:paused', data);
    });

    socket.on('timer:complete', (data) => {
        io.to(`user:${socket.userId}`).emit('timer:completed', data);
    });


    socket.on('task:created', (task) => {
        io.to(`user:${socket.userId}`).emit('task:new', task);
    });

    socket.on('task:updated', (task) => {
        io.to(`user:${socket.userId}`).emit('task:changed', task);
    });

    socket.on('task:deleted', (taskId) => {
        io.to(`user:${socket.userId}`).emit('task:removed', taskId);
    });

    socket.on('disconnect', () => {
        console.log(`❌ User disconnected: ${socket.userId}`);
    });
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔌 WebSocket ready`);
});