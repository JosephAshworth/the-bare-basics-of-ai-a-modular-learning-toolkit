import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZU1dFlBkd3fRGWb2aF9b-Es65ZUiIZJA",
  authDomain: "synoptic-project-90017.firebaseapp.com",
  projectId: "synoptic-project-90017",
  storageBucket: "synoptic-project-90017.firebasestorage.app",
  messagingSenderId: "999081214519",
  appId: "1:999081214519:web:879416495e367a58a1f5b2",
  measurementId: "G-J9WB465MGB"
};

// Initialize Firebase with error handling
let app;
let auth;
let db;
let analytics;
let firebaseInitialized = false;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  // Only initialize analytics in browser environment
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
  firebaseInitialized = true;
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization failed:", error.message);
  // Create placeholder objects to prevent app crashes
  auth = { currentUser: null };
  db = { collection: () => ({ doc: () => ({ get: () => Promise.resolve({ exists: false }) }) }) };
}

// Function to check Firebase connection status
const checkFirebaseConnection = async () => {
  if (!firebaseInitialized) return false;
  
  try {
    // Try to access Firestore to verify connection
    const testDoc = db.collection('_connection_test').doc('test');
    await testDoc.get();
    return true;
  } catch (error) {
    console.error("Firebase connection test failed:", error.message);
    return false;
  }
};

// Exported functions and values
export { auth, db, analytics, firebaseInitialized, checkFirebaseConnection }; 