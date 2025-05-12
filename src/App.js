import {
  BrowserRouter as Router, // import browser router for handling routing
  Routes, // import routes to define available routes
  Route, // import route to declare each individual route
  Navigate // import navigate to redirect users programmatically
} from 'react-router-dom';

import { useAuth } from './context/AuthContext'; // import useAuth to access the authentication context, which checks if the user is authenticated


import Login from './components/Auth/Login'; // import login component
import Register from './components/Auth/Register'; // import register component


import Header from './components/CommonComponents/Header'; // import header component
import HomePage from './pages/HomePage'; // import home page component
import WelcomePage from './pages/WelcomePage'; // import welcome page component
import MachineLearningPage from './pages/MachineLearningPage'; // import machine learning page component
import EmotionDetectionPage from './pages/EmotionDetectionPage'; // import emotion detection page component
import FuzzyLogicPage from './pages/FuzzyLogicPage'; // import fuzzy logic page component
import Footer from './components/CommonComponents/Footer'; // import footer component
import AccessibilityMenu from './components/CommonComponents/AccessibilityMenu'; // import accessibility menu component
import ProfilePage from './pages/ProfilePage'; // import profile page component



const ProtectedRoute = ({ children }) => { // create a protected route component, which only allows access to authenticated users
  const { currentUser, loading } = useAuth(); // get the current user and loading state from the authentication context

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>; // if the loading state is true, return a loading message
  }

  if (!currentUser) {
    return <Navigate to="/login" />; // if the user is not authenticated, redirect to the login page
  }

  return children; // return the children components, which are the components that are protected by the protected route
};

function App() {
  
  return (
    <Router> {/* wrap the app in a router */}
      <div className="min-h-screen flex flex-col">
        <div className="sticky top-0 z-50">
          <Header /> {/* render the header component */}
        </div>
        <main className="flex-grow" id="main-content" data-content-spacing> {/* render the main component */}
          <Routes> {/* render the routes */}
            <Route path="/" element={ 
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } /> {/* render the home page component, once authenticated */}
            <Route path="/welcome" element={
              <ProtectedRoute>
                <WelcomePage />
              </ProtectedRoute>
            } /> {/* render the welcome page component, once authenticated */}
            <Route path="/machine-learning" element={
              <ProtectedRoute>
                <MachineLearningPage />
              </ProtectedRoute>
            } /> {/* render the machine learning page component, once authenticated */}
            <Route path="/emotion-detection" element={
              <ProtectedRoute>
                <EmotionDetectionPage />
              </ProtectedRoute>
            } /> {/* render the emotion detection page component, once authenticated */}
            <Route path="/fuzzy-logic" element={ 
              <ProtectedRoute>
                <FuzzyLogicPage />
              </ProtectedRoute>
            } /> {/* render the fuzzy logic page component, once authenticated */}

            <Route path="/login" element={<Login />} /> {/* render the login page component */}
            <Route path="/register" element={<Register />} /> {/* render the register page component */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } /> {/* render the profile page component, once authenticated */}
          </Routes>
        </main>
        <Footer /> {/* render the footer component */}
        <AccessibilityMenu /> {/* render the accessibility menu component */}
      </div>
    </Router>
  );
}

export default App; // export the App component as the default export, so it can be used in other files
