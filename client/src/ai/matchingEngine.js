/**
 * SevaSync AI Matching Engine
 * Uses cosine similarity, geo-distance, and availability overlap
 * to produce a composite match score between volunteers and tasks.
 */

// Cosine similarity between two skill vectors
export function cosineSimilarity(vecA, vecB) {
  if (!vecA.length || !vecB.length) return 0;
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    magA += vecA[i] * vecA[i];
    magB += vecB[i] * vecB[i];
  }
  magA = Math.sqrt(magA);
  magB = Math.sqrt(magB);
  return magA && magB ? dot / (magA * magB) : 0;
}

// Haversine distance in km
export function geoDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Location score: 1.0 within 5km, decays to 0 at 100km
export function locationScore(dist) {
  if (dist <= 5) return 1.0;
  if (dist >= 100) return 0;
  return 1 - (dist - 5) / 95;
}

// Build a skill vector from a master skill list
export function buildSkillVector(userSkills, masterSkills) {
  return masterSkills.map(s => userSkills.includes(s) ? 1 : 0);
}

// Availability overlap score
export function availabilityOverlap(volunteerAvail, taskSchedule) {
  if (!volunteerAvail || !taskSchedule) return 0.5; // neutral if unknown
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  let matches = 0, total = 0;
  for (const day of days) {
    if (taskSchedule[day]) {
      total++;
      if (volunteerAvail[day]) matches++;
    }
  }
  return total ? matches / total : 0.5;
}

// Master skill list for vectorization
export const MASTER_SKILLS = [
  'teaching', 'healthcare', 'technology', 'design', 'marketing',
  'writing', 'photography', 'event_planning', 'counseling', 'cooking',
  'driving', 'translation', 'music', 'sports', 'environment',
  'construction', 'legal', 'finance', 'childcare', 'elderly_care',
  'first_aid', 'social_media', 'data_entry', 'fundraising', 'research'
];

// Skill display names
export const SKILL_LABELS = {
  teaching: 'Teaching', healthcare: 'Healthcare', technology: 'Technology',
  design: 'Design', marketing: 'Marketing', writing: 'Writing',
  photography: 'Photography', event_planning: 'Event Planning',
  counseling: 'Counseling', cooking: 'Cooking', driving: 'Driving',
  translation: 'Translation', music: 'Music', sports: 'Sports',
  environment: 'Environment', construction: 'Construction',
  legal: 'Legal Aid', finance: 'Finance', childcare: 'Childcare',
  elderly_care: 'Elderly Care', first_aid: 'First Aid',
  social_media: 'Social Media', data_entry: 'Data Entry',
  fundraising: 'Fundraising', research: 'Research'
};

/**
 * Compute match score between a volunteer and a task
 * Returns { score, breakdown }
 */
export function computeMatchScore(volunteer, task) {
  const weights = { skills: 0.40, location: 0.30, availability: 0.20, interest: 0.10 };

  // Skill similarity
  const volVec = buildSkillVector(volunteer.skills || [], MASTER_SKILLS);
  const taskVec = buildSkillVector(task.requiredSkills || [], MASTER_SKILLS);
  const skillScore = cosineSimilarity(volVec, taskVec);

  // Location proximity
  let locScore = 0.5;
  if (volunteer.location && task.location) {
    const dist = geoDistance(
      volunteer.location.lat, volunteer.location.lng,
      task.location.lat, task.location.lng
    );
    locScore = locationScore(dist);
  }

  // Availability
  const availScore = availabilityOverlap(volunteer.availability, task.schedule);

  // Interest match (category alignment)
  let interestScore = 0;
  if (volunteer.interests && task.category) {
    interestScore = volunteer.interests.includes(task.category) ? 1.0 : 0.0;
  }

  const total = (
    weights.skills * skillScore +
    weights.location * locScore +
    weights.availability * availScore +
    weights.interest * interestScore
  );

  return {
    score: Math.round(total * 100),
    breakdown: {
      skills: Math.round(skillScore * 100),
      location: Math.round(locScore * 100),
      availability: Math.round(availScore * 100),
      interest: Math.round(interestScore * 100)
    }
  };
}

/**
 * Rank all tasks for a volunteer, sorted by match score descending
 */
export function rankTasksForVolunteer(volunteer, tasks) {
  return tasks
    .map(task => ({ ...task, match: computeMatchScore(volunteer, task) }))
    .sort((a, b) => b.match.score - a.match.score);
}

/**
 * Rank all volunteers for a task
 */
export function rankVolunteersForTask(task, volunteers) {
  return volunteers
    .map(vol => ({ ...vol, match: computeMatchScore(vol, task) }))
    .sort((a, b) => b.match.score - a.match.score);
}
