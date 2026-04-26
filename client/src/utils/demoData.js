// Demo data for SevaSync - used when Firebase is not configured

export const DEMO_VOLUNTEERS = [
  {
    uid: 'vol-1', displayName: 'Aarav Sharma', email: 'aarav@email.com',
    role: 'volunteer', photoURL: null,
    skills: ['technology', 'teaching', 'data_entry'],
    interests: ['education', 'technology'],
    availability: { monday: true, wednesday: true, friday: true, saturday: true },
    location: { lat: 19.076, lng: 72.877, city: 'Mumbai' },
    points: 850, badges: ['first_task', 'streak_7', 'top_volunteer'],
    hoursContributed: 124, profileComplete: true
  },
  {
    uid: 'vol-2', displayName: 'Priya Patel', email: 'priya@email.com',
    role: 'volunteer', photoURL: null,
    skills: ['healthcare', 'first_aid', 'counseling', 'elderly_care'],
    interests: ['healthcare', 'social_work'],
    availability: { tuesday: true, thursday: true, saturday: true, sunday: true },
    location: { lat: 19.020, lng: 72.840, city: 'Mumbai' },
    points: 1200, badges: ['first_task', 'streak_30', 'healer', 'top_volunteer'],
    hoursContributed: 280, profileComplete: true
  },
  {
    uid: 'vol-3', displayName: 'Rahul Verma', email: 'rahul@email.com',
    role: 'volunteer', photoURL: null,
    skills: ['design', 'photography', 'social_media', 'marketing'],
    interests: ['arts', 'environment'],
    availability: { monday: true, tuesday: true, wednesday: true },
    location: { lat: 19.114, lng: 72.908, city: 'Mumbai' },
    points: 640, badges: ['first_task', 'creative'],
    hoursContributed: 86, profileComplete: true
  },
  {
    uid: 'vol-4', displayName: 'Sneha Reddy', email: 'sneha@email.com',
    role: 'volunteer', photoURL: null,
    skills: ['teaching', 'writing', 'translation', 'childcare'],
    interests: ['education', 'children'],
    availability: { monday: true, tuesday: true, thursday: true, friday: true, saturday: true },
    location: { lat: 18.520, lng: 73.856, city: 'Pune' },
    points: 980, badges: ['first_task', 'educator', 'streak_14'],
    hoursContributed: 196, profileComplete: true
  },
  {
    uid: 'vol-5', displayName: 'Vikram Singh', email: 'vikram@email.com',
    role: 'volunteer', photoURL: null,
    skills: ['construction', 'driving', 'sports', 'event_planning'],
    interests: ['disaster_relief', 'sports'],
    availability: { saturday: true, sunday: true },
    location: { lat: 19.200, lng: 72.978, city: 'Thane' },
    points: 420, badges: ['first_task', 'builder'],
    hoursContributed: 52, profileComplete: true
  }
];

export const DEMO_NGOS = [
  {
    uid: 'ngo-1', displayName: 'Teach For Tomorrow', email: 'contact@tft.org',
    role: 'ngo', verified: true,
    orgName: 'Teach For Tomorrow Foundation',
    description: 'Empowering underprivileged children through quality education.',
    category: 'education', location: { lat: 19.060, lng: 72.868, city: 'Mumbai' },
    memberCount: 45, tasksPosted: 12, photoURL: null
  },
  {
    uid: 'ngo-2', displayName: 'Green Earth Initiative', email: 'info@gei.org',
    role: 'ngo', verified: true,
    orgName: 'Green Earth Initiative',
    description: 'Working towards a sustainable and green future for all.',
    category: 'environment', location: { lat: 19.095, lng: 72.890, city: 'Mumbai' },
    memberCount: 78, tasksPosted: 8, photoURL: null
  },
  {
    uid: 'ngo-3', displayName: 'HealthBridge', email: 'hello@healthbridge.org',
    role: 'ngo', verified: true,
    orgName: 'HealthBridge Foundation',
    description: 'Providing free healthcare services to marginalized communities.',
    category: 'healthcare', location: { lat: 19.030, lng: 72.850, city: 'Mumbai' },
    memberCount: 120, tasksPosted: 15, photoURL: null
  }
];

