/**
 * Rotaract Club Service Data - Comprehensive demo dataset
 * Covers blood donation, organ donation, health camps, education, environment, etc.
 */

// ===== SERVICE CATEGORIES =====
export const SERVICE_CATEGORIES = [
  { id: 'blood_donation', label: 'Blood Donation', icon: '🩸', color: '#EF4444', description: 'Blood donation camps and urgent requests' },
  { id: 'organ_donation', label: 'Organ Donation', icon: '💚', color: '#10B981', description: 'Organ donation awareness and pledges' },
  { id: 'health_camp', label: 'Health Camp', icon: '🏥', color: '#3B82F6', description: 'Free health checkups and medical camps' },
  { id: 'eye_donation', label: 'Eye Donation', icon: '👁️', color: '#8B5CF6', description: 'Eye checkups and cornea donation drives' },
  { id: 'food_drive', label: 'Food Drive', icon: '🍱', color: '#F59E0B', description: 'Food distribution to underprivileged' },
  { id: 'tree_plantation', label: 'Tree Plantation', icon: '🌳', color: '#22C55E', description: 'Plantation drives and environment conservation' },
  { id: 'education', label: 'Education', icon: '📚', color: '#6366F1', description: 'Literacy programs and school support' },
  { id: 'cleanliness', label: 'Cleanliness', icon: '🧹', color: '#14B8A6', description: 'Swachh Bharat and cleanup drives' },
  { id: 'disaster_relief', label: 'Disaster Relief', icon: '🆘', color: '#DC2626', description: 'Emergency aid and disaster response' },
  { id: 'women_empowerment', label: 'Women Empowerment', icon: '👩‍💼', color: '#EC4899', description: 'Skill development and awareness for women' },
];

