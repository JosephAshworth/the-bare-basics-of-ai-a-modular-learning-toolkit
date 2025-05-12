import {
  useEffect, // import useEffect from React, this is used to manage side effects in functional components
  useState, // import useState from React, this is used to manage state in functional components
  useRef, // import useRef from React, this is used to create a reference to a value
  useCallback // import useCallback from React, this is used to manage callbacks in functional components
} from 'react';

import { useProgress } from '../context/ProgressContext'; // import the useProgress hook from the ProgressContext file, used to track the progress time spent on a module

const useModuleTimer = (moduleId) => { // define the useModuleTimer hook, which is used to track the time spent on a module
  const { progressData } = useProgress(); // get the progress data from the useProgress hook
  
  const [elapsedSeconds, setElapsedSeconds] = useState(0); // state variable for the elapsed seconds
  const [timerActive, setTimerActive] = useState(false); // state variable for the timer active
  
  const timerIntervalRef = useRef(null); // reference to the timer interval
  const secondsCounterRef = useRef(0); // reference to the seconds counter
  const isMountedRef = useRef(false); // reference to whether the timer is mounted or not
  const sessionKey = useRef(`timer_module_${moduleId}`); // reference to the session key

  useEffect(() => {
    if (progressData && !isMountedRef.current) { // if the progress data is available and the component is not mounted
      const moduleInfo = progressData.find(p => (p.id || p.moduleId) === moduleId); // find the module info in the progress data
      const initialTime = moduleInfo ? moduleInfo.timeSpent || 0 : 0; // get the initial time from the module info
      console.log(`[${moduleId}] Initialising timer. Found initial time: ${initialTime}s`); // log the initial time
      setElapsedSeconds(initialTime); // set the elapsed seconds to the initial time
    }
  }, [progressData, moduleId]); // use the progress data and the module id as dependencies

  const getTimeChunk = useCallback(() => { // define the getTimeChunk function, which is used to get the time chunk (the time spent on the module)
      const seconds = secondsCounterRef.current; // get the seconds from the seconds counter
      console.log(`[${moduleId}] getTimeChunk called. Returning ${seconds}s`); // log the seconds
      secondsCounterRef.current = 0; // reset the seconds counter
      return seconds; // return the seconds
  }, [moduleId]); // use the module id as a dependency

  const startTimer = useCallback(() => { // define the startTimer function, which is used to start the timer
    if (timerIntervalRef.current || !isMountedRef.current) return; // if the timer is already running or the component is not mounted, return
    console.log(`[${moduleId}] Starting timer interval.`); // log the start of the timer
    setTimerActive(true); // set the timer active
    timerIntervalRef.current = setInterval(() => { // set the timer interval
      setElapsedSeconds(prev => { // set the elapsed seconds
        const newSeconds = prev + 1; // increment the seconds
        try {
             sessionStorage.setItem(sessionKey.current, newSeconds.toString()); // update the session storage
        } catch (e) { console.warn(`[${moduleId}] Failed to update session storage:`, e) } // log the error if the session storage is not updated
        return newSeconds; // return the new seconds
      });
      secondsCounterRef.current += 1; // increment the seconds counter
    }, 1000); // set the interval to 1 second
  }, [moduleId]); // use the module id as a dependency

  const pauseTimer = useCallback(() => { // define the pauseTimer function, which is used to pause the timer
    if (!timerIntervalRef.current) return; // if the timer is not running, return
    console.log(`[${moduleId}] Pausing timer interval.`); // log the pause of the timer
    clearInterval(timerIntervalRef.current); // clear the timer interval
    timerIntervalRef.current = null; // set the timer interval to null
    setTimerActive(false); // set the timer active to false
  }, [moduleId]); // use the module id as a dependency

  useEffect(() => { // use the useEffect hook, which is used to manage side effects in functional components
    const handleVisibilityChange = () => { // define the handleVisibilityChange function, which is used to handle the visibility change
      if (!isMountedRef.current) return; // if the component is not mounted, return
      
      if (document.visibilityState === 'visible') { // if the page is visible
        console.log(`[${moduleId}] Page became visible.`); // log the visibility change
        startTimer(); // start the timer
      } else { // if the page is not visible
        console.log(`[${moduleId}] Page became hidden.`); // log the visibility change
        pauseTimer(); // pause the timer
      }
    };
    
    const handleWindowBlur = () => { // define the handleWindowBlur function, which is used to handle the window blur (when the window is not focused)
      if (!isMountedRef.current) return; // if the component is not mounted, return
      console.log(`[${moduleId}] Window lost focus (blur). Pausing timer.`); // log the blur event
      pauseTimer(); // pause the timer
    };

    const handleWindowFocus = () => { // define the handleWindowFocus function, which is used to handle the window focus (when the window is focused)
      if (!isMountedRef.current) return; // if the component is not mounted, return
      if (document.visibilityState === 'visible') { // if the page is visible
        console.log(`[${moduleId}] Window gained focus and page is visible. Starting timer.`); // log the focus event
        startTimer(); // start the timer
      } else { // if the page is not visible
        console.log(`[${moduleId}] Window gained focus but page is hidden. Timer remains paused.`); // log the focus event
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange); // add the visibility change event listener
    window.addEventListener('blur', handleWindowBlur); // add the blur event listener
    window.addEventListener('focus', handleWindowFocus); // add the focus event listener

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange); // remove the visibility change event listener
      window.removeEventListener('blur', handleWindowBlur); // remove the blur event listener
      window.removeEventListener('focus', handleWindowFocus); // remove the focus event listener
    };
  }, [moduleId, startTimer, pauseTimer]); // use the module id, startTimer, pauseTimer as dependencies

  useEffect(() => {
    isMountedRef.current = true; // set the is mounted to true
    console.log(`[${moduleId}] Timer hook mounted.`); // log the mount of the timer
    
    let contextTime = 0; // set the context time to 0
    if (progressData) { // if the progress data is available
      const moduleInfo = progressData.find(p => (p.id || p.moduleId) === moduleId); // find the module info in the progress data
      contextTime = moduleInfo ? moduleInfo.timeSpent || 0 : 0; // get the context time from the module info
      console.log(`[${moduleId}] Context time available: ${contextTime}s`); // log the context time
    }

    let sessionTime = 0; // set the session time to 0
    try {
        const sessionValue = sessionStorage.getItem(sessionKey.current); // get the session value from the session storage
        if (sessionValue !== null) { // if the session value is not null
            const parsedTime = parseInt(sessionValue, 10); // parse the session value to an integer
            if (!isNaN(parsedTime) && parsedTime >= 0) { // if the parsed time is not NaN and is greater than or equal to 0
                sessionTime = parsedTime; // set the session time to the parsed time
                console.log(`[${moduleId}] Session storage time available: ${sessionTime}s`); // log the session time
            }
        }
    } catch(e) { // catch the error
        console.warn(`[${moduleId}] Failed to read session storage:`, e) // log the error
    }



    
    if (document.visibilityState === 'visible') { // if the page is visible
       console.log(`[${moduleId}] Starting timer on mount (visible).`); // log the start of the timer
       startTimer(); // start the timer
    }
    else { // if the page is not visible
       console.log(`[${moduleId}] Timer mounted but page hidden, waiting for visibility.`); // log the waiting for visibility
    }

    return () => {
      isMountedRef.current = false; // set the is mounted to false
      console.log(`[${moduleId}] Cleaning up timer on unmount (only pauses interval).`); // log the cleanup of the timer
      pauseTimer(); // pause the timer
    };
  }, [moduleId, startTimer, pauseTimer, progressData]); // use the module id, startTimer, pauseTimer, progressData as dependencies

  return { timerActive, elapsedSeconds, getTimeChunk }; // return the timerActive, elapsedSeconds, getTimeChunk
};

export default useModuleTimer; // export the useModuleTimer hook, so it can be used in other components
