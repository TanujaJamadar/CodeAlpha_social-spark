# Pulse — MERN Social Platform

Vanilla MERN stack (MongoDB + Express + Vanilla JS + Node) social platform with auth, profiles, follow system, posts, image upload, comments, infinite scroll, dark/light mode.

> **Note**: This codebase is designed to be run **locally**. It is not deployed inside the Lovable preview.

## Folder structure

```
mern-social/
├── backend/                 Express + MongoDB API (MVC)
│   ├── config/db.js         Mongo connection
│   ├── models/              User, Post, Comment, Follow
│   ├── controllers/         Auth, User, Post, Comment
│   ├── routes/              REST routes
│   ├── middleware/          JWT auth, multer upload, error handler
│   ├── utils/               JWT helper
│   ├── uploads/             Uploaded images (gitignored)
│   ├── server.js            App entry
│   ├── .env.example
│   └── package.json
└── frontend/                HTML + CSS + Vanilla JS
    ├── index.html           Landing
    ├── register.html        Sign up
    ├── login.html           Sign in
    ├── dashboard.html       Feed + composer + suggestions
    ├── profile.html         View own / other profile
    ├── edit-profile.html    Edit name / bio / avatar
    ├── explore.html         Discover & follow users
    ├── post.html            Single post + comments
    ├── create-post.html     Dedicated post composer
    ├── css/styles.css       Design system + dark/light theme
    └── js/                  api, ui, auth, posts, feed, profile
```

## Prerequisites

- **Node.js** 18+
- **MongoDB** running locally (or a connection string to MongoDB Atlas)

## Setup

### 1. Backend

```bash
cd mern-social/backend
cp .env.example .env       # then edit .env with your values
npm install
npm run dev                # nodemon on http://localhost:5000
# or: npm start
```

Edit `.env`:
- `MONGO_URI` — e.g. `mongodb://127.0.0.1:27017/mern_social` or your Atlas URI
- `JWT_SECRET` — long random string
- `CLIENT_ORIGIN` — origin your frontend will be served from (default `http://localhost:5500`)
- `SERVER_URL` — public URL of the API for image links (default `http://localhost:5000`)

The API will be at `http://localhost:5000/api`. Health check: `GET /api/health`.

### 2. Frontend

The frontend is plain static HTML/CSS/JS. Serve `frontend/` with any static server:

**Option A — VS Code Live Server** (recommended)
- Open `mern-social/frontend/` and click "Go Live". It runs on `http://localhost:5500`.

**Option B — npx http-server**
```bash
cd mern-social/frontend
npx http-server -p 5500
```

**Option C — Python**
```bash
cd mern-social/frontend
python3 -m http.server 5500
```

Then open `http://localhost:5500/index.html`.

> If you serve the frontend on a different port/origin, update `CLIENT_ORIGIN` in `backend/.env` to match (CORS), or set `window.__API_BASE__` at the top of each HTML page to override the API base URL.

## REST API summary

Auth (`/api/auth`)
- `POST /register` — `{ username, email, password }` → `{ token, user }`
- `POST /login` — `{ email, password }` → `{ token, user }`
- `GET /me` — current user (Bearer token)
- `POST /logout` — stateless ack

Users (`/api/users`)
- `GET /suggested` — suggested users (auth)
- `GET /explore?q=` — search & list users
- `PUT /me` — multipart: `name`, `bio`, `avatar` file
- `GET /:username` — profile + isFollowing + isSelf
- `GET /:username/posts?page=` — user's posts (paginated)
- `POST /:username/follow` — follow (auth)
- `DELETE /:username/follow` — unfollow (auth)

Posts (`/api/posts`)
- `GET /?page=&limit=` — feed (following + self if authed)
- `POST /` — multipart: `text`, `image` (auth)
- `GET /:id` — single post
- `PUT /:id` — edit own post (auth, multipart)
- `DELETE /:id` — delete own post (auth)
- `GET /:postId/comments` — comments for post
- `POST /:postId/comments` — add comment (auth)

Comments (`/api/comments`)
- `DELETE /:id` — delete own comment OR comment on your post (auth)

## Features

- **Auth**: JWT, bcrypt hashing, protected routes, client-side guards
- **Profiles**: bio, avatar upload (multer), followers/following counts
- **Follow system**: dedicated `Follow` collection, atomic count increments, suggestions
- **Posts**: text + optional image, edit/delete by owner only, pagination, infinite scroll
- **Comments**: add, delete (by author or post owner)
- **Frontend**: responsive navbar with mobile menu, dark/light theme toggle (persisted), toast notifications, skeleton loaders, smooth animations
- **Security**: input validation (express-validator), file type/size limits, HTML escaping client-side

## Common pitfalls

- **CORS errors** → make sure `CLIENT_ORIGIN` in `.env` matches the origin the frontend runs on.
- **Avatar/post image won't load** → ensure the backend is reachable at `SERVER_URL` (image URLs are generated from this).
- **Mongo connection error** → check `MONGO_URI` and that MongoDB is running.

## License

MIT — for learning / portfolio use.