// ===== NEARBY NEEDS - Locations on map =====
export const NEARBY_NEEDS = [
  // Blood Donation
  {
    id: 'need-1', category: 'blood_donation', title: 'Urgent: O- Blood Required',
    description: 'Patient at KEM Hospital needs 3 units of O- blood urgently for surgery.',
    location: { lat: 19.0003, lng: 72.8424, address: 'KEM Hospital, Parel, Mumbai' },
    urgency: 'critical', postedBy: 'Dr. Mehta', phone: '+91 98765 43210',
    postedAt: new Date('2026-04-25T08:00:00'), expiresAt: new Date('2026-04-26T08:00:00'),
    volunteersNeeded: 5, volunteersJoined: 2, bloodGroup: 'O-'
  },
  {
    id: 'need-2', category: 'blood_donation', title: 'Blood Donation Camp - Andheri',
    description: 'Monthly blood donation camp organized by RAC Mumbai West. Free health checkup for donors.',
    location: { lat: 19.1197, lng: 72.8464, address: 'Andheri Sports Complex, Mumbai' },
    urgency: 'medium', postedBy: 'RAC Mumbai West',
    postedAt: new Date('2026-04-24T10:00:00'), expiresAt: new Date('2026-05-01T18:00:00'),
    volunteersNeeded: 20, volunteersJoined: 14, date: '2026-05-01'
  },
  {
    id: 'need-3', category: 'blood_donation', title: 'A+ Blood Needed - Lilavati Hospital',
    description: 'Thalassemia patient requires regular A+ blood transfusion.',
    location: { lat: 19.0509, lng: 72.8290, address: 'Lilavati Hospital, Bandra, Mumbai' },
    urgency: 'high', postedBy: 'Lilavati Blood Bank', phone: '+91 98765 12345',
    postedAt: new Date('2026-04-25T06:30:00'), expiresAt: new Date('2026-04-27T18:00:00'),
    volunteersNeeded: 3, volunteersJoined: 1, bloodGroup: 'A+'
  },
  // Organ Donation
  {
    id: 'need-4', category: 'organ_donation', title: 'Organ Donation Awareness Walk',
    description: 'Join the awareness rally from Gateway of India to Churchgate. Spread the word about organ pledge.',
    location: { lat: 18.9220, lng: 72.8347, address: 'Gateway of India, Mumbai' },
    urgency: 'low', postedBy: 'RAC Mumbai Central',
    postedAt: new Date('2026-04-23T09:00:00'), expiresAt: new Date('2026-05-05T12:00:00'),
    volunteersNeeded: 50, volunteersJoined: 32, date: '2026-05-05'
  },
  {
    id: 'need-5', category: 'organ_donation', title: 'Organ Pledge Registration Drive',
    description: 'Set up stalls at college campuses to register organ donation pledges. Materials provided.',
    location: { lat: 19.0728, lng: 72.8826, address: 'IIT Bombay, Powai, Mumbai' },
    urgency: 'medium', postedBy: 'MOHAN Foundation',
    postedAt: new Date('2026-04-24T11:00:00'), expiresAt: new Date('2026-05-10T17:00:00'),
    volunteersNeeded: 15, volunteersJoined: 8, date: '2026-05-10'
  },
  // Health Camp
  {
    id: 'need-6', category: 'health_camp', title: 'Free Diabetes Screening Camp',
    description: 'Free blood sugar testing and diabetes consultation. Open for all age groups.',
    location: { lat: 19.0176, lng: 72.8562, address: 'Dadar Community Hall, Mumbai' },
    urgency: 'medium', postedBy: 'RAC Dadar',
    postedAt: new Date('2026-04-22T10:00:00'), expiresAt: new Date('2026-04-28T16:00:00'),
    volunteersNeeded: 12, volunteersJoined: 10, date: '2026-04-28'
  },
  {
    id: 'need-7', category: 'health_camp', title: 'Dental Checkup Camp - Dharavi',
    description: 'Free dental checkups for children and adults in Dharavi area. Volunteers needed for crowd management.',
    location: { lat: 19.0430, lng: 72.8551, address: 'Dharavi Municipal School, Mumbai' },
    urgency: 'medium', postedBy: 'RAC Sion',
    postedAt: new Date('2026-04-24T08:00:00'), expiresAt: new Date('2026-05-03T14:00:00'),
    volunteersNeeded: 8, volunteersJoined: 5, date: '2026-05-03'
  },
  // Eye Donation
  {
    id: 'need-8', category: 'eye_donation', title: 'Eye Checkup Camp - Thane',
    description: 'Free eye examination and spectacles distribution for senior citizens.',
    location: { lat: 19.2183, lng: 72.9781, address: 'Thane Municipal Corporation, Thane' },
    urgency: 'low', postedBy: 'RAC Thane',
    postedAt: new Date('2026-04-23T09:00:00'), expiresAt: new Date('2026-05-08T16:00:00'),
    volunteersNeeded: 10, volunteersJoined: 6, date: '2026-05-08'
  },
  // Food Drive
  {
    id: 'need-9', category: 'food_drive', title: 'Sunday Meal Distribution - Station Area',
    description: 'Distribute packed meals to homeless near CST station. 200 meals to be packed and served.',
    location: { lat: 18.9398, lng: 72.8355, address: 'CST Station, Fort, Mumbai' },
    urgency: 'high', postedBy: 'RAC Fort',
    postedAt: new Date('2026-04-25T07:00:00'), expiresAt: new Date('2026-04-27T13:00:00'),
    volunteersNeeded: 15, volunteersJoined: 9, date: '2026-04-27'
  },
  // Tree Plantation
  {
    id: 'need-10', category: 'tree_plantation', title: 'Monsoon Plantation Drive - Aarey',
    description: 'Plant 500 saplings in Aarey Colony. Saplings and tools provided. Bring your enthusiasm!',
    location: { lat: 19.1551, lng: 72.8733, address: 'Aarey Colony, Goregaon, Mumbai' },
    urgency: 'low', postedBy: 'RAC Goregaon',
    postedAt: new Date('2026-04-20T10:00:00'), expiresAt: new Date('2026-06-15T18:00:00'),
    volunteersNeeded: 40, volunteersJoined: 22, date: '2026-06-15'
  },
  // Education
  {
    id: 'need-11', category: 'education', title: 'Weekend Tuition for Underprivileged Kids',
    description: 'Teach basic Math and English to children (age 6-12) every Saturday. Municipal school, Worli.',
    location: { lat: 19.0131, lng: 72.8174, address: 'Municipal School, Worli, Mumbai' },
    urgency: 'medium', postedBy: 'RAC Worli',
    postedAt: new Date('2026-04-21T09:00:00'), expiresAt: new Date('2026-06-30T12:00:00'),
    volunteersNeeded: 10, volunteersJoined: 6
  },
  // Cleanliness
  {
    id: 'need-12', category: 'cleanliness', title: 'Beach Cleanup - Versova',
    description: 'Join the fortnightly beach cleanup at Versova. Gloves and bags provided.',
    location: { lat: 19.1404, lng: 72.8126, address: 'Versova Beach, Andheri West, Mumbai' },
    urgency: 'low', postedBy: 'RAC Versova',
    postedAt: new Date('2026-04-22T06:00:00'), expiresAt: new Date('2026-05-04T10:00:00'),
    volunteersNeeded: 25, volunteersJoined: 18, date: '2026-05-04'
  },
  // Disaster Relief
  {
    id: 'need-13', category: 'disaster_relief', title: 'Flood Relief Kit Assembly',
    description: 'Assemble and pack flood relief kits (food, medicines, blankets) for distribution in Konkan.',
    location: { lat: 19.0760, lng: 72.8777, address: 'Rotary House, Matunga, Mumbai' },
    urgency: 'high', postedBy: 'Rotary District 3141',
    postedAt: new Date('2026-04-25T10:00:00'), expiresAt: new Date('2026-04-30T18:00:00'),
    volunteersNeeded: 30, volunteersJoined: 12, date: '2026-04-30'
  },
  // Women Empowerment
  {
    id: 'need-14', category: 'women_empowerment', title: 'Self-Defense Workshop for Women',
    description: 'Free self-defense training session for women and girls. Certified trainers. All ages welcome.',
    location: { lat: 19.0990, lng: 72.8487, address: 'YMCA Hall, Andheri, Mumbai' },
    urgency: 'medium', postedBy: 'RAC Andheri',
    postedAt: new Date('2026-04-24T10:00:00'), expiresAt: new Date('2026-05-06T18:00:00'),
    volunteersNeeded: 8, volunteersJoined: 5, date: '2026-05-06'
  },
];

