import React, { useState, useEffect, useCallback } from 'react';
import { auth } from '../../firebase';
import { doc, getDoc, updateDoc, deleteDoc, getFirestore } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { signOut, updateProfile, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import apiService from '../../services/apiService';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modules, setModules] = useState([]);
  const [moduleLoading, setModuleLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [password, setPassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();
  
  // Get a reference to the Firestore database
  const db = getFirestore();

  // Create a memoized fetchModuleProgress function
  const fetchModuleProgress = useCallback(async (token) => {
    setModuleLoading(true);
    try {
      console.log('Fetching module progress...');
      const moduleResponse = await apiService.get('/api/modules/progress', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Module progress response:', moduleResponse.data);
      
      // Check if we got valid data back
      if (!moduleResponse.data || !Array.isArray(moduleResponse.data)) {
        console.error('Invalid module data format received:', moduleResponse.data);
        setModules([]);
        return;
      }
      
      // Filter out the "welcome" module from the displayed modules
      const filteredModules = moduleResponse.data.filter(module => module.id !== 'welcome');
      console.log('Filtered modules:', filteredModules);
      
      setModules(filteredModules);
    } catch (error) {
      console.error("Error fetching module progress:", error);
      if (error.response) {
        console.error('Module progress error response:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('Module progress no response received:', error.request);
      } else {
        console.error('Module progress error details:', error.message);
      }
      // Don't show the error on the UI since it's not critical
      // Still set modules to empty array to avoid the perpetual loading state
      setModules([]);
    } finally {
      setModuleLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setLoading(true);
        try {
          // Use Firebase Auth data directly instead of API call
          setUser({
            displayName: currentUser.displayName,
            email: currentUser.email,
            uid: currentUser.uid
          });
          setDisplayName(currentUser.displayName || '');
          
          // Fetch module progress
          const token = await currentUser.getIdToken();
          fetchModuleProgress(token);
        } catch (error) {
          console.error("Error setting up user data:", error);
          setError("Failed to load user profile details");
        } finally {
          setLoading(false);
        }
      } else {
        // User is not logged in, redirect to login
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate, fetchModuleProgress]);
  
  // Effect to immediately fetch fresh data when component mounts or gains focus
  useEffect(() => {
    // Immediately fetch data when component mounts, with a slight delay
    const fetchInitialData = async () => {
      // Wait a fraction of a second (e.g., 300ms) to increase the likelihood
      // that the stopTimer API call from the previous page has completed.
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Check if component is still mounted and page is visible
      if (auth.currentUser && document.visibilityState === 'visible') { 
        try {
          const token = await auth.currentUser.getIdToken();
          fetchModuleProgress(token);
        } catch (err) {
          console.error("Error fetching initial module data after delay:", err);
        }
      }
    };
    
    // Fetch data shortly after component mounts
    fetchInitialData();

    const handleVisibilityChange = async () => {
      // Only fetch if the page becomes visible
      if (document.visibilityState === 'visible' && auth.currentUser) {
        try {
          const token = await auth.currentUser.getIdToken();
          fetchModuleProgress(token);
        } catch (err) {
          console.error("Error refreshing module data on visibility change:", err);
        }
      }
    };
    
    const handleFocus = async () => {
      // Fetch when the window gains focus, but only if visible
      if (auth.currentUser && document.visibilityState === 'visible') {
        try {
          const token = await auth.currentUser.getIdToken();
          fetchModuleProgress(token);
        } catch (err) {
          console.error("Error refreshing module data on focus:", err);
        }
      }
    };
    
    // Register event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    // Cleanup function
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchModuleProgress]); // Dependency array includes fetchModuleProgress
  
  // Add a retry function to try again if module loading fails
  const retryLoadModules = useCallback(async () => {
    if (!auth.currentUser) return;
    
    try {
      const token = await auth.currentUser.getIdToken();
      fetchModuleProgress(token);
    } catch (err) {
      console.error("Error retrying module load:", err);
    }
  }, [fetchModuleProgress]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      setError("Failed to sign out");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error('No user is signed in');
      }
      
      // Update displayName in Auth profile
      await updateProfile(currentUser, {
        displayName: displayName
      });
      
      // Update local state
      setUser({
        ...user,
        displayName: displayName
      });
      
      setSuccess('Profile updated successfully');
      setEditing(false);
    } catch (error) {
      setError(error.message);
    }
  };

  // Format time spent in a readable format
  const formatTimeSpent = (seconds) => {
    if (!seconds || seconds <= 0) {
      return 'No time recorded';
    }
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };
  
  // Calculate total time spent across all modules
  const getTotalTimeSpent = () => {
    if (!modules || modules.length === 0) return 0;
    return modules.reduce((total, module) => total + (module.timeSpent || 0), 0);
  };

  // Function to record module time for analytics
  const recordModuleTime = async (moduleId) => {
    try {
      if (!auth.currentUser) return;
      
      const token = await auth.currentUser.getIdToken();
      
      // Start the timer for the module
      await apiService.post(`/api/modules/${moduleId}/start-timer`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh module data
      fetchModuleProgress(token);
    } catch (err) {
      console.error("Error recording module time:", err);
    }
  };
  
  // Function to stop recording module time
  const stopModuleTimer = async (moduleId) => {
    try {
      if (!auth.currentUser) return;
      
      const token = await auth.currentUser.getIdToken();
      
      // Stop the timer for the module
      await apiService.post(`/api/modules/${moduleId}/stop-timer`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh module data
      fetchModuleProgress(token);
    } catch (err) {
      console.error("Error stopping module timer:", err);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    
    if (!password) {
      setError('Please enter your password to confirm account deletion');
      return;
    }
    
    setDeleteLoading(true);
    setError('');
    
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error('No user is signed in');
      }
      
      // Re-authenticate the user before deletion
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        password
      );
      
      await reauthenticateWithCredential(currentUser, credential);
      
      // Get ID token for API calls
      const token = await currentUser.getIdToken();
      
      // Call backend to delete user data
      try {
        await apiService.post('/api/auth/delete-account', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (apiError) {
        console.error("Error calling delete account API:", apiError);
        // Continue with account deletion even if the API call fails
      }
      
      // Delete the user's Firestore data using the client SDK as backup
      try {
        // Delete user progress
        const progressRef = doc(db, 'user_progress', currentUser.uid);
        await deleteDoc(progressRef);
        
        // Delete user document if it exists
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          await deleteDoc(userRef);
        }
      } catch (dbError) {
        console.error("Error deleting user data with client SDK:", dbError);
        // Continue with account deletion even if data deletion fails
      }
      
      // Delete the user account
      await deleteUser(currentUser);
      
      // Redirect to homepage or login
      navigate('/login');
    } catch (error) {
      console.error("Error deleting account:", error);
      
      // Handle specific error codes
      if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError(error.message || 'Failed to delete account. Please try again.');
      }
      
      setDeleteLoading(false);
    }
  };

  const toggleDeleteConfirm = () => {
    setShowDeleteConfirm(!showDeleteConfirm);
    setPassword('');
    setError('');
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading profile...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">User Profile</h2>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 text-green-700 p-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        {editing ? (
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Display Name</label>
              <input 
                type="text" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                value={user?.email || ''}
                disabled
                className="w-full p-2 border rounded bg-gray-100"
              />
              <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            <div className="flex space-x-4">
              <button 
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
              <button 
                type="button"
                onClick={() => {
                  setEditing(false);
                  setDisplayName(user?.displayName || '');
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="mb-4">
              <h3 className="text-gray-600 text-sm">Display Name</h3>
              <p className="text-lg">{user?.displayName || 'Not set'}</p>
            </div>
            <div className="mb-6">
              <h3 className="text-gray-600 text-sm">Email</h3>
              <p className="text-lg">{user?.email}</p>
            </div>
            <button 
              onClick={() => setEditing(true)}
              className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 w-full sm:w-auto"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
      
      {/* Module Progress Tracker */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Your Module Progress</h3>
          <button 
            onClick={retryLoadModules} 
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            Refresh
          </button>
        </div>
        
        {moduleLoading ? (
          <div className="py-6 text-center">
            <p>Loading your modules...</p>
          </div>
        ) : modules.length > 0 ? (
          <div className="space-y-4">
            {modules.map((module) => (
              <div key={module.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-lg">{module.name}</h4>
                  {module.completed ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                      Completed
                    </span>
                  ) : (
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                      In Progress
                    </span>
                  )}
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                  <span>
                    Time spent: {formatTimeSpent(module.timeSpent || 0)}
                  </span>
                </div>
                
                <div className="flex justify-end mt-2">
                  <a 
                    href={module.path} 
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {module.completed ? 'Review Module' : 'Continue Learning'}
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-3">No module progress found</p>
            <div className="space-y-3">
              <button 
                onClick={retryLoadModules}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
              >
                Search for Modules
              </button>
              
              <div className="pt-4 text-sm text-gray-500">
                <p>You can also access modules directly:</p>
                <div className="flex flex-col mt-2 space-y-2">
                  <a href="/machine-learning" className="text-blue-600 hover:underline">Machine Learning</a>
                  <a href="/emotion-detection" className="text-blue-600 hover:underline">Emotion Detection</a>
                  <a href="/fuzzy-logic" className="text-blue-600 hover:underline">Fuzzy Logic</a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Module Time Stats */}
      {modules.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Module Viewing Statistics</h3>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 font-medium">Total Viewing Time</p>
              <p className="text-2xl font-bold text-blue-900">{formatTimeSpent(getTotalTimeSpent())}</p>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Module
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time Spent
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {modules.sort((a, b) => (b.timeSpent || 0) - (a.timeSpent || 0)).map((module) => (
                    <tr key={module.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{module.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatTimeSpent(module.timeSpent || 0)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {module.completed ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Completed
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            In Progress
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="text-gray-500 text-xs italic text-center mt-2">
              Time is tracked when you actively view module content, not including time spent away or in other tabs.
            </div>
          </div>
        </div>
      )}

      {/* Account Management Section */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Account Management</h3>
        
        {showDeleteConfirm ? (
          <div className="space-y-6">
            <p className="text-red-600 text-sm font-medium mb-4">
              Warning: This action is permanent and cannot be undone. All your data will be permanently deleted.
            </p>

            <form onSubmit={handleDeleteAccount} className="space-y-6">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Enter your password to confirm</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Password"
                  required
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button 
                  type="submit"
                  disabled={deleteLoading}
                  className="bg-red-500 text-white text-sm px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50 whitespace-nowrap"
                >
                  {deleteLoading ? 'Deleting...' : 'Permanently Delete Account'}
                </button>
                <button 
                  type="button"
                  onClick={toggleDeleteConfirm}
                  className="bg-gray-300 text-gray-700 text-sm px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <button 
              onClick={toggleDeleteConfirm}
              className="text-red-500 hover:text-red-700 text-sm underline"
            >
              Delete Account
            </button>
          </div>
        )}
      </div>
      
      <div className="text-center mt-6">
        <button 
          onClick={handleLogout}
          className="text-red-500 hover:text-red-700 text-sm px-4 py-2 rounded"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default UserProfile; 