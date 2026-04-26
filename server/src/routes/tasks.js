const express = require('express');
const router = express.Router();

// GET /api/tasks
router.get('/', async (req, res) => {
  try {
    const { category, status, search } = req.query;
    // In production: query Firestore with filters
    res.json({ tasks: [], filters: { category, status, search } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/tasks
router.post('/', async (req, res) => {
  try {
    const { title, description, requiredSkills, location, date, duration, spots, category } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const task = { id: `task-${Date.now()}`, title, description, requiredSkills, location, date, duration, spots, category, status: 'open', applicants: [], createdAt: new Date() };
    res.status(201).json({ message: 'Task created', task });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/tasks/:id/apply
router.post('/:id/apply', async (req, res) => {
  try {
    const { userId } = req.body;
    res.json({ message: 'Applied successfully', taskId: req.params.id, userId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/tasks/:id/withdraw
router.post('/:id/withdraw', async (req, res) => {
  try {
    const { userId } = req.body;
    res.json({ message: 'Withdrawn successfully', taskId: req.params.id, userId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
