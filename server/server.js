const buffer = require('buffer');
if (!buffer.SlowBuffer) {
    buffer.SlowBuffer = class SlowBuffer extends Buffer {};
}

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();

if (!process.env.MONGO_URI || !process.env.FRONTEND_URL) {
  console.error('Missing environment variables!');
  process.exit(1);
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(async (req, res, next) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }
    next();
  } catch (error) {
    next(error);
  }
});

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  res.status(500).json({ message: err.message });
});

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, async () => {
    console.log(`Server running locally on port ${PORT}`);
    try {
      await connectDB();
    } catch (err) {
      console.error('Database pre-connect failed:', err.message);
    }
  });
}

module.exports = app;
