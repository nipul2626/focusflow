# Focus Flow - Product Requirements Document

**Project:** Focus Flow  
**Version:** 1.0  
**Author:** Nipul Rathod (DW130)  
**Date:** March 2026

---

## Executive Summary

Focus Flow is a modern productivity application that combines the Pomodoro Technique with intelligent task management, real-time collaboration, and AI-powered assistance. Built with React, Node.js, and PostgreSQL, it features a stunning dark neon/glass UI with 10 signature animations.

**Target Users:** Students, remote workers, freelancers, teams

---

## Technical Architecture

### Frontend Stack
- React 18 + Vite
- TailwindCSS
- Framer Motion (animations)
- Zustand (state)
- Socket.io-client
- Chart.js

### Backend Stack
- Node.js + Express
- PostgreSQL + Prisma ORM
- Socket.io (WebSockets)
- JWT authentication
- Cloudinary (media)

### APIs
- Groq AI (Llama 3.1-8b-instant)
- Cloudinary

---

## Features

### 1. User Authentication
**Endpoints:**
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/verify`

**Tech:** JWT tokens, bcrypt hashing (12 rounds)

---

### 2. Task Management
**Endpoints:**
- GET `/api/tasks`
- POST `/api/tasks`
- PUT `/api/tasks/:id`
- DELETE `/api/tasks/:id`
- PATCH `/api/tasks/:id/complete`

**Features:** Categories, priorities, due dates, estimates

---

### 3. Pomodoro Timer
**Endpoints:**
- POST `/api/timer/start`
- POST `/api/timer/complete`
- GET `/api/timer/current`

**Features:** 25-min focus, custom durations, task linking

---

### 4. Analytics
**Endpoints:**
- GET `/api/analytics/overview`
- GET `/api/analytics/trends`

**Metrics:** Focus time, completion rates, trends

---

### 5. AI Suggestions
**Endpoint:** POST `/api/ai/analyze-task`

**API:** Groq (Llama 3.1)

**Output:** Subtasks, time estimates, priorities

---

### 6. Real-time Collaboration
**WebSocket Events:**
- `timer:started`
- `task:created`
- `task:updated`
- `presence:update`

---

## Database Schema

### User
- id, email, password, name
- Relations: tasks, categories, sessions, profile

### Task
- id, title, description, status, priority
- estimatedMinutes, dueDate, categoryId

### Category
- id, name, color, icon

### PomodoroSession
- id, startTime, endTime, duration, type
- userId, taskId

### Profile
- id, avatarUrl, accentColor
- focusDuration, shortBreak, longBreak

---

## UI/UX Design

### Design System
- **Theme:** Dark neon/glass
- **Colors:** Purple/pink gradients, neon accents
- **Animations:** Particles, waves, glassmorphism

### Key Components
1. Enhanced Timer (gradient + particles)
2. 3D Task Carousel
3. Analytics Charts
4. Profile with live preview

---

## Deployment

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** Neon PostgreSQL

---

## Security

- JWT authentication
- bcrypt password hashing
- CORS configuration
- Input validation
- SQL injection prevention (Prisma)

---

## Performance

- 60fps animations
- Lazy loading
- Optimized images (Cloudinary)
- Code splitting (Vite)

---

**End of Document**