/**
 * Script Name : app.js
 * Description : Main entry point
 * Usage       : node app.js
 * Author      : @tonybnya
 */

const express = require('express');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');

const app = express();

// middleware to parse JSON request bodies
app.use(express.json());

// scoped route endpoints
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/jobs', jobRoutes);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// catch-all route missing handling
app.use((req, res) => {
  res.status(404).json({ 'error': 'Route endpoint not found' });
});

// root endpoint
app.get('/', (req, res) => {
  res.send("Welcome to Job Tracker Application API");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Job Tracker API running on port: ${PORT}`);
});
