import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth } from './firebase';

// Auth components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import UserProfile from './components/Auth/UserProfile';

// Layout components
import Header from './components/CommonComponents/Header';
import HomePage from './pages/HomePage';
import WelcomePage from './pages/WelcomePage';
import MachineLearningPage from './pages/MachineLearningPage';
import EmotionDetectionPage from './pages/EmotionDetectionPage';
import FuzzyLogicPage from './pages/FuzzyLogicPage';
import AdminPage from './pages/AdminPage';
import Footer from './components/CommonComponents/Footer';
import AccessibilityMenu from './components/CommonComponents/AccessibilityMenu';
import { useThemeContext } from './context/ThemeContext';

// Import the AdminToolsPage
import AdminToolsPage from './pages/AdminToolsPage';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  const { theme } = useThemeContext();
  
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <div className="sticky top-0 z-50">
          <Header />
        </div>
        <main className="flex-grow" id="main-content" data-content-spacing>
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
            <Route path="/welcome" element={
              <ProtectedRoute>
                <WelcomePage />
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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminToolsPage />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
        <AccessibilityMenu />
      </div>
    </Router>
  );
}

export default App; 