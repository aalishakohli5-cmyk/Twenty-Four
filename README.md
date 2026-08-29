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
- **Firebase Auth** — Google + email sign-in with per-user localStorage sync

## Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4
- Framer Motion
- Firebase Authentication
- localStorage persistence

## Quick start

```bash
git clone <your-repo-url>
cd twentyfour
npm install
cp .env.example .env   # required for Firebase auth
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Firebase setup

Required for sign-in and app access.

1. Create a [Firebase project](https://console.firebase.google.com)
2. Enable **Authentication → Google** and **Email/Password**
3. Copy web config into `.env`:

```bash
cp .env.example .env
```

4. Add `localhost` under **Authentication → Authorized domains**
5. Restart the dev server

Without Firebase configured, the login page shows a setup notice and auth forms stay disabled. Firebase Authentication is required to access the app.

## Environment variables

Copy `.env.example` to `.env` and fill in your Firebase Web App config:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Create your own [Firebase project](https://console.firebase.google.com) — never commit real credentials. `.env` is gitignored; only `.env.example` belongs in the repo.

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
4. Add Firebase env vars in the dashboard (if using auth)

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

- Per-user data is stored in `localStorage` keyed by Firebase `user.uid`
- Do not commit `.env`, `node_modules/`, or `dist/`
- CI runs `npm run lint` and `npm run build` on push (see `.github/workflows/ci.yml`)

## License

MIT
