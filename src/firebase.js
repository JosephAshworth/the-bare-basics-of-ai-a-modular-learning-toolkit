// the firebase configuration file to connect to the firebase project

// import the firebase library
// with the functions for initialising the app, getting the auth, firestore and analytics
import { initializeApp } from "firebase/app"; 
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore"; 
import { getAnalytics } from "firebase/analytics"; 

// whether to use local credentials or not
// if true, the credentials are loaded from the firebase-credentials.json file
// if not, the credentials are loaded from the environment variables (deployment)
const useLocalCredentials = process.env.REACT_APP_USE_LOCAL_FIREBASE_CREDENTIALS === 'true'; 

let firebaseCredentials; 

// determine the firebase credentials to use
if (useLocalCredentials) { 
  try { 
    firebaseCredentials = require("./firebase-credentials.json"); 
  } catch (error) { 
    console.error('Failed to load local credentials:', error); 
    firebaseCredentials = null; 
  }
}

// determine the firebase config to use
// depending on whether local credentials are used or not
const firebaseConfig = (useLocalCredentials && firebaseCredentials) ? { 
  apiKey: firebaseCredentials.apiKey,
  authDomain: firebaseCredentials.authDomain,
  projectId: firebaseCredentials.projectId,
  storageBucket: firebaseCredentials.storageBucket,
  messagingSenderId: firebaseCredentials.messagingSenderId,
  appId: firebaseCredentials.appId,
  measurementId: firebaseCredentials.measurementId
} : { 
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// determine the missing keys in the firebase config, if any
const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId']; 
const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]); 

// initialise the firebase app
let app; 
let auth; 
let db; 
let analytics; 
let firebaseInitialised = false; 

// if there are missing keys
if (missingKeys.length > 0) { 
    console.error(`Firebase initialisation failed: Missing required environment variables: ${missingKeys.join(', ')}`); 
    auth = { currentUser: null }; // set the auth to null

    // Set the database to a mock object, as it is not needed
    db = { collection: () => ({ doc: () => ({ get: () => Promise.resolve({ exists: false }) }) }) }; 
} else { 
    try {
      // initialise the firebase app
      app = initializeApp(firebaseConfig); 
      auth = getAuth(app); 
      db = getFirestore(app); 

      // if the measurement ID is present, initialise the analytics
      if (firebaseConfig.measurementId) { 
        try {
            analytics = getAnalytics(app); 
        } catch (analyticsError) {
            console.warn("Firebase Analytics initialisation failed:", analyticsError.message); 
            analytics = null; // set the analytics to null if it fails
        }
      } else { 
          analytics = null; // set the analytics to null if it is not present
      }

      // indicate that firebase has been initialised successfully
      firebaseInitialised = true;
      console.log("Firebase initialised successfully");
    } catch (error) { // if the initialisation fails, set the auth, db and analytics to null
      console.error("Firebase initialisation failed:", error.message); 
      auth = { currentUser: null }; 
      db = { collection: () => ({ doc: () => ({ get: () => Promise.resolve({ exists: false }) }) }) };
    }
}

// check if firebase has been initialised successfully
const checkFirebaseConnection = async () => { 
  if (!firebaseInitialised) return false; 
  
  try {
    // test to see if the database is connected
    // using a test document to check the connection (not actually present in the database)
    const testDoc = db.collection('_connection_test').doc('test'); 
    await testDoc.get(); 
    return true; // return true if the connection is successful
  } catch (error) {
    console.error("Firebase connection test failed:", error.message); 
    return false; 
  }
};

// export the auth, db, analytics and firebaseInitialised variables
// so that they can be used in other files
export { auth, db, analytics, firebaseInitialised, checkFirebaseConnection }; 