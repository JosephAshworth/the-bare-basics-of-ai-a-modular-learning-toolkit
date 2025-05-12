import
  { createContext, // import createContext from React, this is used to create a context object for the progress context, which is used to share the progress data between components
    useState, // import useState from React, this is used to manage state in functional components
    useEffect, // import useEffect from React, this is used to manage side effects in functional components
    useContext, // import useContext from React, this is used to access the context object
    useCallback // import useCallback from React, this is used to manage callbacks in functional components
  } from 'react';

import apiService from '../services/apiService'; // import apiService from the apiService file, which is used to fetch the progress data from the backend

import { useAuth } from './AuthContext'; // import the useAuth hook, which is used to access the authentication context

export const ProgressContext = createContext(); // create the ProgressContext object, which is used to access the context object

export const ProgressProvider = ({ children }) => { // create the ProgressProvider component, which is used to provide the progress context to the app
  const { currentUser, getAuthToken } = useAuth(); // state variables for the current user and the getAuthToken function from the useAuth hook
  const [progressData, setProgressData] = useState(null); // state variables for the progress data and the setProgressData function
  const [isLoading, setIsLoading] = useState(false); // state variables for the loading state and the setIsLoading function
  const [error, setError] = useState(null); // state variables for the error and the setError function

  const fetchProgress = useCallback(async () => { // fetch the progress data from the backend
    if (!currentUser) { // if there is no current user
      setProgressData(null); // set the progress data to null
      setError(null); // set the error to null
      setIsLoading(false); // set the loading state to false
      return;
    }

    console.log("ProgressContext: fetchProgress called..."); // log the fetchProgress function being called
    setIsLoading(true); // set the loading state to true
    setError(null); // set the error to null

    try {
      const token = await getAuthToken(); // get the authentication token
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // set the config to the authentication token
      console.log(`ProgressContext: Calling GET /api/modules/progress`); // log the calling of the get progress endpoint
      const response = await apiService.get('/api/modules/progress', config); // fetch the progress data from the backend
      const newData = response.data || []; // set the new data to the response data
      console.log('ProgressContext: Received progress data:', newData); // log the received progress data
      setProgressData(newData); // set the progress data to the new data
      console.log('ProgressContext: Set progressData state.'); // log the setting of the progress data state
    } catch (err) { // catch the error
      console.error('ProgressContext: Failed to fetch module progress:', err); // log the failed to fetch module progress error
      setError('Failed to load module progress.'); // set the error to the failed to load module progress error
      setProgressData(null); // set the progress data to null
    } finally {
      setIsLoading(false); // set the loading state to false
      console.log("ProgressContext: fetchProgress finished."); // log the fetchProgress function being finished
    }
  }, [currentUser, getAuthToken]); // use the current user and the getAuthToken function as dependencies

  useEffect(() => {
    if (currentUser) { // if there is a current user
      fetchProgress(); // fetch the progress data
    }
     else { // if there is no current user 
       setProgressData(null); // set the progress data to null
       setError(null); // set the error to null
       setIsLoading(false); // set the loading state to false
     }
  }, [currentUser, fetchProgress]); // use the current user and the fetchProgress function as dependencies


  const markModuleComplete = async (moduleId, moduleName, completedStatus) => {
    if (!currentUser) { // if there is no current user
      return { error: "User not logged in" }; // return an error object
    }


    const previousProgress = progressData ? [...progressData] : []; // set the previous progress to the progress data
    setProgressData(prevData => { // set the progress data to the previous data
      if (!prevData) return [{ id: moduleId, name: moduleName, completed: completedStatus }]; // if there is no previous data, return the new data
      const existingIndex = prevData.findIndex(p => (p.id || p.moduleId) === moduleId); // find the index of the module in the previous data
      if (existingIndex > -1) { // if the existing index is greater than -1
        const newData = [...prevData]; // set the new data to the previous data 
        newData[existingIndex] = { ...newData[existingIndex], completed: completedStatus }; // set the new data to the previous data
        return newData; // return the new data
      } else { // if the existing index is less than -1
        return [...prevData, { id: moduleId, name: moduleName, completed: completedStatus }]; // return the new data
      }
    });

    try { // try to mark the module as complete
      const token = await getAuthToken(); // get the authentication token
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // set the config to the authentication token
      const endpoint = `/api/modules/${moduleId}/complete`; // set the endpoint to the complete endpoint
      await apiService.post(endpoint, { completed: completedStatus }, config); // mark the module as complete
      console.log(`ProgressContext: Marked module ${moduleId} as ${completedStatus ? 'complete' : 'incomplete'} on backend.`); // log the marking of the module as complete
    } catch (err) { // catch the error
      console.error(`ProgressContext: API error marking module ${moduleId} as complete:`, err); // log the API error marking the module as complete

      setProgressData(previousProgress); // set the progress data to the previous data

      throw err; // throw the error, if it occurs
    }
  };


  const updateTimeSpent = useCallback(async (moduleId, secondsToAdd) => { // update the time spent on the module
    console.log(`[${moduleId}] updateTimeSpent called. Seconds to add: ${secondsToAdd}s`); // log the updateTimeSpent function being called
    if (!currentUser || !moduleId || secondsToAdd <= 0) { // if there is no current user, or the module id is not valid, or the seconds to add is less than or equal to 0
        console.log(`ProgressContext: Skipping time update for ${moduleId} (${secondsToAdd}s) - invalid params or user.`); // log the skipping of the time update
        return; // return
    }
    console.log(`ProgressContext: Updating time for module ${moduleId} by ${secondsToAdd}s`); // log the updating of the time for the module
    try { // try to update the time for the module
        const token = await getAuthToken(); // get the authentication token
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // set the config to the authentication token
        
        console.log(`ProgressContext: Calling POST /api/modules/${moduleId}/update-time with body:`, { seconds: secondsToAdd }); // log the calling of the update time endpoint

        await apiService.post(`/api/modules/${moduleId}/update-time`, { // update the time for the module, by sending the seconds to add to the backend
            seconds: secondsToAdd // set the seconds to add to the seconds to add
        }, config); // update the time for the module
        
        console.log(`ProgressContext: Successfully sent ${secondsToAdd}s for ${moduleId}. Triggering refresh.`); // log the success of the update time endpoint

    } catch (err) { // catch the error
        console.error(`ProgressContext: Failed to update time for module ${moduleId}:`, err); // log the failed to update time for the module error

        setError(`Failed to save time for module ${moduleId}.`); // set the error to the failed to save time for the module error
    }
  }, [currentUser, getAuthToken]); // use the current user and the getAuthToken function as dependencies



  const resetAllModuleTimes = useCallback(async () => { // reset all module times
    if (!currentUser) { // if there is no current user
      console.warn("ProgressContext: Cannot reset times, user not logged in."); // log the cannot reset times, user not logged in error
      setError("You must be logged in to reset progress."); // set the error to the you must be logged in to reset progress error
      return; // return
    }

    console.log("ProgressContext: Attempting to reset all module times..."); // log the attempting to reset all module times
    const wasLoading = isLoading; // set the wasLoading to the isLoading state
    setIsLoading(true); // set the isLoading state to true
    setError(null); // set the error to null


    const previousProgress = progressData ? JSON.parse(JSON.stringify(progressData)) : null; // set the previous progress to the progress data
    setProgressData(prevData => { // set the progress data to the previous data
        if (!prevData) return null; // if there is no previous data, return null
        return prevData.map(module => ({ ...module, timeSpent: 0 })); // return the previous data with the time spent set to 0
    });
    console.log("ProgressContext: Reset times in local state."); // log the resetting of the times in the local state

    try { // try to reset all module times
      const token = await getAuthToken(); // get the authentication token
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // set the config to the authentication token
      console.log("ProgressContext: Calling POST /api/progress/reset-times"); // log the calling of the reset times endpoint
      await apiService.post('/api/progress/reset-times', {}, config); // reset all module times on the backend
      console.log("ProgressContext: Successfully reset all module times on backend."); // log the success of the reset times endpoint
      

      if (previousProgress) { // if there is previous progress
          console.log("ProgressContext: Clearing related session storage timer items..."); // log the clearing of the related session storage timer items
          previousProgress.forEach(module => { // loop through the previous progress
              const moduleId = module.id || module.moduleId; // set the module id to the module id from the previous progress
              if (moduleId) { // if the module id is valid
                  const sessionKey = `timer_module_${moduleId}`; // set the session key to the timer module id
                  try { // try to clear the session storage
                      sessionStorage.removeItem(sessionKey); // remove the session storage
                      console.log(`    - Cleared session storage for ${sessionKey}`); // log the clearing of the session storage
                  } catch (e) { // catch the error
                      console.warn(`    - Failed to clear session storage for ${sessionKey}:`, e); // log the failed to clear the session storage error
                  }
              }
          });
          console.log("ProgressContext: Finished clearing session storage."); // log the finished clearing of the session storage
      } else { // if there is no previous progress
          console.warn("ProgressContext: No previous progress data found to clear session storage items."); // log the no previous progress data found to clear session storage items error
      }

      
    } catch (err) { // catch the error
      console.error("ProgressContext: Failed to reset module times:", err); // log the failed to reset module times error
      setError('Failed to reset module times. Please try again.'); // set the error to the failed to reset module times error
      setProgressData(previousProgress); // set the progress data to the previous data
      console.log("ProgressContext: Reverted optimistic time reset due to error."); // log the reverted optimistic time reset due to error
    } finally {
      setIsLoading(wasLoading); // set the isLoading state to the wasLoading state
      console.log("ProgressContext: Reset times finished."); // log the reset times finished
    }
  }, [currentUser, getAuthToken, progressData, isLoading]); // use the current user, the getAuthToken function, the progress data and the isLoading state as dependencies


  const value = { // set the value of the context object
    progressData, // the progress data
    isLoading, // the loading state
    error, // the error
    fetchProgress, // the fetchProgress function
    markModuleComplete, // the markModuleComplete function
    updateTimeSpent, // the updateTimeSpent function
    resetAllModuleTimes, // the resetAllModuleTimes function
  };

  return (
    <ProgressContext.Provider value={value}> {/* provide the value of the context object to the children */}
      {children} {/* render the children */}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => { // use the useProgress hook
  return useContext(ProgressContext); // return the context object, making it available to the component that uses the useProgress hook
};
