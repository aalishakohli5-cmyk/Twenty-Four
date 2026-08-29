<div align="center">

<img src="./client/public/logo.png" alt="TwentyFour Logo" width="140" style="border-radius: 24px;">

# TWENTY FOUR | Time = Money

**Every hour has value.**

<p>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white">
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">
  <img src="https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white">
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white">
</p>

</div>

A gamified productivity app where your day is represented as 24 hours. Plan tasks, focus deeply, earn virtual coins, and unlock themes and companions in The Vault.

## Plan → Focus → Earn → Unlock

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

### Backend

```bash
cd server
npm install
cp .env.example .env
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

## License

MIT
