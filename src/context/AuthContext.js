import
  { createContext, // import createContext from React, this is used to create a context object for whether the user is logged in or not
    useState, // import useState from React, this is used to manage state in functional components
    useEffect, // import useEffect from React, this is used to manage side effects in functional components
    useContext, // import useContext from React, this is used to access the context object
    useCallback // import useCallback from React, this is used to manage callbacks in functional components
  } from 'react';

import { auth } from '../firebase'; // import the auth object from the firebase file

import { 
  onAuthStateChanged, // import onAuthStateChanged from firebase/auth, this is used to listen for changes in the authentication state
  signInWithEmailAndPassword, // import signInWithEmailAndPassword from firebase/auth, this is used to sign in with an email and password
  signOut as firebaseSignOut // import signOut as firebaseSignOut from firebase/auth, this is used to sign out
} from 'firebase/auth';

export const AuthContext = createContext(); // create the AuthContext object, this is used to access the context object

export const AuthProvider = ({ children }) => { // create the AuthProvider component, this is used to provide the authentication context to the app
  const [currentUser, setCurrentUser] = useState(null); // state variable for the current user
  const [loading, setLoading] = useState(true); // state variable for the loading state
  const [authError, setAuthError] = useState(null); // state variable for the authentication error
  
  const [lastTokenRefresh, setLastTokenRefresh] = useState(0); // state variable for the last token refresh
  
  const signIn = async (email, password) => { // sign in with an email and password
    setAuthError(null); // set the authentication error to null
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password); // sign in with the email and password
      return userCredential.user; // return the user
    } catch (error) {
      setAuthError(error.message); // set the authentication error to the error message
      throw error; // throw the error
    }
  };
  
  const signOut = async () => { // sign out
    setAuthError(null); // set the authentication error to null
    try {
      await firebaseSignOut(auth); // sign out
    } catch (error) {
      setAuthError(error.message); // set the authentication error to the error message
      throw error; // throw the error
    }
  };
  
  const getAuthToken = useCallback(async (forceRefresh = false) => { // get the authentication token
    if (!currentUser) return null; // if there is no current user, return null
    
    const now = Date.now(); // get the current time
    
    const shouldForceRefresh = forceRefresh || (now - lastTokenRefresh > 10 * 60 * 1000); // if the force refresh is true, or the last token refresh is more than 10 minutes ago, then force a refresh
    
    try {
      const token = await currentUser.getIdToken(shouldForceRefresh); // get the authentication token
      
      if (shouldForceRefresh) {
        setLastTokenRefresh(now); // set the last token refresh to the current time
      }
      
      return token; // return the authentication token
    } catch (error) {
      console.error("Error getting auth token:", error); // log the error
      if (!forceRefresh) {
        return getAuthToken(true); // if the force refresh is false, then force a refresh
      }
      return null; // return null
    }
  }, [currentUser, lastTokenRefresh]); // use the current user and the last token refresh as dependencies
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => { // listen for changes in the authentication state
      setCurrentUser(user); // set the current user to the user
      setLoading(false); // set the loading to false
    });
    
    return () => unsubscribe(); // return the unsubscribe function, which unsubscribes from the authentication state
  }, []);
  
  const value = { // set the value of the context object, which is the user's authentication state
    currentUser, // the current user
    loading, // the loading state
    authError, // the authentication error
    signIn, // the sign in function
    signOut, // the sign out function
    getAuthToken // the get authentication token function
  };
  
  return (
    <AuthContext.Provider value={value}> {/* provide the value of the context object to the children */}
      {!loading && children} {/* if the loading state is false, then render the children */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => { // use the useAuth hook, which is used to access the authentication context
  return useContext(AuthContext); // return the context object
};

export default AuthProvider; // export the AuthProvider component, allowing it to be used in other components
