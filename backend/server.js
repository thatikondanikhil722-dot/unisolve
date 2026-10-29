const express = require('express');
const cors = require('cors');
const path = require('node:path');
const fs = require('node:fs');

// Initialize database
require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/issues', require('./routes/issues'));
app.use('/api/issues', require('./routes/replies'));
app.use('/api/issues', require('./routes/feedback'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/stats', require('./routes/stats'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'University Student Issue & Requirement Management System',
    timestamp: new Date().toISOString()
  });
});

// Serve static frontend build if it exists
const publicDir = path.join(__dirname, 'public');
const frontendDist = path.join(__dirname, '../frontend/dist');
const serveDir = fs.existsSync(publicDir) ? publicDir : (fs.existsSync(frontendDist) ? frontendDist : null);

if (serveDir) {
  app.use(express.static(serveDir, { etag: false, maxAge: 0 }));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(serveDir, 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(` University Issue Management System API is running!`);
  console.log(` Local URL:    http://localhost:${PORT}`);
  console.log(` Network URL:  http://0.0.0.0:${PORT}`);
  console.log(` Environment:  ${process.env.NODE_ENV || 'development'}`);
  console.log(`=======================================================`);
});
