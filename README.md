# Pulse — MERN Social Platform
Vanilla MERN stack (MongoDB + Express + Vanilla JS + Node) social platform with auth, profiles, follow system, posts, image upload, comments, infinite scroll, dark/light mode.
A full-stack social media app built with **MongoDB · Express · Vanilla JS · Node.js**, organized in classic **MVC** style.
*** Begin Patch
*** End Patch
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
