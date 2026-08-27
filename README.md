# TwentyFour — Time = Money

A productivity app that turns your planned and focused hours into coins.

## Stack
- **Client:** React + Vite + TypeScript + Tailwind CSS → deployed on Vercel
- **Server:** Node + Express + TypeScript + Prisma → deployed on Render
- **Database/Auth:** Supabase (Postgres + Auth)

## Project structure
```
Twenty-Four/
  client/   # React app
  server/   # Express API
```

## Local setup

### 1. Database
1. Create a Supabase project.
2. Copy `server/.env.example` → `server/.env` and fill in `DATABASE_URL` / `DIRECT_URL` (Project dashboard → Connect button → ORMs tab → Prisma) and `SUPABASE_URL` + `SUPABASE_SECRET_KEY` (Settings → API Keys tab — new projects issue `sb_secret_...` keys, not the old `service_role`).
3. `cd server && npm install && npx prisma migrate dev --name init && npx prisma db seed`

### 2. Server
```
cd server
npm install
npm run dev
```
Runs on http://localhost:4000

### 3. Client
Copy `client/.env.example` → `client/.env` and fill in `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (Settings → API Keys — the `sb_publishable_...` key), and `VITE_API_URL=http://localhost:4000`.
```
cd client
npm install
npm run dev
```
Runs on http://localhost:5173

## Deploy
- **Client → Vercel:** import the repo, set root directory to `client`, add the same env vars as `client/.env`.
- **Server → Render:** new Web Service, root directory `server`, build command `npm install && npx prisma generate && npm run build`, start command `npm start`, add the same env vars as `server/.env`.
