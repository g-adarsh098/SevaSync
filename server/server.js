const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { WebSocketServer } = require('ws');
const http = require('http');
const { admin } = require('./src/config/firebase-admin');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Too many requests' });
app.use('/api/', limiter);

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/users', require('./src/routes/users'));
app.use('/api/tasks', require('./src/routes/tasks'));
app.use('/api/matching', require('./src/routes/matching'));
app.use('/api/chat', require('./src/routes/chat'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});

// WebSocket for real-time chat
const wss = new WebSocketServer({ server, path: '/ws' });
const clients = new Map();

wss.on('connection', (ws, req) => {
  const userId = new URL(req.url, 'http://localhost').searchParams.get('userId');
  if (userId) clients.set(userId, ws);
  console.log(`WS connected: ${userId}`);

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data);
      if (msg.type === 'chat_message' && msg.recipientId) {
        const recipient = clients.get(msg.recipientId);
        if (recipient && recipient.readyState === 1) {
          recipient.send(JSON.stringify({ type: 'chat_message', ...msg }));
        }
      }
    } catch (e) { console.error('WS message error:', e); }
  });

  ws.on('close', () => {
    if (userId) clients.delete(userId);
    console.log(`WS disconnected: ${userId}`);
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`🚀 SevaSync API running on port ${PORT}`));

module.exports = app;
