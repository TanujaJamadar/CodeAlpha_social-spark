# Pulse — MERN Social Platform

A full-stack social media app built with **MongoDB · Express · Vanilla JS · Node.js**, organized in classic **MVC** style.
Premium glassmorphism UI inspired by Instagram + LinkedIn, with dark/light mode.

## ✨ Features

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

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+
- MongoDB running locally **or** a MongoDB Atlas connection string

### 2. Backend setup
```powershell
cd backend
copy .env.example .env
npm install
npm run seed -- --reset   # optional: seed sample users + posts
npm run dev
```

If `npm run dev` fails because port `5000` is already in use, stop the existing backend process first.

### 3. Frontend setup
You can run the frontend using the backend-hosted app or a separate static server.

#### Option A: Use backend-hosted frontend
Open this URL in your browser:

- `http://localhost:5000/login.html`

This is the simplest option because the backend serves the frontend and API together.

#### Option B: Serve frontend separately on port 5500
In a second terminal:

```powershell
cd frontend
npx http-server . -p 5500
```

Then open:

- `http://localhost:5500/login.html`

> Important: Do not open the page via `file://`. Always use `http://`.

### 4. Correct login credentials
Use one of these seeded accounts:

- `ada@pulse.dev` / `password123`
- `linus@pulse.dev` / `password123`
- `grace@pulse.dev` / `password123`
- `alan@pulse.dev` / `password123`
- `margaret@pulse.dev` / `password123`

Use one of these seeded accounts first for immediate testing. If you create a new account, use a valid email address like `tanuja@example.com` and a password with at least 6 characters.

If login is not successful, an error message will appear above the form explaining why (for example: invalid email, password required, or invalid credentials).

### 5. Notes
- If you use `http://localhost:5500`, make sure the backend is running on `http://localhost:5000`.
- Keep `CLIENT_ORIGIN=http://localhost:5500,http://localhost:5000` in `backend/.env`.
- If you want to force the frontend to use the backend API from a different URL, set `window.__API_BASE__` before `js/api.js`.

## 🔧 Environment variables (`backend/.env`)

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mern_social
JWT_SECRET=replace_this_with_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5500,http://localhost:5000
SERVER_URL=http://localhost:5000
```

## 📡 API overview

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

## 🌍 Deployment

**Backend (Render / Railway / Fly / VPS):**
1. Provision MongoDB (Atlas free tier is fine).
2. Push the `backend/` folder, set env vars (`MONGO_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`, `SERVER_URL`).
3. Start command: `node server.js`. Persistent disk recommended for `uploads/` (or swap multer for S3/Cloudinary for production scale).

**Frontend (Netlify / Vercel / GitHub Pages / Nginx):**
1. Deploy the `frontend/` directory as static files.
2. Before `js/api.js` in each HTML page, inject:
   ```html
   <script>window.__API_BASE__ = 'https://your-api.example.com';</script>
   ```
3. Add your frontend origin to `CLIENT_ORIGIN` on the backend (comma-separate multiple).

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

## 📜 License
MIT — build something great.
