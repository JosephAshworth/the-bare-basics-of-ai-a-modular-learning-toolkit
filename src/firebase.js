import { initializeApp } from "firebase/app"; // import initialiseApp, which initialises the Firebase app
import { getAuth } from "firebase/auth"; // import getAuth, which gets the authentication service
import { getFirestore } from "firebase/firestore"; // import getFirestore, which gets the Firestore service
import { getAnalytics } from "firebase/analytics"; // import getAnalytics, which gets the Analytics service

const useLocalCredentials = process.env.REACT_APP_USE_LOCAL_FIREBASE_CREDENTIALS === 'true'; // check if the local credentials are used


let firebaseCredentials; // define the firebaseCredentials variable, which will store the Firebase credentials

if (useLocalCredentials) { // if the local credentials are used
  try { // try to import the Firebase credentials
    firebaseCredentials = require("./firebase-credentials.json"); // import the Firebase credentials
  } catch (error) { // if the Firebase credentials are not found
    console.error('Failed to load local credentials:', error); // log an error message
    firebaseCredentials = null; // set the firebaseCredentials to null
  }
}


const firebaseConfig = (useLocalCredentials && firebaseCredentials) ? { // if the local credentials are used and the Firebase credentials are found then use the local credentials
  apiKey: firebaseCredentials.apiKey,
  authDomain: firebaseCredentials.authDomain,
  projectId: firebaseCredentials.projectId,
  storageBucket: firebaseCredentials.storageBucket,
  messagingSenderId: firebaseCredentials.messagingSenderId,
  appId: firebaseCredentials.appId,
  measurementId: firebaseCredentials.measurementId
} : { // if the local credentials are not used or the Firebase credentials are not found, use the environment variables
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId']; // define the required keys for the Firebase app
const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]); // filter the required keys to find any missing keys

let app; // define the app variable, which will store the Firebase app
let auth; // define the auth variable, which will store the authentication service
let db; // define the db variable, which will store the Firestore service
let analytics; // define the analytics variable, which will store the Analytics service
let firebaseInitialised = false; // define the firebaseInitialised variable, which will store the Firebase app initialisation status

if (missingKeys.length > 0) { // if there are missing keys
    console.error(`Firebase initialisation failed: Missing required environment variables: ${missingKeys.join(', ')}`); // log an error message
    auth = { currentUser: null }; // set the auth to null
    db = { collection: () => ({ doc: () => ({ get: () => Promise.resolve({ exists: false }) }) }) }; // set the db to a placeholder object
} else { // if there are no missing keys
    try {
      app = initializeApp(firebaseConfig); // initialise the Firebase app
      auth = getAuth(app); // get the authentication service
      db = getFirestore(app); // get the Firestore service
      if (firebaseConfig.measurementId) { // if the window is defined and the measurementId is defined
        try {
            analytics = getAnalytics(app); // get the Analytics service
        } catch (analyticsError) {
            console.warn("Firebase Analytics initialisation failed:", analyticsError.message); // log a warning message
            analytics = null; // set the analytics to null
        }
      } else { // if the window is not defined or the measurementId is not defined
          analytics = null; // set the analytics to null
      }
      firebaseInitialised = true; // set the firebaseInitialised to true
      console.log("Firebase initialised successfully");
    } catch (error) {
      console.error("Firebase initialisation failed:", error.message); // log an error message
      auth = { currentUser: null }; // set the auth and the current user to null
      db = { collection: () => ({ doc: () => ({ get: () => Promise.resolve({ exists: false }) }) }) }; // set the db to a placeholder object
    }
}

const checkFirebaseConnection = async () => { // check the Firebase connection
  if (!firebaseInitialised) return false; // if the Firebase app is not initialised, return false
  
  try {
    const testDoc = db.collection('_connection_test').doc('test'); // get the test document
    await testDoc.get(); // get the test document
    return true; // return true if the test document is retrieved
  } catch (error) {
    console.error("Firebase connection test failed:", error.message); // log an error message
    return false; // return false if the test document is not retrieved
  }
};

export { auth, db, analytics, firebaseInitialised, checkFirebaseConnection }; // export the auth, db, analytics, firebaseInitialised, and checkFirebaseConnection variables