// ===== ROTARACT SERVICE PROJECTS (Historical Data for Analytics) =====
export const SERVICE_PROJECTS = [
  { id: 'sp-1', title: 'Blood Donation Camp - Jan 2026', category: 'blood_donation', date: '2026-01-15', volunteers: 45, beneficiaries: 120, hoursLogged: 180, status: 'completed', unitsCollected: 95 },
  { id: 'sp-2', title: 'Republic Day Tree Plantation', category: 'tree_plantation', date: '2026-01-26', volunteers: 60, beneficiaries: 0, hoursLogged: 240, status: 'completed', treesPlanted: 300 },
  { id: 'sp-3', title: 'Eye Checkup Camp - Feb', category: 'eye_donation', date: '2026-02-08', volunteers: 25, beneficiaries: 200, hoursLogged: 100, status: 'completed', specDistributed: 85 },
  { id: 'sp-4', title: 'Valentine Food Drive', category: 'food_drive', date: '2026-02-14', volunteers: 35, beneficiaries: 500, hoursLogged: 140, status: 'completed', mealsServed: 500 },
  { id: 'sp-5', title: 'Women\'s Day Self-Defense', category: 'women_empowerment', date: '2026-03-08', volunteers: 20, beneficiaries: 75, hoursLogged: 80, status: 'completed' },
  { id: 'sp-6', title: 'World Health Day - Free Checkup', category: 'health_camp', date: '2026-04-07', volunteers: 30, beneficiaries: 180, hoursLogged: 150, status: 'completed' },
  { id: 'sp-7', title: 'Earth Day Beach Cleanup', category: 'cleanliness', date: '2026-04-22', volunteers: 55, beneficiaries: 0, hoursLogged: 220, status: 'completed', wasteKg: 450 },
  { id: 'sp-8', title: 'Blood Donation Camp - Apr', category: 'blood_donation', date: '2026-04-20', volunteers: 38, beneficiaries: 95, hoursLogged: 152, status: 'completed', unitsCollected: 78 },
  { id: 'sp-9', title: 'Digital Literacy Workshop', category: 'education', date: '2026-03-15', volunteers: 15, beneficiaries: 40, hoursLogged: 60, status: 'completed' },
  { id: 'sp-10', title: 'Organ Donation Awareness Rally', category: 'organ_donation', date: '2026-02-28', volunteers: 80, beneficiaries: 300, hoursLogged: 160, status: 'completed', pledgesCollected: 120 },
  { id: 'sp-11', title: 'Flood Relief - Konkan', category: 'disaster_relief', date: '2026-03-20', volunteers: 40, beneficiaries: 250, hoursLogged: 320, status: 'completed', kitsDistributed: 200 },
  { id: 'sp-12', title: 'Rotary Youth Exchange Orientation', category: 'education', date: '2026-04-10', volunteers: 12, beneficiaries: 25, hoursLogged: 48, status: 'completed' },
];

// ===== MONTHLY ANALYTICS =====
export const MONTHLY_ANALYTICS = [
  { month: 'Jan', volunteers: 105, hours: 420, projects: 2, beneficiaries: 120 },
  { month: 'Feb', volunteers: 140, hours: 400, projects: 3, beneficiaries: 775 },
  { month: 'Mar', volunteers: 135, hours: 540, projects: 3, beneficiaries: 365 },
  { month: 'Apr', volunteers: 123, hours: 522, projects: 3, beneficiaries: 275 },
];

// ===== CLUB OVERVIEW STATS =====
export const CLUB_STATS = {
  totalMembers: 85,
  activeVolunteers: 62,
  totalProjects: 12,
  totalHoursLogged: 1882,
  totalBeneficiaries: 1535,
  bloodUnitsCollected: 173,
  treesPlanted: 300,
  mealsServed: 500,
  organPledges: 120,
  avgSatisfaction: 4.6, // out of 5
};

// ===== HELPER: Compute category stats =====
export function getCategoryStats() {
  const stats = {};
  SERVICE_CATEGORIES.forEach(cat => {
    const projects = SERVICE_PROJECTS.filter(p => p.category === cat.id);
    const needs = NEARBY_NEEDS.filter(n => n.category === cat.id);
    stats[cat.id] = {
      ...cat,
      projectCount: projects.length,
      totalVolunteers: projects.reduce((s, p) => s + p.volunteers, 0),
      totalHours: projects.reduce((s, p) => s + p.hoursLogged, 0),
      totalBeneficiaries: projects.reduce((s, p) => s + p.beneficiaries, 0),
      activeNeeds: needs.filter(n => new Date(n.expiresAt) > new Date()).length,
    };
  });
  return stats;
}
