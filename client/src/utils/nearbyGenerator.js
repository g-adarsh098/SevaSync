/**
 * Dynamic Nearby Needs Generator
 * Creates realistic volunteer needs around the user's ACTUAL GPS coordinates.
 * No hardcoded city — works anywhere in the world.
 */

import { SERVICE_CATEGORIES } from './rotaractData';

// Random offset in km → lat/lng degrees
function randomOffset(maxKm) {
  const kmToLat = 1 / 111;
  const kmToLng = 1 / (111 * Math.cos(0)); // approximate
  const distKm = Math.random() * maxKm;
  const angle = Math.random() * 2 * Math.PI;
  return {
    dLat: distKm * Math.cos(angle) * kmToLat,
    dLng: distKm * Math.sin(angle) * kmToLng,
  };
}

// Need templates — generic enough to work in any location
const NEED_TEMPLATES = [
  // Blood Donation
  {
    category: 'blood_donation', urgency: 'critical',
    title: 'Urgent: O- Blood Required',
    description: 'Patient undergoing emergency surgery needs 3 units of O-negative blood urgently. Any eligible donor please come.',
    volunteersNeeded: 5, maxDistKm: 6,
    postedBy: 'City Hospital Blood Bank', phone: '+91 98765 43210', bloodGroup: 'O-'
  },
  {
    category: 'blood_donation', urgency: 'high',
    title: 'A+ Blood Needed for Thalassemia Patient',
    description: 'Young thalassemia patient requires regular A+ blood transfusion. Donors welcome at the nearest blood bank.',
    volunteersNeeded: 3, maxDistKm: 8,
    postedBy: 'Red Cross Blood Center', phone: '+91 98765 12345', bloodGroup: 'A+'
  },
  {
    category: 'blood_donation', urgency: 'medium',
    title: 'Monthly Blood Donation Camp',
    description: 'Rotaract-organized monthly blood donation camp. Free health checkup for all donors. Walk-ins welcome.',
    volunteersNeeded: 20, maxDistKm: 10,
    postedBy: 'Rotaract Club', date: formatFutureDate(7),
  },
  // Organ Donation
  {
    category: 'organ_donation', urgency: 'low',
    title: 'Organ Donation Awareness Walk',
    description: 'Join the community awareness rally for organ donation pledge. T-shirts and refreshments provided.',
    volunteersNeeded: 50, maxDistKm: 12,
    postedBy: 'MOHAN Foundation', date: formatFutureDate(10),
  },
  {
    category: 'organ_donation', urgency: 'medium',
    title: 'Organ Pledge Registration Drive',
    description: 'Help set up registration stalls to collect organ donation pledges. Training materials provided.',
    volunteersNeeded: 15, maxDistKm: 8,
    postedBy: 'Rotaract Health Wing', date: formatFutureDate(14),
  },
  // Health Camp
  {
    category: 'health_camp', urgency: 'medium',
    title: 'Free Diabetes Screening Camp',
    description: 'Free blood sugar testing and diabetes consultation for all age groups. Walk-ins welcome.',
    volunteersNeeded: 12, maxDistKm: 5,
    postedBy: 'Rotaract Health Team', date: formatFutureDate(4),
  },
  {
    category: 'health_camp', urgency: 'medium',
    title: 'Dental Checkup Camp',
    description: 'Free dental checkups for children and adults. Volunteers needed for crowd management and registration.',
    volunteersNeeded: 8, maxDistKm: 7,
    postedBy: 'Rotaract Community Service', date: formatFutureDate(9),
  },
  // Eye Donation
  {
    category: 'eye_donation', urgency: 'low',
    title: 'Eye Checkup & Spectacles Distribution',
    description: 'Free eye examination and spectacles distribution for senior citizens in the area.',
    volunteersNeeded: 10, maxDistKm: 12,
    postedBy: 'Lions Club & Rotaract', date: formatFutureDate(12),
  },
  // Food Drive
  {
    category: 'food_drive', urgency: 'high',
    title: 'Weekend Meal Distribution',
    description: 'Prepare and distribute 200 packed meals to underprivileged families. All ingredients provided.',
    volunteersNeeded: 15, maxDistKm: 4,
    postedBy: 'Rotaract Community Kitchen', date: formatFutureDate(2),
  },
  // Tree Plantation
  {
    category: 'tree_plantation', urgency: 'low',
    title: 'Community Tree Plantation Drive',
    description: 'Plant saplings in your neighborhood park. Saplings, tools and refreshments provided. Bring enthusiasm!',
    volunteersNeeded: 30, maxDistKm: 6,
    postedBy: 'Green Rotaract', date: formatFutureDate(20),
  },
  // Education
  {
    category: 'education', urgency: 'medium',
    title: 'Weekend Tuition for Underprivileged Kids',
    description: 'Teach basic Math and English to children (age 6-12). No experience needed, just patience and care.',
    volunteersNeeded: 10, maxDistKm: 5,
    postedBy: 'Rotaract Education Wing',
  },
  // Cleanliness
  {
    category: 'cleanliness', urgency: 'low',
    title: 'Neighborhood Cleanup Drive',
    description: 'Join the community cleanup near your area. Gloves, bags and refreshments provided.',
    volunteersNeeded: 25, maxDistKm: 3,
    postedBy: 'Rotaract Swachh Drive', date: formatFutureDate(8),
  },
  // Disaster Relief
  {
    category: 'disaster_relief', urgency: 'high',
    title: 'Relief Kit Assembly & Distribution',
    description: 'Assemble and pack relief kits (food, medicines, blankets) for disaster-affected areas. Urgent help needed.',
    volunteersNeeded: 30, maxDistKm: 10,
    postedBy: 'Rotary District Relief', date: formatFutureDate(5),
  },
  // Women Empowerment
  {
    category: 'women_empowerment', urgency: 'medium',
    title: 'Self-Defense Workshop for Women',
    description: 'Free self-defense training session for women and girls. Certified trainers. All ages welcome.',
    volunteersNeeded: 8, maxDistKm: 6,
    postedBy: 'Rotaract Women\'s Wing', date: formatFutureDate(11),
  },
];

