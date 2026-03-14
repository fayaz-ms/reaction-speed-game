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
| Database  | Neon PostgreSQL (Cloud) |
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

**Option 1: Use Neon (Recommended)**

1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Run the migration:
   ```bash
   node migrate.js
   ```

**Option 2: Local PostgreSQL**

Run the schema against your PostgreSQL database:

```bash
psql -d your_database -f db/schema.sql
```

### Environment Variables

Create a `.env` file:

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

For Neon, use the connection string from your Neon dashboard.

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
├── migrate.js          # Database migration script
├── test-apis.js        # API testing script
└── public/             # Static assets
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/submitScore` | POST | Submit player reaction time |
| `/api/getLeaderboard` | GET | Get top players (limit=10) |

**Example Usage:**

```javascript
// Submit score
fetch('/api/submitScore', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'Player1', reaction_time_ms: 245 })
});

// Get leaderboard
fetch('/api/getLeaderboard?limit=10');
```

## Live Deployment

**🚀 Live Site:** https://reaction-speed-game-kohl.vercel.app

**📊 Database:** Neon PostgreSQL (ap-southeast-1)

**🔗 GitHub:** https://github.com/fayaz-ms/reaction-speed-game

## Testing

Run the test suite:
```bash
npm test
```

Test API endpoints:
```bash
node test-apis.js
```

## Auth

**Auth – Fayazahmad_Siddik**

## License

ISC
