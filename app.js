/**
 * Script Name : app.js
 * Description : Main entry point
 * Usage       : node app.js
 * Author      : @tonybnya
 */

// ensure the env vars load on start
require('dotenv').config();

const express = require('express');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');

const prisma = require('./config/prisma');

const app = express();

// middleware to parse JSON request bodies
app.use(express.json());

// request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// root endpoint
app.get('/', (req, res) => {
  res.send("Welcome to Job Tracker Application API");
});

// health endpoint
app.get('/health', async (req, res) => {
  const healthStatus = {
    status: 'UP',
    timestamp: new Date().toISOString(),
    services: {
      express: 'UP',
      database: 'UNKNOWN'
    }
  };

  try {
    // run a lightweight raw query to test active SQLite connectivity
    await prisma.$queryRaw`SELECT 1`;
    healthStatus.services.database = 'UP';

    // return 503 OK if both Express and SQlite are healthy
    res.status(200).json(healthStatus);
  } catch (error) {
    healthStatus.status = 'DOWN';
    healthStatus.services.database = 'DOWN';
    healthStatus.error = error.message;

    // return 503 SERVICE UNAVAILABLE if database if unreachable or locked
    res.status(503).json(healthStatus);
  }
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/jobs', jobRoutes);

// 404 catch-all missing routes
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route endpoint not found' });
});

// error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
  next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Job Tracker API running on port: ${PORT}`);
});
