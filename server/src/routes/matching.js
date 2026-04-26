const express = require('express');
const router = express.Router();

// Matching engine (same algorithm as frontend)
function cosineSimilarity(a, b) {
  let dot = 0, mA = 0, mB = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i]*b[i]; mA += a[i]**2; mB += b[i]**2; }
  return (Math.sqrt(mA) && Math.sqrt(mB)) ? dot / (Math.sqrt(mA) * Math.sqrt(mB)) : 0;
}
function geoDistance(lat1, lon1, lat2, lon2) {
  const R = 6371, dLat = (lat2-lat1)*Math.PI/180, dLon = (lon2-lon1)*Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R*2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
const SKILLS = ['teaching','healthcare','technology','design','marketing','writing','photography','event_planning','counseling','cooking','driving','translation','music','sports','environment','construction','legal','finance','childcare','elderly_care','first_aid','social_media','data_entry','fundraising','research'];

function computeMatch(volunteer, task) {
  const vVec = SKILLS.map(s => volunteer.skills?.includes(s) ? 1 : 0);
  const tVec = SKILLS.map(s => task.requiredSkills?.includes(s) ? 1 : 0);
  const skill = cosineSimilarity(vVec, tVec);
  let loc = 0.5;
  if (volunteer.location && task.location) {
    const d = geoDistance(volunteer.location.lat, volunteer.location.lng, task.location.lat, task.location.lng);
    loc = d <= 5 ? 1 : d >= 100 ? 0 : 1 - (d-5)/95;
  }
  const score = Math.round((0.4*skill + 0.3*loc + 0.2*0.5 + 0.1*(volunteer.interests?.includes(task.category)?1:0)) * 100);
  return { score, breakdown: { skills: Math.round(skill*100), location: Math.round(loc*100), availability: 50, interest: volunteer.interests?.includes(task.category) ? 100 : 0 } };
}

// POST /api/matching/volunteer
router.post('/volunteer', async (req, res) => {
  try {
    const { volunteer, tasks } = req.body;
    if (!volunteer || !tasks) return res.status(400).json({ error: 'volunteer and tasks required' });
    const ranked = tasks.map(t => ({ ...t, match: computeMatch(volunteer, t) })).sort((a,b) => b.match.score - a.match.score);
    res.json({ matches: ranked });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/matching/task
router.post('/task', async (req, res) => {
  try {
    const { task, volunteers } = req.body;
    if (!task || !volunteers) return res.status(400).json({ error: 'task and volunteers required' });
    const ranked = volunteers.map(v => ({ ...v, match: computeMatch(v, task) })).sort((a,b) => b.match.score - a.match.score);
    res.json({ matches: ranked });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
