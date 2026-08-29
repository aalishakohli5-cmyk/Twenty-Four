# TWENTY FOUR | Time = Money

**Every hour has value.**

A gamified productivity app where your day is represented as 24 hours. Plan tasks, focus deeply, earn virtual coins, and unlock themes and companions in The Vault.

## The problem

Traditional to-do lists show what is unfinished, but they rarely help users understand where their time went. For people who procrastinate or struggle with consistency, an endless list can quickly become discouraging.

## Our solution

**Plan → Focus → Earn → Unlock**

- Plan tasks inside a visible 24-hour day
- Start focused work sessions connected to real tasks
- Earn coins for focus time and task completion
- Track progress through a wallet and daily report
- Spend earned coins on unlockable themes and rewards

## Key features

- Cinematic, animated landing experience
- 24-hour timeline with coin rewards per hour
- Focus mode with draggable taskbar and Picture-in-Picture
- The Vault — themes, backgrounds, and companions
- Dark / light / system color modes
- Activity heatmap and insights
- Supabase sign-up and login
- Express + Prisma API for tasks, wallet, focus, and rewards

## Stack

| Layer | Tech |
| --- | --- |
| Frontend | React 19, Vite 8, TypeScript, Tailwind CSS v4, Framer Motion |
| Backend | Node.js, Express, TypeScript |
| Database | Supabase Postgres |
| Auth | Supabase Auth |
| ORM | Prisma |

## Project structure

```
client/          # Twenty Four frontend (Vite + React)
server/          # Express API + Prisma
```

## Quick start

### Frontend

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Backend (optional, for data sync)

```bash
cd server
npm install
cp .env.example .env   # DATABASE_URL, SUPABASE_URL, SUPABASE_SECRET_KEY
npx prisma migrate dev
npm run dev
```

## Environment variables

**Client** (`client/.env`):

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_API_URL=http://localhost:4000
```

**Server** (`server/.env`): see `server/.env.example`

Never commit real credentials. `.env` files are gitignored.

## Scripts

| Location | Command | Description |
| --- | --- | --- |
| `client/` | `npm run dev` | Start frontend dev server |
| `client/` | `npm run build` | Production build |
| `client/` | `npm run lint` | Run oxlint |
| `server/` | `npm run dev` | Start API server |
| `server/` | `npm run build` | Compile TypeScript |
| `server/` | `npm run grant-coins` | Grant trial coins by email |

## Deploy

- **Frontend:** Vercel / Netlify — root directory `client/`, build `npm run build`, output `dist/`
- **Backend:** Render / Railway — root directory `server/`

## License

MIT
