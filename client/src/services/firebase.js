// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdzGdsdGAMc2DDVLRY00lN-bKUD4Q8OiE",
  authDomain: "gdg-prototype-c5701.firebaseapp.com",
  projectId: "gdg-prototype-c5701",
  storageBucket: "gdg-prototype-c5701.firebasestorage.app",
  messagingSenderId: "435232787207",
  appId: "1:435232787207:web:f2dd57a3827bed54c7d3a2",
  measurementId: "G-CCY1WLY1YG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

console.log('🔥 Firebase Initialized with Project ID:', firebaseConfig.projectId);

export { app, auth, db, analytics };