# 🤝 SevaSync – Smart Volunteer Matching Platform

> AI-powered platform that intelligently connects NGOs with volunteers based on skills, availability, location, and preferences.

![Version](https://img.shields.io/badge/version-1.0.0-6C63FF)
![License](https://img.shields.io/badge/license-MIT-00D9A6)
![Node](https://img.shields.io/badge/node-20+-green)
![React](https://img.shields.io/badge/react-18+-61DAFB)

## ✨ Features

### Core
- 🔐 **Authentication** — Email, Google Sign-In, Role-based (Volunteer/NGO/Admin)
- 🤖 **AI Matching Engine** — Cosine similarity + Geo-distance + Availability overlap
- 📋 **Task Management** — Post, search, filter, apply, track
- 💬 **Real-time Chat** — WebSocket-powered messaging
- 📊 **Analytics Dashboard** — Hours, impact score, progress charts
- 🏆 **Gamification** — Points, badges, leaderboards
- 👤 **Rich Profiles** — Skills, interests, availability, location

### Advanced
- 🗺️ Map integration ready (Google Maps API)
- 🔔 Push notifications ready (Firebase Cloud Messaging)
- 🌙 Dark mode (default)
- 📱 Mobile-responsive PWA
- 🐳 Docker support
- ⚡ CI/CD pipeline (GitHub Actions)

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Vanilla CSS (custom design system) |
| Backend | Node.js + Express |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| Real-time | WebSockets + Firebase |
| AI/ML | Custom matching engine |
| Deployment | Docker + Nginx |

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm 9+
- Firebase project (optional for demo mode)

### 1. Clone & Install

```bash
git clone https://github.com/g-adarsh098/sevasync.git
cd sevasync

# Install client
cd client && npm install

# Install server
cd ../server && npm install
```

### 2. Configure Environment

```bash
# Client
cp client/.env.example client/.env
# Edit with your Firebase config

# Server
cp server/.env.example server/.env
# Edit with your config
```

### 3. Run Development

```bash
# Terminal 1 - Client
cd client && npm run dev

# Terminal 2 - Server
cd server && npm run dev
```

### 4. Open App
Visit `http://localhost:5173` and click **"Try Demo Mode"** to explore without Firebase.

## 📁 Project Structure

```
├── client/                  # React frontend
│   ├── src/
│   │   ├── ai/             # AI matching engine
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React Context (Auth)
│   │   ├── pages/          # Page components
│   │   ├── services/       # Firebase config
│   │   ├── utils/          # Demo data, helpers
│   │   ├── App.jsx         # Root component
│   │   ├── App.css         # Component styles
│   │   └── index.css       # Design system
│   └── package.json
├── server/                  # Express backend
│   ├── src/routes/         # API routes
│   │   ├── auth.js         # Authentication
│   │   ├── users.js        # User CRUD
│   │   ├── tasks.js        # Task management
│   │   ├── matching.js     # AI matching API
│   │   └── chat.js         # Chat API
│   └── server.js           # Entry point
├── docker-compose.yml
├── Dockerfile.client
├── Dockerfile.server
├── nginx.conf
└── .github/workflows/ci.yml
```

## 🤖 AI Matching Algorithm

The matching engine uses a **weighted composite score**:

| Factor | Weight | Method |
|--------|--------|--------|
| Skills | 40% | Cosine similarity on skill vectors |
| Location | 30% | Haversine distance (decay: 5-100km) |
| Availability | 20% | Day-of-week overlap ratio |
| Interests | 10% | Category alignment |

```
MatchScore = 0.4 × SkillSimilarity + 0.3 × LocationScore + 0.2 × AvailabilityOverlap + 0.1 × InterestMatch
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/users/:id` | Get user profile |
| PUT | `/api/users/:id` | Update profile |
| GET | `/api/tasks` | List tasks (with filters) |
| POST | `/api/tasks` | Create task |
| POST | `/api/tasks/:id/apply` | Apply to task |
| POST | `/api/matching/volunteer` | Get matches for volunteer |
| POST | `/api/matching/task` | Get matches for task |
| POST | `/api/chat/send` | Send message |
| GET | `/api/health` | Health check |

## 🐳 Docker Deployment

```bash
docker-compose up --build
```

## 📜 License

MIT License – see [LICENSE](LICENSE) for details.
