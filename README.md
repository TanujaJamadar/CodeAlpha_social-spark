# Pulse — MERN Social Platform
Vanilla MERN stack (MongoDB + Express + Vanilla JS + Node) social platform with auth, profiles, follow system, posts, image upload, comments, infinite scroll, dark/light mode.
A full-stack social media app built with **MongoDB · Express · Vanilla JS · Node.js**, organized in classic **MVC** style.
Premium glassmorphism UI inspired by Instagram + LinkedIn, with dark/light mode.
> **Note**: This codebase is designed to be run **locally**. It is not deployed inside the Lovable preview.
## ✨ Features
## Folder structure
- 🔐 **Auth** — Register, login, logout, JWT, bcrypt password hashing, protected routes
- 👤 **Profiles** — Avatar upload, bio, followers/following, edit profile
- 🤝 **Follow system** — Follow / unfollow, suggested users, explore page
- 📝 **Posts** — Create, edit, delete, image upload, infinite-scroll feed
- 💬 **Comments** — Add and delete, real-time UI updates
- ❤️ **Likes & Saves** — Animated like button, save for later
- 🔔 **Notifications** — Follow, like, comment notifications with unread badge
- 🔍 **Search** — Find users & posts
- 🌗 **Dark / Light mode** — Persistent theme toggle
- 📱 **Fully responsive** — Mobile-first design with glassmorphism
## 🗂 Project Structure
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
├── backend/
│   ├── config/         # DB connection
│   ├── controllers/    # auth, user, post, comment, like, save, notification, search
│   ├── middleware/     # auth (JWT), upload (multer), errorHandler
│   ├── models/         # User, Post, Comment, Follow, Like, SavedPost, Notification
│   ├── routes/         # REST routes mounted under /api/*
│   ├── uploads/        # Uploaded images (served from /uploads)
│   ├── utils/          # generateToken
│   ├── seed.js         # Seed sample users + posts
│   ├── server.js       # Express entry
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
└── frontend/
    ├── css/styles.css
    ├── js/             # api, auth, ui, posts, feed, profile, notifications, search, saved
    ├── index.html      # Landing
    ├── login.html / register.html
    ├── dashboard.html  # Feed
    ├── profile.html / edit-profile.html / explore.html
    ├── create-post.html / post.html
    └── notifications.html / search.html / saved.html
```
## Prerequisites
## 🚀 Quick Start
- **Node.js** 18+
- **MongoDB** running locally (or a connection string to MongoDB Atlas)
### 1. Prerequisites
- Node.js 18+
- MongoDB running locally **or** a MongoDB Atlas connection string
## Setup
### 2. Backend setup
```bash
cd backend
cp .env.example .env       # then edit values
npm install
npm run seed               # optional: sample users + posts
npm run dev                # http://localhost:5000
```
### 1. Backend
### 3. Frontend setup
The frontend is plain HTML/CSS/JS. Serve `frontend/` with any static server:
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
cd frontend
# Option A: VS Code Live Server (right-click index.html → Open with Live Server)
# Option B:
npx serve . -l 5500
# Option C:
python3 -m http.server 5500
```
Then open:

- `http://localhost:5500/index.html`
- `http://localhost:5500/login.html`

