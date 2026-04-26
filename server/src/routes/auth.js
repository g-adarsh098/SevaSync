const express = require('express');
const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, displayName, role } = req.body;
    if (!email || !displayName) return res.status(400).json({ error: 'Email and name required' });
    // In production: create Firebase user + Firestore profile
    res.status(201).json({ message: 'User registered', user: { email, displayName, role: role || 'volunteer' } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Credentials required' });
    // In production: verify with Firebase Auth, return JWT
    res.json({ message: 'Login successful', token: 'demo-jwt-token' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
