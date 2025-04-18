import React, { createContext, useState, useContext, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme, accessibleTheme } from '../styles/theme';

// Available themes
export const themes = {
  LIGHT: 'light',
  DARK: 'dark',
  ACCESSIBLE: 'accessible',
};

// Create context
const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Get saved theme from localStorage or default to light
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || themes.LIGHT;
  });

  // Get saved font size from localStorage or default to normal
  const [fontSize, setFontSize] = useState(() => {
    const savedFontSize = localStorage.getItem('fontSize');
    return savedFontSize ? parseInt(savedFontSize, 10) : 100;
  });

  // Get saved content spacing from localStorage or default to normal
  const [contentSpacing, setContentSpacing] = useState(() => {
    const savedSpacing = localStorage.getItem('contentSpacing');
    return savedSpacing ? parseInt(savedSpacing, 10) : 100;
  });

  // Function to change theme
  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Apply body class for CSS styling
    if (newTheme === themes.DARK) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('accessible-mode');
    } else if (newTheme === themes.ACCESSIBLE) {
      document.body.classList.add('accessible-mode');
      document.body.classList.remove('dark-mode');
    } else {
      document.body.classList.remove('dark-mode', 'accessible-mode');
    }
  };

  // Function to change font size
  const changeFontSize = (newSize) => {
    setFontSize(newSize);
    localStorage.setItem('fontSize', newSize.toString());
    document.documentElement.style.fontSize = `${newSize}%`;
  };

  // Function to change content spacing
  const changeContentSpacing = (newSpacing) => {
    setContentSpacing(newSpacing);
    localStorage.setItem('contentSpacing', newSpacing.toString());
    document.documentElement.style.setProperty('--content-spacing', `${newSpacing}%`);
  };

  // Set initial state on mount
  useEffect(() => {
    // Apply theme
    changeTheme(theme);
    
    // Apply font size
    document.documentElement.style.fontSize = `${fontSize}%`;
    
    // Set initial CSS variable for content spacing
    document.documentElement.style.setProperty('--content-spacing', `${contentSpacing}%`);
    
    // Add CSS variable to root
    const rootStyle = document.documentElement.style;
    rootStyle.setProperty('--content-spacing', `${contentSpacing}%`);
  }, []);

  // Get current theme object
  const getThemeObject = () => {
    switch (theme) {
      case themes.DARK:
        return darkTheme;
      case themes.ACCESSIBLE:
        return accessibleTheme;
      default:
        return lightTheme;
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        changeTheme,
        fontSize,
        changeFontSize,
        contentSpacing,
        changeContentSpacing,
        themes,
      }}
    >
      <MuiThemeProvider theme={getThemeObject()}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}; 