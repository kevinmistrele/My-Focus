# MyFocus

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)

> Personal productivity app — Pomodoro, tasks, habits, goals, mood log, and notes in one place.

<!-- Add a screenshot or GIF here: ![MyFocus Preview](docs/images/preview.png) -->

## About

MyFocus is a fullstack productivity platform built as an npm monorepo with a React frontend and an Express + Prisma backend. It centralizes personal routine management with focus on productivity, mental health, and well-being.

## Features

- JWT authentication with email-based password recovery
- Pomodoro sessions with history
- Task list with filters and status
- Habit tracker with streaks
- Personal goals with full CRUD
- Sticky notes with pinning and color coding
- Mood log (MoodLog)
- Personalized user statistics
- Profile image upload

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React + TypeScript | UI framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Sonner | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| Express | HTTP server |
| Prisma ORM | Database access |
| PostgreSQL | Database |
| JWT | Authentication |
| Nodemailer | Email delivery |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL instance running locally or in the cloud

### Installation and Setup

```bash
git clone https://github.com/kevinmistrele/My-Focus.git
cd My-Focus
npm run setup
```

The `setup` script installs all dependencies, runs Prisma migrations, and generates the Prisma client.

### Environment Variables

#### `apps/backend/.env`

```env
DATABASE_URL="postgresql://user:password@localhost:5432/myfocus?schema=public"
JWT_SECRET="your_jwt_secret"
EMAIL_FROM="your@email.com"
EMAIL_PASS="your_app_password"
```

#### `apps/frontend/.env`

```env
VITE_API_URL=http://localhost:4000
```

### Running

```bash
npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:4000 |

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start frontend and backend concurrently |
| `npm run dev:front` | Start frontend only |
| `npm run dev:back` | Start backend only |
| `npm run build:all` | Build both apps |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:studio` | Open Prisma Studio |
| `npm run setup` | Full setup from scratch |

## Project Structure

```
myfocus/
├── apps/
│   ├── frontend/     # React + Vite
│   └── backend/      # Express + Prisma
├── package.json      # Root scripts and workspaces
└── README.md
```

## Author

Made by [Kevin Mistrele](https://github.com/kevinmistrele)
