# LinguaFlow AI

Modern English learning platform with personalized AI-powered conversations, gamified experience, and adaptive exercises.

## Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS, ShadCN UI, Framer Motion, Zustand, React Query
- **Backend:** NestJS, TypeScript, Prisma ORM, SQLite (PostgreSQL ready)
- **Auth:** JWT with refresh tokens (NestJS custom implementation)
- **AI-ready:** Architecture prepared for OpenAI, Whisper, ElevenLabs integration

## Features

| Feature | Description |
|---|---|
| **Auth** | Register, login, JWT with refresh token rotation |
| **Dashboard** | XP tracking, level progression, streaks, weekly activity chart |
| **Learning Modules** | Grammar, Vocabulary, Listening, Speaking, Writing |
| **Exercises** | Multiple choice, fill-in-the-blank, interactive feedback |
| **Flashcards** | Spaced repetition (SM-2 algorithm), difficulty-based reviews |
| **Chat** | Scenario-based conversations (Interview, Travel, Business, Tech) |
| **Gamification** | 10 achievements, XP rewards, level system (Beginner → Fluent) |
| **Ranking** | Weekly and all-time leaderboards |

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
# Install dependencies
npm install

# Set up database
cd apps/api
npx prisma db push
npx ts-node prisma/seed.ts
cd ../..

# Start development servers
cd apps/api && npm run dev    # API on :3001
cd apps/web && npm run dev    # Frontend on :3000
```

### Environment Variables

Copy `.env.example` to `apps/api/.env` and `apps/web/.env.local`:

```bash
cp .env.example apps/api/.env
```

## Project Structure

```
lng-flow/
├── apps/
│   ├── api/                    # NestJS backend
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Database schema
│   │   │   └── seed.ts         # Initial data
│   │   └── src/
│   │       ├── auth/           # Authentication module
│   │       ├── users/          # User profiles
│   │       ├── progress/       # XP, streaks, dashboard
│   │       ├── lessons/        # Learning exercises
│   │       ├── flashcards/     # Spaced repetition
│   │       ├── chat/           # Conversations
│   │       └── achievements/   # Gamification & ranking
│   └── web/                    # Next.js frontend
│       └── src/
│           ├── app/            # Pages (App Router)
│           ├── components/     # UI components
│           ├── stores/         # Zustand stores
│           └── lib/            # API client & utilities
├── packages/
│   └── shared/                 # Shared types & constants
└── docker-compose.yml          # PostgreSQL & Redis (optional)
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| POST | `/api/auth/refresh` | Refresh tokens |
| GET | `/api/auth/me` | Current user |

### Users
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users/profile` | User profile with achievements |
| PATCH | `/api/users/profile` | Update name, avatar, goals |
| GET | `/api/users/stats` | Learning statistics |

### Progress
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/progress/dashboard` | Dashboard data (XP, streak, chart) |
| POST | `/api/progress/xp` | Log XP transaction |

### Lessons
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/lessons/modules` | All modules with lessons |
| GET | `/api/lessons/module/:name` | Lessons by module |
| GET | `/api/lessons/:id` | Lesson with exercises |
| POST | `/api/lessons/:id/exercises/:exId/attempt` | Submit answer |
| POST | `/api/lessons/:id/complete` | Complete lesson |

### Flashcards
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/flashcards` | All flashcards |
| GET | `/api/flashcards/due` | Cards due for review |
| GET | `/api/flashcards/stats` | Flashcard statistics |
| POST | `/api/flashcards` | Create flashcard |
| POST | `/api/flashcards/:id/review` | Review card (SM-2) |

### Chat
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/chat/conversations` | User conversations |
| GET | `/api/chat/scenarios` | Available scenarios |
| GET | `/api/chat/conversations/:id` | Conversation messages |
| POST | `/api/chat/conversations` | Create conversation |
| POST | `/api/chat/conversations/:id/messages` | Add message |

### Achievements
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/achievements` | All achievements (unlocked status) |
| GET | `/api/achievements/ranking` | All-time ranking |
| GET | `/api/achievements/ranking/weekly` | Weekly ranking |

## Switching to PostgreSQL

1. Update `apps/api/prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Update `apps/api/.env`:
   ```
   DATABASE_URL="postgresql://user:pass@localhost:5432/linguaflow"
   ```
3. Start PostgreSQL: `docker compose up -d`
4. Run: `npx prisma db push`

## License

MIT
