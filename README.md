# ⚡ Reaction Speed Game

A modern, addictive browser game to test your reaction speed. Compete on a global leaderboard!

## Features

- **Reaction Speed Test** — Measure your reaction time in milliseconds
- **Global Leaderboard** — PostgreSQL-backed leaderboard with rankings
- **Personal Best Tracking** — Track your improvement over time
- **Score History** — View your last 5 scores
- **Confetti Animation** — Celebrate new personal records
- **Sound Effects** — Audio feedback generated with Web Audio API
- **Dark Neon UI** — Glassmorphism design with Framer Motion animations
- **Responsive** — Works on mobile, tablet, and desktop

## Tech Stack

| Layer     | Technology              |
|-----------|------------------------|
| Frontend  | React, Vite, TailwindCSS |
| Animation | Framer Motion          |
| Backend   | Vercel Serverless Functions |
| Database  | PostgreSQL             |
| Testing   | Vitest                 |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Install

```bash
git clone https://github.com/fayaz-ms/reaction-speed-game.git
cd reaction-speed-game
npm install
```

### Database Setup

Run the schema against your PostgreSQL database:

```bash
psql -d your_database -f db/schema.sql
```

### Environment Variables

Create a `.env` file:

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Tests

```bash
npm test
```

## Gameplay

1. Enter your nickname
2. Click the game area to start
3. Screen turns **RED** — wait for it...
4. Screen turns **GREEN** — click as fast as you can!
5. Your reaction time is recorded
6. Compete on the global leaderboard

**Edge cases handled:**
- Clicking before green shows "Too Early!"
- Restart anytime by clicking again

## Project Structure

```
reaction-speed-game/
├── src/
│   ├── components/     # Game, Leaderboard, ScoreHistory
│   ├── pages/          # Home page
│   ├── lib/            # Utilities and DB client
│   └── styles/         # Global CSS
├── api/                # Vercel serverless functions
├── db/                 # PostgreSQL schema
├── tests/              # Unit and UI tests
└── public/             # Static assets
```

## Auth

**Auth – Fayazahmad_Siddik**

## License

ISC
