# Pulse — MERN Social Platform

A full-stack social media app built with MongoDB, Express, Vanilla JavaScript, and Node.js. This repository contains the project source for a local development environment: a Node/Express backend with a static frontend built in vanilla HTML/CSS/JS.

## What is this project

Pulse is a small social network demo implementing:

- JWT auth with bcrypt password hashing
- User profiles, avatar upload, bio
- Follow/unfollow system and suggested users
- Posts with optional image upload
- Likes, saves (bookmarks), and comments
- Notifications for likes, comments, follows
- Simple search/explore
- Responsive UI with dark/light theme

The backend is in `mern-social/backend` and serves the API and (optionally) the frontend static files. The frontend lives in `mern-social/frontend` and can be served by the backend or by a separate static server.

## Quick start

Prerequisites:

- Node.js 18+
- MongoDB running locally OR a MongoDB Atlas connection string

### Important: `.env` setup

The `.env` file is **not** included in the repo (gitignored for security). When you clone, you must create it from `.env.example`:

```powershell
cd mern-social/backend
copy .env.example .env
```

Without `.env`, the backend will fail to start with an error like `Error: PORT is not defined`.

### Steps

1. Backend

```powershell
cd mern-social/backend
copy .env.example .env
npm install
npm run seed -- --reset   # optional: seed sample users + posts
npm run dev
```

2. Frontend (option A — served by backend)

Open:

- http://localhost:5000/login.html

3. Frontend (option B — serve separately)

```powershell
cd mern-social/frontend
npx http-server . -p 5500
```
Then open:

- http://localhost:5500/login.html

## Seeded accounts

After running `npm run seed` you can use the following accounts:

- ada@pulse.dev / password123
- linus@pulse.dev / password123
- grace@pulse.dev / password123
- alan@pulse.dev / password123
- margaret@pulse.dev / password123

## Environment variables (`mern-social/backend/.env`)

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mern_social
JWT_SECRET=replace_this_with_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5500,http://localhost:5000
SERVER_URL=http://localhost:5000
```

## Useful commands

- `npm run dev` — run backend with `nodemon` (restarts on changes)
- `npm run seed -- --reset` — reset DB and seed sample data
- `npx http-server . -p 5500` — serve frontend locally

## Troubleshooting

- **Backend won't start with error `PORT is not defined`:** You forgot to copy `.env.example` to `.env`. Run `copy .env.example .env` in `mern-social/backend/`.

- `EADDRINUSE` on port 5000: stop the process using the port and restart the backend. In PowerShell:

```powershell
Get-NetTCPConnection -LocalPort 5000 | Select-Object LocalAddress,LocalPort,State,OwningProcess
Stop-Process -Id <OwningProcess> -Force
```

- If you serve the frontend on a different origin, add it to `CLIENT_ORIGIN` in `.env`.

## Development notes

- API endpoints are mounted under `/api/*`.
- Uploaded images are saved to `backend/uploads` (gitignored) in dev.

## Contributing

This repo is a demo — feel free to open issues or PRs with improvements.

---

