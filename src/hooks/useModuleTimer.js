import { useEffect, useState, useRef } from 'react';
import { auth } from '../firebase';
import axios from 'axios';

/**
 * Custom hook to track time spent on module pages
 * Automatically handles starting and stopping timer based on:
 * - Component mount/unmount
 * - Page visibility changes (tab switching)
 * - Before page unload
 * - Auth state changes
 * - Navigation to other pages
 * 
 * @param {string} moduleId - The ID of the module being viewed
 */
const useModuleTimer = (moduleId) => {
  const [timerStarted, setTimerStarted] = useState(false);
  const isStartingTimerRef = useRef(false);
  const isStoppingTimerRef = useRef(false);
  const lastVisibilityState = useRef(document.visibilityState);

  useEffect(() => {
    let isMounted = true;
    let timerStopped = false;
    
    const startTimer = async () => {
      try {
        // Prevent multiple simultaneous start requests
        if (isStartingTimerRef.current) return;
        
        // Only start if user is logged in, timer not already started, and not already stopped
        if (!auth.currentUser || timerStarted || timerStopped) return;
        
        // Set flag to prevent duplicate calls
        isStartingTimerRef.current = true;
        
        const token = await auth.currentUser.getIdToken();
        
        // Start the timer for the module
        await axios.post(`/api/modules/${moduleId}/start-timer`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (isMounted) {
          setTimerStarted(true);
          console.log(`Started timer for module: ${moduleId}`);
        }
      } catch (err) {
        console.error("Error starting module timer:", err);
      } finally {
        isStartingTimerRef.current = false;
      }
    };

    const stopTimer = async () => {
      try {
        // Prevent multiple simultaneous stop requests
        if (isStoppingTimerRef.current) return;
        
        // Only stop if user is logged in and timer was started
        if (!auth.currentUser || !timerStarted || timerStopped) return;
        
        // Set flags to prevent duplicate calls
        isStoppingTimerRef.current = true;
        timerStopped = true;
        
        const token = await auth.currentUser.getIdToken();
        
        // Stop the timer for the module
        await axios.post(`/api/modules/${moduleId}/stop-timer`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (isMounted) {
          setTimerStarted(false);
          console.log(`Stopped timer for module: ${moduleId}`);
        }
      } catch (err) {
        console.error("Error stopping module timer:", err);
        // Even if there was an error, consider the timer stopped on the client side
        if (isMounted) {
          setTimerStarted(false);
        }
      } finally {
        isStoppingTimerRef.current = false;
      }
    };

    // Handle page visibility changes (user switching tabs or clicking away)
    const handleVisibilityChange = () => {
      const currentVisibility = document.visibilityState;
      
      // Only react to actual changes in visibility
      if (currentVisibility === lastVisibilityState.current) return;
      
      console.log(`Visibility changed from ${lastVisibilityState.current} to ${currentVisibility}`);
      lastVisibilityState.current = currentVisibility;
      
      if (currentVisibility === 'visible') {
        // Only start if we were previously not visible
        startTimer();
      } else {
        // Page is hidden, stop the timer
        stopTimer();
      }
    };

    // Handle page unload (user closing tab/navigating away)
    const handleBeforeUnload = () => {
      stopTimer();
    };
    
    // Handle React router navigation (single page app navigation)
    const handleRouteChange = () => {
      stopTimer();
    };
    
    // Handle auth state changes
    const handleAuthChange = (user) => {
      if (user) {
        // Only start the timer if the page is visible
        if (document.visibilityState === 'visible') {
          startTimer();
        }
      } else {
        // User logged out, make sure timer is stopped
        timerStopped = true;
        setTimerStarted(false);
      }
    };

    // Start timer when component mounts, but only if the page is visible
    if (document.visibilityState === 'visible') {
      startTimer();
    }

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Listen for React navigation events
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;
    
    window.history.pushState = function() {
      handleRouteChange();
      return originalPushState.apply(this, arguments);
    };
    
    window.history.replaceState = function() {
      handleRouteChange();
      return originalReplaceState.apply(this, arguments);
    };
    
    window.addEventListener('popstate', handleRouteChange);
    
    // Subscribe to auth state changes
    const unsubscribeAuth = auth.onAuthStateChanged(handleAuthChange);

    // Clean up by stopping timer and removing event listeners when component unmounts
    return () => {
      isMounted = false;
      stopTimer();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handleRouteChange);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      unsubscribeAuth();
    };
  }, [moduleId, timerStarted]); // Re-run if moduleId or timerStarted changes
};

export default useModuleTimer; 