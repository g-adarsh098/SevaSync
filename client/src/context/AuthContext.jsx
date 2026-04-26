import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import {
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, increment, arrayUnion } from 'firebase/firestore';

const AuthContext = createContext(null);

// Default stats for a brand new volunteer
const DEFAULT_PROFILE = {
  role: 'volunteer',
  profileComplete: false,
  skills: [],
  interests: [],
  availability: {},
  location: null,
  photoURL: null,
  // All counters start at 0
  points: 0,
  badges: [],
  hoursContributed: 0,
  bloodDonations: 0,
  eventsVolunteered: 0,
  treesPlanted: 0,
  mealsServed: 0,
  organPledges: 0,
  beneficiariesHelped: 0,
  volunteerHistory: [], // Array of { needId, title, category, date, hours }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const profileDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (profileDoc.exists()) {
            setUserProfile({ ...DEFAULT_PROFILE, ...profileDoc.data() });
          } else {
            // Edge case: auth user exists but no profile doc — create one
            const profile = {
              ...DEFAULT_PROFILE,
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || 'Volunteer',
              createdAt: serverTimestamp(),
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), profile);
            setUserProfile(profile);
          }
        } catch (e) {
          console.error('Profile fetch error:', e);
          alert(`Error loading profile: ${e.message}`);
          // Still set a local profile so UI doesn't break
          setUserProfile({
            ...DEFAULT_PROFILE,
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || 'Volunteer',
          });
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const signup = async (email, password, displayName) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName });
      const profile = {
        ...DEFAULT_PROFILE,
        uid: cred.user.uid,
        email,
        displayName,
        createdAt: serverTimestamp(),
      };
      await setDoc(doc(db, 'users', cred.user.uid), profile);
      setUserProfile(profile);
      return cred.user;
    } catch (e) {
      alert(`Signup failed: ${e.message}`);
      throw e;
    }
  };

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password).catch(e => {
    alert(`Login failed: ${e.message}`);
    throw e;
  });

  const logout = () => signOut(auth);

  const updateUserProfile = async (data) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid), data, { merge: true });
      setUserProfile(prev => ({ ...prev, ...data }));
    } catch (e) {
      alert(`Failed to update profile: ${e.message}`);
      throw e;
    }
  };

  // Record a volunteer action — increments counters in Firestore & local state
  const recordVolunteerAction = async (actionData) => {
    if (!user) return;

    const updates = {};
    const localUpdates = {};

    // Always increment events count and add to history
    updates.eventsVolunteered = increment(1);
    localUpdates.eventsVolunteered = (userProfile?.eventsVolunteered || 0) + 1;

    if (actionData.hours) {
      updates.hoursContributed = increment(actionData.hours);
      localUpdates.hoursContributed = (userProfile?.hoursContributed || 0) + actionData.hours;
    }
    if (actionData.points) {
      updates.points = increment(actionData.points);
      localUpdates.points = (userProfile?.points || 0) + actionData.points;
    }
    if (actionData.category === 'blood_donation') {
      updates.bloodDonations = increment(1);
      localUpdates.bloodDonations = (userProfile?.bloodDonations || 0) + 1;
    }
    if (actionData.category === 'tree_plantation') {
      updates.treesPlanted = increment(actionData.count || 1);
      localUpdates.treesPlanted = (userProfile?.treesPlanted || 0) + (actionData.count || 1);
    }
    if (actionData.category === 'food_drive') {
      updates.mealsServed = increment(actionData.count || 1);
      localUpdates.mealsServed = (userProfile?.mealsServed || 0) + (actionData.count || 1);
    }
    if (actionData.category === 'organ_donation') {
      updates.organPledges = increment(1);
      localUpdates.organPledges = (userProfile?.organPledges || 0) + 1;
    }
    if (actionData.beneficiaries) {
      updates.beneficiariesHelped = increment(actionData.beneficiaries);
      localUpdates.beneficiariesHelped = (userProfile?.beneficiariesHelped || 0) + actionData.beneficiaries;
    }

    // Prepare history entry
    const historyEntry = {
      needId: actionData.needId,
      title: actionData.title,
      category: actionData.category,
      date: new Date().toISOString(),
      hours: actionData.hours || 0,
    };

    // Add to updates
    updates.volunteerHistory = arrayUnion(historyEntry);
    updates.lastVolunteered = historyEntry; // For the "message at top" feature

    // Update local updates
    localUpdates.volunteerHistory = [...(userProfile?.volunteerHistory || []), historyEntry];
    localUpdates.lastVolunteered = historyEntry;

    try {
      await setDoc(doc(db, 'users', user.uid), updates, { merge: true });
      setUserProfile(prev => ({ ...prev, ...localUpdates }));
      console.log('✅ Firestore update success for user:', user.uid);
    } catch (e) {
      console.error('❌ Error recording volunteer action:', e);
      alert(`Failed to save to database: ${e.message}. Please check your internet or Firebase permissions.`);
      // Even if database fails, we should still update local state for a better UX
      setUserProfile(prev => ({ ...prev, ...localUpdates }));
    }
  };




  const value = {
    user, userProfile, loading,
    signup, login, logout,
    updateUserProfile, recordVolunteerAction,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
