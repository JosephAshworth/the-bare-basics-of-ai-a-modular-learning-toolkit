// manage the user authentication
// including signing them in or out and getting their token to confirm authorisation

import { 
  createContext, // creates a context object, which allows for authentication state management, without needing to pass props through multiple components
  useState, 
  useEffect, 
  useContext, // access the context object, so components can render context changes without needing to pass props through multiple components
  useCallback 
} from 'react';

// import the Firebase authentication instance to manage user authentication states and actions
import { auth } from '../firebase';

// firebase authentication functions
import { 
  onAuthStateChanged, // listen for changes in the authentication state
  signInWithEmailAndPassword, // sign in with email and password
  signOut as firebaseSignOut // sign out of the current session
} from 'firebase/auth';

// create the context object
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  
  const [lastTokenRefresh, setLastTokenRefresh] = useState(0); // last time the token was refreshed
  
  const signIn = async (email, password) => {
    setAuthError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password); // sign in with email and password
      return userCredential.user;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };
  
  const signOut = async () => {
    setAuthError(null);
    try {
      await firebaseSignOut(auth); // sign out of the current session
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };
  
  const getAuthToken = useCallback(async (forceRefresh = false) => {
    if (!currentUser) return null;
    
    const now = Date.now(); // get the current time in milliseconds
    
    const shouldForceRefresh = forceRefresh || (now - lastTokenRefresh > 10 * 60 * 1000); // check if the token should be refreshed, if the user has requested a refresh or if the token is older than 10 minutes
    
    try {
      const token = await currentUser.getIdToken(shouldForceRefresh); // get the token
      
      if (shouldForceRefresh) {
        setLastTokenRefresh(now); // update the last token refresh time
      }
      
      return token;
    } catch (error) {
      console.error("Error getting auth token:", error);
      if (!forceRefresh) {
        return getAuthToken(true);
      }
      return null;
    }
  }, [currentUser, lastTokenRefresh]); // only re-run the function if the current user or last token refresh time changes
  
  // listen for changes in the authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    
    return () => unsubscribe(); // unsubscribe from the authentication state change listener
  }, []); // only run the effect once
  
  // provide the context object to the app
  const value = {
    currentUser,
    loading,
    authError,
    signIn,
    signOut,
    getAuthToken
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Render the children (the app) only when the loading state is false */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext); // return the context object
};

export default AuthProvider;