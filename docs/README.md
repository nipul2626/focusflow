# 🎯 Focus Flow

> AI-powered Pomodoro productivity app with real-time collaboration and stunning animations

**Live Demo:** [https://focus-flow-nipul.vercel.app](https://focus-flow-nipul.vercel.app)

**Student:** Nipul Rathod  
**Roll Number:** DW130  
**Section:** DW-1  
**Subject:** Web Technology

---

## 📸 Screenshots

![Dashboard](./docs/screenshots/dashboard.png)
![Timer](./docs/screenshots/timer.png)
![Analytics](./docs/screenshots/analytics.png)

---

## ✨ Features

### Core Features (8)
1. ✅ **User Authentication** - JWT-based secure login/signup
2. ✅ **Task Management** - Full CRUD with categories, priorities, due dates
3. ✅ **Pomodoro Timer** - 25-min focus sessions with breaks, custom durations
4. ✅ **Analytics Dashboard** - Charts, trends, productivity insights
5. ✅ **Categories** - Color-coded task organization
6. ✅ **AI Task Suggestions** - Groq-powered task breakdown and time estimates
7. ✅ **Real-time Collaboration** - WebSocket-based live updates
8. ✅ **Profile Customization** - Avatar upload, accent colors, timer preferences

### Side Features (2)
9. ✅ **Quick Notes** - Scratchpad during focus sessions
10. ✅ **Task Carousel** - 3D rotating card stack with hover expansion

### UI/UX Highlights
- 🎨 Dark neon/glass design system
- ✨ 10 signature animations (particles, waves, glassmorphism, gradients)
- 🌈 Dynamic gradient backgrounds based on session type
- 📱 Fully responsive (desktop, tablet, mobile)
- ⚡ Smooth 60fps animations

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **TailwindCSS** - Utility-first styling
- **Framer Motion** - Advanced animations
- **Zustand** - State management
- **Socket.io-client** - Real-time updates
- **Chart.js** - Data visualization
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **Prisma** - ORM
- **Socket.io** - WebSocket server
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads

### APIs & Services
- **Groq AI** (Llama 3.1) - Task analysis
- **Cloudinary** - Image CDN
- **Neon** - Serverless PostgreSQL

### Deployment
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** Neon

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- Git

### Installation

**1. Clone the repository:**
```bash
git clone https://github.com/YOUR_USERNAME/focus-flow.git
cd focus-flow
```

**2. Backend Setup:**
```bash
cd server
npm install
```

**3. Configure Backend Environment:**

Create `server/.env` (copy from `.env.example`):
```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secure_random_string_min_32_chars
GROQ_API_KEY=your_groq_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
PORT=5000
```

**4. Run Database Migrations:**
```bash
npx prisma generate
npx prisma migrate dev
```

**5. Start Backend:**
```bash
npm run dev
```

Backend runs at: `http://localhost:5000`

---

**6. Frontend Setup:**

Open new terminal:
```bash
cd client
npm install
```

**7. Configure Frontend Environment:**

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000
```

**8. Start Frontend:**
```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔑 Getting API Keys

### Neon (Database)
1. Go to https://neon.tech
2. Sign up (free)
3. Create new project
4. Copy connection string

### Groq (AI)
1. Go to https://console.groq.com
2. Sign up (free)
3. Generate API key

### Cloudinary (Images)
1. Go to https://cloudinary.com
2. Sign up (free)
3. Dashboard → Account Details
4. Copy cloud name, API key, API secret

---

## 📁 Project Structure
```
focus-flow/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Route pages
│   │   ├── stores/        # Zustand stores
│   │   ├── services/      # API clients
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Backend Node.js API
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Express middleware
│   │   └── server.js      # Entry point
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   └── package.json
│
├── docs/                   # Documentation
├── README.md
└── PRD.md
```

---

## 🎨 Key Features Explained

### 1. Enhanced Timer
- Dynamic gradient backgrounds (purple/pink for focus, blue/green for breaks)
- Particle effects and wave animations
- Task-linked sessions
- Custom duration support
- Visual progress ring

### 2. 3D Task Carousel
- Cards rotate in 3D when idle
- Hover to expand into 3x2 grid
- Glassmorphism effects
- Smooth animations

### 3. AI-Powered Suggestions
- Groq AI analyzes task descriptions
- Suggests subtasks
- Estimates time required
- Recommends priorities

### 4. Real-time Collaboration
- Socket.io WebSocket connection
- Live task updates
- Presence indicators
- Synced timers

---

## 🧪 Testing

**Manual Testing:**
1. Sign up new account
2. Create 3-5 tasks
3. Start timer on a task
4. Complete session
5. Check analytics
6. Upload profile picture
7. Create categories
8. Test on mobile

---

## 🚀 Deployment

See detailed deployment steps in the project documentation.

**Production URLs:**
- Frontend: https://focus-flow-nipul.vercel.app
- Backend: https://focus-flow-api.onrender.com

---

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL=              # Neon PostgreSQL URL
JWT_SECRET=                # Random 32+ char string
GROQ_API_KEY=             # Groq AI key
CLOUDINARY_CLOUD_NAME=    # Cloudinary cloud name
CLOUDINARY_API_KEY=       # Cloudinary API key
CLOUDINARY_API_SECRET=    # Cloudinary secret
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

---

## 🤝 Contributing

This is an academic project. For issues or suggestions, please contact the author.

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👨‍💻 Author

**Nipul Rathod**  
Roll Number: DW130  
Section: DW-1  
Subject: Web Technology

GitHub: [@yourusername](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- **Groq** for free AI API
- **Cloudinary** for image hosting
- **Neon** for serverless PostgreSQL
- **Vercel** & **Render** for free deployment
- Open-source libraries used in this project

---

## 📊 Project Stats

- **Development Time:** 7 days
- **Lines of Code:** ~15,000+
- **Features:** 10 (8 core + 2 side)
- **Animations:** 10 signature effects
- **API Endpoints:** 30+
- **WebSocket Events:** 10+

---

**Built with ❤️ by Nipul Rathod**