function formatFutureDate(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
}

/**
 * Generate nearby needs dynamically around the given user coordinates.
 * Each need gets a random position within its maxDistKm radius.
 */
export function generateNearbyNeeds(userLat, userLng) {
  return NEED_TEMPLATES.map((template, i) => {
    const offset = randomOffset(template.maxDistKm);
    const lat = userLat + offset.dLat;
    const lng = userLng + offset.dLng;

    // Calculate rough distance for address
    const distKm = Math.sqrt(offset.dLat ** 2 + offset.dLng ** 2) * 111;
    const direction = getDirection(offset.dLat, offset.dLng);

    // Random volunteers joined (30-80% of needed)
    const joined = Math.floor(template.volunteersNeeded * (0.3 + Math.random() * 0.5));

    return {
      id: `need-${i + 1}`,
      category: template.category,
      title: template.title,
      description: template.description,
      location: {
        lat: parseFloat(lat.toFixed(6)),
        lng: parseFloat(lng.toFixed(6)),
        address: `~${distKm.toFixed(1)} km ${direction} from you`,
      },
      urgency: template.urgency,
      postedBy: template.postedBy,
      phone: template.phone || null,
      bloodGroup: template.bloodGroup || null,
      date: template.date || null,
      postedAt: new Date(Date.now() - Math.random() * 5 * 86400000),
      expiresAt: new Date(Date.now() + (3 + Math.random() * 25) * 86400000),
      volunteersNeeded: template.volunteersNeeded,
      volunteersJoined: joined,
    };
  });
}

function getDirection(dLat, dLng) {
  if (Math.abs(dLat) > Math.abs(dLng)) {
    return dLat > 0 ? 'North' : 'South';
  }
  return dLng > 0 ? 'East' : 'West';
}