Open `http://localhost:5500`.
> If you serve the frontend on a different port/origin, update `CLIENT_ORIGIN` in `backend/.env` to match (CORS), or set `window.__API_BASE__` at the top of each HTML page to override the API base URL.
> If you serve the frontend from a different host/port, set `CLIENT_ORIGIN` in `backend/.env` and add a `window.__API_BASE__ = "https://your-api"` script tag before `js/api.js`.
## REST API summary
### 4. Sample logins (after `npm run seed`)
| Email | Password |
|---|---|
| ada@pulse.dev | password123 |
| linus@pulse.dev | password123 |
| grace@pulse.dev | password123 |
| alan@pulse.dev | password123 |
| margaret@pulse.dev | password123 |
Auth (`/api/auth`)
- `POST /register` — `{ username, email, password }` → `{ token, user }`
- `POST /login` — `{ email, password }` → `{ token, user }`
- `GET /me` — current user (Bearer token)
- `POST /logout` — stateless ack
## 🔧 Environment variables (`backend/.env`)
Users (`/api/users`)
- `GET /suggested` — suggested users (auth)
- `GET /explore?q=` — search & list users
- `PUT /me` — multipart: `name`, `bio`, `avatar` file
- `GET /:username` — profile + isFollowing + isSelf
- `GET /:username/posts?page=` — user's posts (paginated)
- `POST /:username/follow` — follow (auth)
- `DELETE /:username/follow` — unfollow (auth)
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mern_social
JWT_SECRET=replace_this_with_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5500
SERVER_URL=http://localhost:5000
```
Posts (`/api/posts`)
- `GET /?page=&limit=` — feed (following + self if authed)
- `POST /` — multipart: `text`, `image` (auth)
- `GET /:id` — single post
- `PUT /:id` — edit own post (auth, multipart)
- `DELETE /:id` — delete own post (auth)
- `GET /:postId/comments` — comments for post
- `POST /:postId/comments` — add comment (auth)
## 📡 API overview
Comments (`/api/comments`)
- `DELETE /:id` — delete own comment OR comment on your post (auth)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login (returns JWT) |
| GET  | `/api/auth/me` | Current user |
| GET  | `/api/users/:username` | Public profile |
| PUT  | `/api/users/me` | Edit profile (multipart) |
| POST/DELETE | `/api/users/:username/follow` | Follow / unfollow |
| GET  | `/api/users/suggested` | Suggested users |
| GET  | `/api/users/explore?q=` | Explore / search users |
| GET  | `/api/posts?page=` | Feed (following + self, falls back to global) |
| POST | `/api/posts` | Create post (multipart) |
| GET/PUT/DELETE | `/api/posts/:id` | Read / edit / delete post |
| POST/DELETE | `/api/posts/:id/like` | Like / unlike |
| POST/DELETE | `/api/posts/:id/save` | Save / unsave |
| GET/POST | `/api/posts/:id/comments` | List / add comments |
| DELETE | `/api/comments/:id` | Delete a comment |
| GET  | `/api/notifications` | List notifications |
| GET  | `/api/notifications/unread-count` | Unread badge count |
| POST | `/api/notifications/read-all` | Mark all read |
| GET  | `/api/saved` | Saved posts |
| GET  | `/api/search?q=` | Search users + posts |
## Features
## 🌍 Deployment
- **Auth**: JWT, bcrypt hashing, protected routes, client-side guards
- **Profiles**: bio, avatar upload (multer), followers/following counts
- **Follow system**: dedicated `Follow` collection, atomic count increments, suggestions
- **Posts**: text + optional image, edit/delete by owner only, pagination, infinite scroll
- **Comments**: add, delete (by author or post owner)
- **Frontend**: responsive navbar with mobile menu, dark/light theme toggle (persisted), toast notifications, skeleton loaders, smooth animations
- **Security**: input validation (express-validator), file type/size limits, HTML escaping client-side
**Backend (Render / Railway / Fly / VPS):**
1. Provision MongoDB (Atlas free tier is fine).
2. Push the `backend/` folder, set env vars (`MONGO_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`, `SERVER_URL`).
3. Start command: `node server.js`. Persistent disk recommended for `uploads/` (or swap multer for S3/Cloudinary for production scale).
## Common pitfalls
**Frontend (Netlify / Vercel / GitHub Pages / Nginx):**
1. Deploy the `frontend/` directory as static files.
2. Before `js/api.js` in each HTML page, inject:
   ```html
   <script>window.__API_BASE__ = 'https://your-api.example.com';</script>
   ```
3. Add your frontend origin to `CLIENT_ORIGIN` on the backend (comma-separate multiple).
- **CORS errors** → make sure `CLIENT_ORIGIN` in `.env` matches the origin the frontend runs on.
- **Avatar/post image won't load** → ensure the backend is reachable at `SERVER_URL` (image URLs are generated from this).
- **Mongo connection error** → check `MONGO_URI` and that MongoDB is running.
## 🧪 Manual test checklist
- [ ] Register → auto-login → land on Feed
- [ ] Create text post / image post
- [ ] Like / unlike (count updates, animation plays)
- [ ] Save / unsave, view in Saved
- [ ] Comment / delete own comment
- [ ] Follow / unfollow user from Explore
- [ ] Edit profile (name, bio, avatar)
- [ ] Notifications badge updates after follow/like/comment
- [ ] Search users + posts
- [ ] Toggle dark/light theme — persists on reload
- [ ] Resize to mobile — nav collapses, layouts stack
## License
## 📜 License
MIT — build something great.
MIT — for learning / portfolio use.