export const DEMO_TASKS = [
  {
    id: 'task-1', ngoId: 'ngo-1', ngoName: 'Teach For Tomorrow',
    title: 'Weekend Math Tutoring', category: 'education',
    description: 'Help children from grades 5-8 with math concepts every Saturday. Small groups of 5-8 students.',
    requiredSkills: ['teaching', 'childcare'],
    location: { lat: 19.060, lng: 72.868, city: 'Mumbai' },
    schedule: { saturday: true, sunday: true },
    date: '2026-05-10', duration: '3 hours',
    spots: 5, applicants: ['vol-4'],
    status: 'open', urgency: 'medium',
    createdAt: new Date('2026-04-20')
  },
  {
    id: 'task-2', ngoId: 'ngo-2', ngoName: 'Green Earth Initiative',
    title: 'Beach Cleanup Drive', category: 'environment',
    description: 'Join us for a massive beach cleanup at Juhu Beach. All equipment provided.',
    requiredSkills: ['environment', 'event_planning'],
    location: { lat: 19.098, lng: 72.826, city: 'Mumbai' },
    schedule: { sunday: true },
    date: '2026-05-03', duration: '4 hours',
    spots: 30, applicants: [],
    status: 'open', urgency: 'high',
    createdAt: new Date('2026-04-18')
  },
  {
    id: 'task-3', ngoId: 'ngo-3', ngoName: 'HealthBridge',
    title: 'Free Health Camp Assistant', category: 'healthcare',
    description: 'Assist doctors during a free health checkup camp. Basic first aid knowledge preferred.',
    requiredSkills: ['healthcare', 'first_aid'],
    location: { lat: 19.030, lng: 72.850, city: 'Mumbai' },
    schedule: { saturday: true },
    date: '2026-05-17', duration: '6 hours',
    spots: 10, applicants: ['vol-2'],
    status: 'open', urgency: 'high',
    createdAt: new Date('2026-04-22')
  },
  {
    id: 'task-4', ngoId: 'ngo-1', ngoName: 'Teach For Tomorrow',
    title: 'Website Redesign Project', category: 'technology',
    description: 'Help redesign our organization website. Looking for someone with web development and design skills.',
    requiredSkills: ['technology', 'design', 'social_media'],
    location: { lat: 19.060, lng: 72.868, city: 'Mumbai' },
    schedule: { monday: true, wednesday: true, friday: true },
    date: '2026-05-15', duration: '2 weeks',
    spots: 2, applicants: [],
    status: 'open', urgency: 'medium',
    createdAt: new Date('2026-04-23')
  },
  {
    id: 'task-5', ngoId: 'ngo-2', ngoName: 'Green Earth Initiative',
    title: 'Social Media Campaign Manager', category: 'marketing',
    description: 'Create and manage social media campaigns for our upcoming tree plantation drive.',
    requiredSkills: ['social_media', 'marketing', 'photography', 'writing'],
    location: { lat: 19.095, lng: 72.890, city: 'Mumbai' },
    schedule: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true },
    date: '2026-05-01', duration: '1 month',
    spots: 3, applicants: ['vol-3'],
    status: 'open', urgency: 'low',
    createdAt: new Date('2026-04-24')
  },
  {
    id: 'task-6', ngoId: 'ngo-3', ngoName: 'HealthBridge',
    title: 'Data Entry for Patient Records', category: 'technology',
    description: 'Help digitize patient records from our recent health camps. Accuracy is key.',
    requiredSkills: ['data_entry', 'technology'],
    location: { lat: 19.030, lng: 72.850, city: 'Mumbai' },
    schedule: { tuesday: true, thursday: true },
    date: '2026-05-20', duration: '5 days',
    spots: 4, applicants: [],
    status: 'open', urgency: 'medium',
    createdAt: new Date('2026-04-25')
  }
];

export const DEMO_MESSAGES = [
  { id: 'msg-1', chatId: 'chat-1', senderId: 'ngo-1', text: 'Hi Sneha! Thanks for applying to the math tutoring program. Are you available this Saturday?', timestamp: new Date('2026-04-24T10:30:00') },
  { id: 'msg-2', chatId: 'chat-1', senderId: 'vol-4', text: 'Hi! Yes, I am available. What time should I arrive?', timestamp: new Date('2026-04-24T10:45:00') },
  { id: 'msg-3', chatId: 'chat-1', senderId: 'ngo-1', text: 'Great! Please come by 9 AM. The session runs from 9:30 to 12:30. I\'ll send you the address.', timestamp: new Date('2026-04-24T11:00:00') },
  { id: 'msg-4', chatId: 'chat-1', senderId: 'vol-4', text: 'Perfect, I\'ll be there! Should I bring any materials?', timestamp: new Date('2026-04-24T11:15:00') },
];

export const DEMO_CHATS = [
  { id: 'chat-1', participants: ['vol-4', 'ngo-1'], lastMessage: 'Perfect, I\'ll be there!', updatedAt: new Date('2026-04-24T11:15:00'), unread: 0 }
];
