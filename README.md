# CodeAlpha Social Spark - Pulse

Pulse is a full-stack social media web app built with Node.js, Express, MongoDB, and vanilla HTML/CSS/JavaScript. It includes authentication, user profiles, posts, likes, saves, comments, follows, notifications, search, and image uploads.

## Live Demo

- Frontend: https://codealpha-social-spark-frontend.onrender.com
- Backend API: https://codealpha-social-spark.onrender.com
- API health check: https://codealpha-social-spark.onrender.com/api/health

## Demo Login Credentials

Use these accounts after the database has been seeded:

| Email | Password |
| --- | --- |
| ada@pulse.dev | password123 |
| linus@pulse.dev | password123 |
| grace@pulse.dev | password123 |
| alan@pulse.dev | password123 |
| margaret@pulse.dev | password123 |

You can also create a new account from the register page.

## Features

- JWT-based user authentication
- Secure password hashing with bcrypt
- Register, login, logout, and current-user session handling
- User profiles with avatar upload and bio
- Follow and unfollow users
- Suggested users and explore page
- Create, edit, and delete posts
- Optional image upload for posts
- Like and unlike posts
- Save and unsave posts
- Comment system
- Notifications for follows, likes, and comments
- Search users and posts
- Responsive frontend with dark/light theme support

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | HTML, CSS, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB / MongoDB Atlas |
| Auth | JWT, bcryptjs |
| Uploads | Multer |
| Hosting | Render |

## Project Structure

```text
CodeAlpha_social-spark/
  README.md
  mern-social/
    package.json
    backend/
      server.js
      seed.js
      .env.example
      config/
      controllers/
      middleware/
      models/
      routes/
      uploads/
      utils/
    frontend/
      index.html
      login.html
      register.html
      dashboard.html
      css/
      js/
```

## API Overview

The backend mounts all API routes under `/api`.

| Route | Purpose |
| --- | --- |
| `/api/health` | Check backend status |
| `/api/auth` | Register, login, logout, current user |
| `/api/users` | Profiles, follow/unfollow, suggested users |
| `/api/posts` | Feed, create posts, update posts, delete posts |
| `/api/comments` | Delete comments |
| `/api/notifications` | List notifications and mark as read |
| `/api/search` | Search users/posts |
| `/api/saved` | Saved posts |
| `/uploads` | Uploaded images |

## Environment Variables

Create `mern-social/backend/.env` from `mern-social/backend/.env.example`.

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/mern_social
JWT_SECRET=replace_this_with_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=https://codealpha-social-spark-frontend.onrender.com
SERVER_URL=https://codealpha-social-spark.onrender.com
```

Important notes:

- `MONGO_URI` must be your MongoDB Atlas connection string when deploying on Render.
- `JWT_SECRET` should be a long private random string.
- `CLIENT_ORIGIN` must be the deployed frontend URL.
- `SERVER_URL` must be the deployed backend URL.
- Do not commit your real `.env` file.

## Run Locally

### Prerequisites

- Node.js 18 or newer
- npm
- MongoDB Atlas connection string

### 1. Clone the project

```powershell
git clone <your-repository-url>
cd CodeAlpha_social-spark/mern-social
```

### 2. Install backend dependencies

```powershell
cd backend
npm install
```

### 3. Create the backend environment file

```powershell
copy .env.example .env
```

Then open `.env` and add your real MongoDB Atlas URL and JWT secret.

For local testing, your `.env` can still use the deployed frontend/backend URLs:

```env
CLIENT_ORIGIN=https://codealpha-social-spark-frontend.onrender.com
SERVER_URL=https://codealpha-social-spark.onrender.com
```

### 4. Seed sample data

Run this if you want the demo users and sample posts:

```powershell
npm run seed:reset
```

### 5. Start the backend

```powershell
npm run dev
```

The backend starts on the port from `.env`. In production, Render provides the port automatically.

### 6. Run the frontend locally

Open a new terminal:

```powershell
cd CodeAlpha_social-spark/mern-social/frontend
npx http-server .
```

The frontend already points to the deployed backend API:

```js
https://codealpha-social-spark.onrender.com/api
```

## Useful Commands

Run these from `mern-social/backend`:

```powershell
npm run dev
npm start
npm run seed
npm run seed:reset
```

Command purpose:

| Command | Description |
| --- | --- |
| `npm run dev` | Starts backend with nodemon |
| `npm start` | Starts backend with Node |
| `npm run seed` | Seeds sample data |
| `npm run seed:reset` | Clears and reseeds sample data |

## Troubleshooting

### Backend cannot connect to database

Check:

- MongoDB Atlas username and password are correct.
- Your password is URL encoded if it has special characters.
- MongoDB Atlas Network Access allows Render connections.
- `MONGO_URI` is set in Render environment variables.

### Demo login does not work

Run the seed command locally or on your deployed database:

```powershell
npm run seed:reset
```

## Author

CodeAlpha Social Spark project.
