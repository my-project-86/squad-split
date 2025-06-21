import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
// import logger from './utils/logger';

// --- Firebase configuration ---
// Use environment variables for sensitive data in production
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyCb8EFJrC833Csip_UCqNhqRYUEX4luhm4",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "squad-split-project.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "squad-split-project",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "squad-split-project.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "637698498417",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:637698498417:android:f8ad9b21b8568325e7a0d0"
};

// Runtime check for required config fields
Object.entries(firebaseConfig).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing Firebase config value for: ${key}`);
  }
});

// --- Initialize Firebase App ---
let app;
try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  // Uncomment for development debugging only:
  // logger.info("Firebase App Initialized:", app);
} catch (error) {
  // Handle initialization errors
  // logger.error("Firebase initialization error:", error);
  throw error;
}

// --- Get Auth and Firestore instances with correct persistence ---
let auth;
if (Platform.OS !== 'web') {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} else {
  auth = getAuth(app);
}
const db = getFirestore(app);

console.log("Firebase Auth and Firestore instances initialized.");

// --- Export instances for use in other files ---
export { db, app, auth };

// Usage example (in another file):
// import { db } from './fireBaseConfig';
// import { collection, getDocs } from 'firebase/firestore';
// const querySnapshot = await getDocs(collection(db, 'yourCollection'));
// querySnapshot.forEach(doc => console.log(doc.id, doc.data()));

// --- Example: Using logger middleware (Node.js/Express only) ---
// import logger from './utils/logger';
// app.use(logger); // If using Express backend
