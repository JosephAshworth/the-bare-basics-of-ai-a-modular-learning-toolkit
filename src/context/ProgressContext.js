// manage the user's progress
// including fetching the progress data from the backend
// and updating the progress data on the backend

import { 
  createContext, 
  useState, 
  useEffect, 
  useContext, 
  useCallback 
} from 'react';

// import the api service to interact with the backend
import apiService from '../services/APIService';

// import the auth context to get the current user and assign auth tokens
import { useAuth } from './AuthContext';

// create the context object
export const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
  const { currentUser, getAuthToken } = useAuth();
  const [progressData, setProgressData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // fetch the progress data from the backend
  const fetchProgress = useCallback(async () => {
    if (!currentUser) {
      setProgressData(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    console.log("ProgressContext: fetchProgress called...");
    setIsLoading(true);
    setError(null);

    try {
      const token = await getAuthToken(); // get the user's auth token to verify them
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // set the authorization header with the token if available, otherwise use an empty configuration
      console.log(`ProgressContext: Calling GET /api/modules/progress`); 
      const response = await apiService.get('/api/modules/progress', config); // fetch the progress data from the backend
      const newData = response.data || []; // extract the data from the response, defaulting to an empty array if no data is returned
      console.log('ProgressContext: Received progress data:', newData);
      setProgressData(newData); // set the progress data in the state
      console.log('ProgressContext: Set progressData state.');
    } catch (err) {
      console.error('ProgressContext: Failed to fetch module progress:', err);
      setError('Failed to load module progress.');
      setProgressData(null);
    } finally {
      setIsLoading(false);
      console.log("ProgressContext: fetchProgress finished.");
    }
  }, [getAuthToken, currentUser]); // only re-run the function if the getAuthToken or currentUser changes

  // fetch the progress data from the backend when the component mounts
  useEffect(() => {
    if (currentUser) {
      fetchProgress();
    } else {
      setProgressData(null);
      setError(null);
      setIsLoading(false);
    }
  }, [currentUser, fetchProgress]);

  // mark a module as complete
  const markModuleComplete = async (moduleId, moduleName, completedStatus) => {
    if (!currentUser) {
      return { error: "User not logged in" };
    }

    const previousProgress = progressData ? [...progressData] : []; // create a copy of the progress data, if it exists
    setProgressData(prevData => {
      if (!prevData) return [{ id: moduleId, name: moduleName, completed: completedStatus }]; // if the progress data is not found, return a new array with the module id, name and completed status
      const existingIndex = prevData.findIndex(p => (p.id || p.moduleId) === moduleId); // find the index of the module in the progress data
      if (existingIndex > -1) { // if the module is found in the progress data
        const newData = [...prevData]; // create a new array with the progress data
        newData[existingIndex] = { ...newData[existingIndex], completed: completedStatus }; // update the completed status of the module
        return newData; // return the new array
      } else {
        return [...prevData, { id: moduleId, name: moduleName, completed: completedStatus }]; // if the module is not found in the progress data, return a new array with the module id, name and completed status
      }
    });

    try {
      const token = await getAuthToken(); // authenticate the user
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // set the authorization header with the token if available, otherwise use an empty configuration
      const endpoint = `/api/modules/${moduleId}/complete`; // set the endpoint to the module complete endpoint
      await apiService.post(endpoint, { completed: completedStatus }, config); // mark the module as complete on the backend
      console.log(`ProgressContext: Marked module ${moduleId} as ${completedStatus ? 'complete' : 'incomplete'} on backend.`);
    } catch (err) {
      console.error(`ProgressContext: API error marking module ${moduleId} as complete:`, err);
      setProgressData(previousProgress);
      throw err;
    }
  };

  // update the time spent on a module
  const updateTimeSpent = useCallback(async (moduleId, secondsToAdd) => {
    console.log(`[${moduleId}] updateTimeSpent called. Seconds to add: ${secondsToAdd}s`);
    if (!currentUser || !moduleId || secondsToAdd <= 0) {
      console.log(`ProgressContext: Skipping time update for ${moduleId} (${secondsToAdd}s), invalid params or user.`);
      return;
    }
    console.log(`ProgressContext: Updating time for module ${moduleId} by ${secondsToAdd}s`);
    try {
      const token = await getAuthToken();
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      console.log(`ProgressContext: Calling POST /api/modules/${moduleId}/update-time with body:`, { seconds: secondsToAdd });

      await apiService.post(`/api/modules/${moduleId}/update-time`, { 
        seconds: secondsToAdd
      }, config); // update the time spent on the module on the backend
      
      console.log(`ProgressContext: Successfully sent ${secondsToAdd}s for ${moduleId}. Triggering refresh.`);

    } catch (err) {
      console.error(`ProgressContext: Failed to update time for module ${moduleId}:`, err);
      setError(`Failed to save time for module ${moduleId}.`);
    }
  }, [currentUser, getAuthToken]);

  // reset all module times if the user pressed the reset times button
  const resetAllModuleTimes = useCallback(async () => {
    if (!currentUser) {
      console.warn("ProgressContext: Cannot reset times, user not logged in.");
      setError("You must be logged in to reset progress.");
      return;
    }

    console.log("ProgressContext: Attempting to reset all module times...");
    const wasLoading = isLoading;
    setIsLoading(true);
    setError(null);

    const previousProgress = progressData ? JSON.parse(JSON.stringify(progressData)) : null; // create a copy of the progress data, if it exists
    setProgressData(prevData => {
      if (!prevData) return null; // if the progress data is not found, return null
      return prevData.map(module => ({ ...module, timeSpent: 0 })); // update the time spent on all modules to 0
    });
    console.log("ProgressContext: Reset times in local state.");

    try {
      const token = await getAuthToken(); // authenticate the user
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // set the authorization header with the token if available, otherwise use an empty configuration
      console.log("ProgressContext: Calling POST /api/progress/reset-times");
      await apiService.post('/api/progress/reset-times', {}, config); // reset the time spent on all modules on the backend
      console.log("ProgressContext: Successfully reset all module times on backend.");
      
      if (previousProgress) { // if the previous progress data exists
        console.log("ProgressContext: Clearing related session storage timer items...");
        previousProgress.forEach(module => { // iterate over the previous progress data
          const moduleId = module.id || module.moduleId; // get the module id
          if (moduleId) { // if the module id exists
            const sessionKey = `timer_module_${moduleId}`; // set the session key to the module id
            try {
              sessionStorage.removeItem(sessionKey); // remove the session key from the session storage
              console.log(`Cleared session storage for ${sessionKey}`);
            } catch (e) {
              console.warn(`Failed to clear session storage for ${sessionKey}:`, e);
            }
          }
        });
        console.log("ProgressContext: Finished clearing session storage.");
      } else {
        console.warn("ProgressContext: No previous progress data found to clear session storage items.");
      }

    } catch (err) {
      console.error("ProgressContext: Failed to reset module times:", err);
      setError('Failed to reset module times. Please try again.');
      setProgressData(previousProgress);
      console.log("ProgressContext: Reverted optimistic time reset due to error.");
    } finally {
      setIsLoading(wasLoading);
      console.log("ProgressContext: Reset times finished.");
    }
  }, [currentUser, getAuthToken, progressData, isLoading]); // only re-run the function if the currentUser, getAuthToken, progressData or isLoading changes

  // provide the progress data to the app
  const value = {
    progressData,
    isLoading,
    error,
    fetchProgress,
    markModuleComplete,
    updateTimeSpent,
    resetAllModuleTimes,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children} {/* Render the children (the app) */}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  return useContext(ProgressContext); // return the progress context
};

export default ProgressProvider;