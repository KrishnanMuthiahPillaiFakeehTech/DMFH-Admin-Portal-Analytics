const express = require('express');
const cors = require('cors');
const config = require('./config.json');
const registerRoutes = require('./routes');

const app = express();
const port = 3000;

// Enable CORS with config values
app.use(cors({
  origin: config.CORS_ORIGIN,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse incoming JSON
app.use(express.json());

// Register all API routes
registerRoutes(app);

// Catch-all 404 handler
app.use((req, res) => {
  const route = `${req.method} ${req.originalUrl}`;
  res.status(404).json({
    error: 'API Not Found',
    route,
    message: `Cannot ${route}`
  });
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
