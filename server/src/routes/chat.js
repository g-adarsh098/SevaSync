const express = require('express');
const router = express.Router();

// GET /api/chat/:userId - Get chats for user
router.get('/:userId', async (req, res) => {
  try {
    res.json({ chats: [], userId: req.params.userId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/chat/send
router.post('/send', async (req, res) => {
  try {
    const { chatId, senderId, text } = req.body;
    if (!text) return res.status(400).json({ error: 'Message text required' });
    const message = { id: `msg-${Date.now()}`, chatId, senderId, text, timestamp: new Date() };
    res.status(201).json({ message: 'Message sent', data: message });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
