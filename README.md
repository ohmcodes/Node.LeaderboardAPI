# Leaderboard API

A simple leaderboard API built with Node.js, Express, and Prisma.

## Setup

1. Install dependencies: `npm install`
2. Set up the database: `npx prisma migrate dev --name init`
3. Start the server: `npm start` or `npm run dev` for development

## Endpoints

- `POST /score` - Submit or update a score
  - Body: `{ "id": "deviceUniqueIdentifier", "score": 123 }`

- `GET /score/:id` - Get score for a specific id

- `GET /top10` - Get top 10 scores

## Database

Uses SQLite for simplicity. Schema in `prisma/schema.prisma`.