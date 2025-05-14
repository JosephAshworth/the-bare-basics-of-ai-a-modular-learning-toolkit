// entry point of the React application
// this file initialises the app, wraps it with global context providers (auth, progress, theme),
// and renders it into the root DOM node

import React from 'react'; // import React, so that the app can be rendered
import ReactDOM from 'react-dom/client'; // import ReactDOM client for rendering
import './index.css'; // import global CSS styles
import App from './App'; // import the main App component
import { ThemeProvider } from './context/ThemeContext'; // import custom theme context provider
import { AuthProvider } from './context/AuthContext'; // import authentication context provider
import { ProgressProvider } from './context/ProgressContext'; // import progress tracking context provider
import { CssBaseline } from '@mui/material'; // consistent styling across different browsers

const root = ReactDOM.createRoot(document.getElementById('root')); // create the React root using the HTML element with id 'root'
root.render(
  <React.StrictMode> {/* enable strict mode for highlighting potential problems */}
    <AuthProvider> {/* provide global auth state */}
      <ProgressProvider> {/* provide user progress state */}
        <ThemeProvider> {/* provide global theme settings */}
          <CssBaseline />
          <App /> {/* render the main App component */}
        </ThemeProvider>
      </ProgressProvider>
    </AuthProvider>
  </React.StrictMode>
);
