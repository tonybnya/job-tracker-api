/**
 * Script Name : app.js
 * Description : Main entry point
 * Usage       : node app.js
 * Author      : @tonybnya
 */

const express = require('express');
const app = express();

// middleware to parse JSON request bodies
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// root endpoint
app.get('/', (req, res) => {
  res.send("Welcome to Job Tracker Application API");
});

app.listen(3000, () => {
  console.log('Job Tracker API running on http://localhost:3000');
});
