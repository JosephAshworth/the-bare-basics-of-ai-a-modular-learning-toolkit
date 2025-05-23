// the firebase configuration file to connect to the firebase project

// import the firebase library
// with the functions for initialising the app and getting the auth
import { initializeApp } from "firebase/app"; 
import { getAuth } from "firebase/auth"; 

// firebase credentials using environment variables
const firebaseConfig = {
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

// if there are missing keys
if (missingKeys.length > 0) { 
    console.error(`Firebase initialisation failed: Missing required environment variables: ${missingKeys.join(', ')}`); 
    auth = { currentUser: null }; // set the auth to null


} else { 
    try {
      // initialise the firebase app
      app = initializeApp(firebaseConfig); 
      auth = getAuth(app); 



      console.log("Firebase initialised successfully");
    } catch (error) { // if the initialisation fails, set the auth, db and analytics to null
      console.error("Firebase initialisation failed:", error.message); 
      auth = { currentUser: null }; 
    }
}



// export the auth so that it can be used in other files
export { auth };
