// the main application component, which is the root that defines routes to other pages

import {
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate 
} from 'react-router-dom';

import { Box } from '@mui/material';
import { useAuth } from './context/AuthContext'; 

// import the components for the authentication pages
import Login from './components/Auth/Login'; 
import Register from './components/Auth/Register'; 

// import the header, footer, accessibility menu, and profile page
// as well as the module pages themselves (which are the main content of the application)
import Header from './components/CommonComponents/Header'; 
import HomePage from './pages/HomePage'; 
import GetStartedPage from './pages/GetStartedPage'; 
import MachineLearningPage from './pages/MachineLearningPage'; 
import EmotionDetectionPage from './pages/EmotionDetectionPage'; 
import FuzzyLogicPage from './pages/FuzzyLogicPage'; 
import Footer from './components/CommonComponents/Footer'; 
import AccessibilityMenu from './components/CommonComponents/AccessibilityMenu'; 
import ProfilePage from './pages/ProfilePage'; 

// a protected route component that checks if the user is authenticated
// if not, it redirects to the login page
const ProtectedRoute = ({ children }) => { 
  const { currentUser, loading } = useAuth(); 

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!currentUser) {
    return <Navigate to="/login" />; 
  }

  return children; 
};

function App() {
  
  return (
    <Router> 
      {/* ensure the application is wrapped in a router to allow programmatic navigation */}
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Box position="sticky" top={0} zIndex={1000} component="main" sx={{ flexGrow: 1 }}>
          <Header /> 
        </Box>
        <Box component="main" sx={{ flexGrow: 1 }} id="main-content">
          <Routes> 
            {/* the home page, which is the main page of the application */}
            {/* protected so that only logged in users can access it */}
            <Route path="/" element={ 
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } /> 
            <Route path="/get-started" element={
              <ProtectedRoute>
                <GetStartedPage />
              </ProtectedRoute>
            } /> 
            <Route path="/machine-learning" element={
              <ProtectedRoute>
                <MachineLearningPage />
              </ProtectedRoute>
            } /> 
            <Route path="/emotion-detection" element={
              <ProtectedRoute>
                <EmotionDetectionPage />
              </ProtectedRoute>
            } /> 
            <Route path="/fuzzy-logic" element={ 
              <ProtectedRoute>
                <FuzzyLogicPage />
              </ProtectedRoute>
            } /> 

            <Route path="/login" element={<Login />} /> {/* no protection, as this is the login page */}
            <Route path="/register" element={<Register />} /> {/* no protection, as this is the register page */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } /> 
          </Routes>
        </Box>
        <Footer /> 
        <AccessibilityMenu /> 
      </Box>
    </Router>
  );
}

export default App; 
