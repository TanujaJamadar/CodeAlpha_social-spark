require('dotenv').config();
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const notificationRoutes = require('./routes/notifications');
const searchRoutes = require('./routes/search');
const savedRoutes = require('./routes/saved');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

connectDB();

const defaultClientOrigins = [
  'https://codealpha-social-spark-frontend.onrender.com',
  'https://codealpha-social-spark.onrender.com',
];

const clientOrigins = (process.env.CLIENT_ORIGIN || defaultClientOrigins.join(','))
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
for (const origin of defaultClientOrigins) {
  if (!clientOrigins.includes(origin)) {
    clientOrigins.push(origin);
  }
}

app.use(cors({
  origin: clientOrigins,
  credentials: true,
}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const frontendDir = path.join(__dirname, '..', 'frontend');
if (fs.existsSync(frontendDir)) {
  app.use(express.static(frontendDir));
  app.get('/', (_req, res) => res.sendFile(path.join(frontendDir, 'index.html')));
}

app.get('/api/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/saved', savedRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API ready on port ${PORT}`));
