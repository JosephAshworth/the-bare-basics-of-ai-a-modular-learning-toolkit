// hook to track the time spent on a module page

import {
  useEffect,
  useState,
  useRef,
  useCallback
} from 'react';

// import the progress context to get the progress data
import { useProgress } from '../context/ProgressContext';

const ModuleTimer = (moduleId) => {
  const { progressData } = useProgress();
  
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  
  const timerIntervalRef = useRef(null); // reference to store the interval ID for the timer, allowing it to be cleared when needed
  const secondsCounterRef = useRef(0); // reference to keep track of the elapsed seconds without causing re-renders
  const isMountedRef = useRef(false); // reference to track if the component is currently mounted, ensuring actions are only performed when mounted
  const sessionKey = useRef(`timer_module_${moduleId}`); // reference to store a unique session key for saving and retrieving timer state from sessionStorage

  useEffect(() => {
    if (progressData && !isMountedRef.current) { // if the progress data exists and the component is not mounted
      const moduleInfo = progressData.find(p => (p.id || p.moduleId) === moduleId); // find the module info in the progress data
      const initialTime = moduleInfo ? moduleInfo.timeSpent || 0 : 0; // get the initial time from the module info, or 0 if no time is available
      console.log(`[${moduleId}] Initialising timer. Found initial time: ${initialTime}s`); // log the initial time
      setElapsedSeconds(initialTime); // set the elapsed seconds to the initial time
    }
  }, [progressData, moduleId]);

  const getTimeChunk = useCallback(() => {
    const seconds = secondsCounterRef.current; // get the current elapsed seconds
    console.log(`[${moduleId}] getTimeChunk called. Returning ${seconds}s`); // log the current elapsed seconds
    secondsCounterRef.current = 0; // reset the seconds counter
    return seconds; // return the current elapsed seconds
  }, [moduleId]);

  
  const startTimer = useCallback(() => {
    if (timerIntervalRef.current || !isMountedRef.current) return;
    console.log(`[${moduleId}] Starting timer interval.`);
    setTimerActive(true);
    timerIntervalRef.current = setInterval(() => { // set the interval to increment the elapsed seconds by 1 every second
      setElapsedSeconds(prev => {
        const newSeconds = prev + 1; // increment the elapsed seconds by 1
        try {
             sessionStorage.setItem(sessionKey.current, newSeconds.toString()); // save the new elapsed seconds to sessionStorage
        } catch (e) { console.warn(`[${moduleId}] Failed to update session storage:`, e) } // log any errors that occur when saving to sessionStorage
        return newSeconds; // return the new elapsed seconds
      });
      secondsCounterRef.current += 1; // increment the seconds counter by 1
    }, 1000); // set the interval to 1 second
  }, [moduleId]);

  const pauseTimer = useCallback(() => {
    if (!timerIntervalRef.current) return; // if the timer interval is not set, return
    console.log(`[${moduleId}] Pausing timer interval.`);
    clearInterval(timerIntervalRef.current); // clear the interval
    timerIntervalRef.current = null; // set the timer interval to null
    setTimerActive(false); // set the timer active state to false
  }, [moduleId]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!isMountedRef.current) return; // if the component is not mounted, return
      
      if (document.visibilityState === 'visible') { // if the page is visible
        console.log(`[${moduleId}] Page became visible.`);
        startTimer(); // start the timer
      } else {
        console.log(`[${moduleId}] Page became hidden.`);
        pauseTimer(); // pause the timer
      }
    };
    
    // when the window loses focus
    const handleWindowBlur = () => {
      if (!isMountedRef.current) return; // if the component is not mounted, return
      console.log(`[${moduleId}] Window lost focus (blur). Pausing timer.`);
      pauseTimer(); // pause the timer
    };

    // when the window gains focus
    const handleWindowFocus = () => {
      if (!isMountedRef.current) return; // if the component is not mounted, return
      if (document.visibilityState === 'visible') { // if the page is visible
        console.log(`[${moduleId}] Window gained focus and page is visible. Starting timer.`);
        startTimer(); // start the timer
      } else {
        console.log(`[${moduleId}] Window gained focus but page is hidden. Timer remains paused.`);
      } // keep the timer paused if the page is hidden
    };
    
    // event listeners for the visibility change, window blur, and window focus events
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [moduleId, startTimer, pauseTimer]);

  useEffect(() => {
    isMountedRef.current = true;
    console.log(`[${moduleId}] Timer hook mounted.`);
    
    let contextTime = 0; // Initialise the context time to zero, representing no recorded time initially
    if (progressData) {
      const moduleInfo = progressData.find(p => (p.id || p.moduleId) === moduleId); // find the module info in the progress data
      contextTime = moduleInfo ? moduleInfo.timeSpent || 0 : 0; // get the context time from the module info, or 0 if no time is available
      console.log(`[${moduleId}] Context time available: ${contextTime}s`);
    }

    let sessionTime = 0; // Initialise the session time to zero, representing no recorded time in the current session initially
    try {
        const sessionValue = sessionStorage.getItem(sessionKey.current); // get the session value from sessionStorage
        if (sessionValue !== null) { // if the session value is not null
            const parsedTime = parseInt(sessionValue, 10); // parse the session value as an integer
            if (!isNaN(parsedTime) && parsedTime >= 0) { // if the parsed time is not NaN and is greater than or equal to 0
                sessionTime = parsedTime; // set the session time to the parsed time
                console.log(`[${moduleId}] Session storage time available: ${sessionTime}s`);
            }
        }
    } catch(e) {
        console.warn(`[${moduleId}] Failed to read session storage:`, e)
    }

    // if the page is visible, start the timer
    if (document.visibilityState === 'visible') {
       console.log(`[${moduleId}] Starting timer on mount (visible).`);
       startTimer();
    }
    else {
       console.log(`[${moduleId}] Timer mounted but page hidden, waiting for visibility.`);
    }

    return () => {
      isMountedRef.current = false;
      console.log(`[${moduleId}] Cleaning up timer on unmount (only pauses interval).`);
      pauseTimer();
    };
  }, [moduleId, startTimer, pauseTimer, progressData]);

  return { timerActive, elapsedSeconds, getTimeChunk };
};

export default ModuleTimer;