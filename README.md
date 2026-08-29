# TWENTY FOUR

**Every hour has value.**

A gamified productivity web app where your day is represented as 24 hours. Plan tasks, focus deeply, earn virtual coins, unlock themes and companions in The Vault.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)

## Features

- **24-hour timeline** — tap any open slot to plan; coin rewards per hour
- **Focus mode** — draggable focus bar, Picture-in-Picture pin (Chrome/Edge), immersive arc timer
- **The Vault** — themes + anime companions (free Shinchan included)
- **Companions** — small draggable avatars that track your cursor
- **Study atmosphere** — paper texture, notebook lines, floating study icons
- **Dark / Light / System** color modes
- **Activity heatmap** — GitHub-style focus tracking
- **Supabase Auth** — Google + email sign-in; tasks and wallet sync via Express + Prisma API

## Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4
- Framer Motion
- Supabase Authentication
- Express + Prisma API (`server/`)

## Quick start

```bash
git clone <your-repo-url>
cd twentyfour
npm install
cp .env.example .env   # required for Supabase auth
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

For full data sync, also run the API from `server/` (see `origin/main` for Prisma setup).

## Supabase setup

Required for sign-in and app access.

1. Create a [Supabase project](https://supabase.com)
2. Enable **Authentication → Google** and **Email**
3. Copy project URL and publishable key into `.env`:

```bash
cp .env.example .env
```

4. Add `http://localhost:5173` to redirect URLs
5. Restart the dev server

Without Supabase configured, the login page shows a setup notice and auth forms stay disabled.

## Environment variables

Copy `.env.example` to `.env`:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_API_URL=http://localhost:4000
```

Never commit real credentials. `.env` is gitignored; only `.env.example` belongs in the repo.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | Run oxlint |

## Deploy

### Vercel / Netlify / Cloudflare Pages

1. Connect your GitHub repo
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add Supabase env vars in the dashboard (if using auth)

### GitHub Pages

Set `base` in `vite.config.ts` to your repo name, then:

```bash
npm run build
# deploy dist/ to gh-pages branch
```

## Project structure

```
src/
├── components/   # UI, timeline, focus bar, avatars, store
├── context/      # App state, auth, motion
├── data/         # Demo data, store items, avatars
├── hooks/        # Focus timer, PiP, draggable panels
├── layouts/      # App shell
├── pages/        # Routes
└── utils/        # Time, persistence, heatmap
```

## Demo data

First launch loads demo tasks, 860 coins, and sample transactions. Reset via **Settings → Reset All Data**.

## Important notes

- Tasks and wallet sync via the Prisma API when `VITE_API_URL` is set; UI prefs (theme, onboarding) use harmless localStorage
- Do not commit `.env`, `node_modules/`, or `dist/`
- CI runs `npm run lint` and `npm run build` on push (see `.github/workflows/ci.yml`)

## License

MIT
