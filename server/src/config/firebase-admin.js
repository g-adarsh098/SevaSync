const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Look for service account in the root of the server folder
const serviceAccountPath = path.join(__dirname, '../../service-account.json');

let db = null;
let auth = null;
let isInitialized = false;

if (fs.existsSync(serviceAccountPath)) {
  try {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('✅ Firebase Admin SDK initialized');
    isInitialized = true;
  } catch (error) {
    console.warn('⚠️ Firebase Admin SDK could not be initialized:', error.message);
  }
} else {
  console.warn('⚠️ Firebase Admin SDK: service-account.json not found. Database features will be limited.');
}

if (isInitialized) {
  db = admin.firestore();
  auth = admin.auth();
}

module.exports = { admin, db, auth, isInitialized };
