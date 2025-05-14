// define and manage the theme of the app
// when the user does this via the accessibility settings

import { 
  createContext, 
  useState, 
  useContext 
} from 'react';

// import the MUI theme provider to allow the theme to be used in the app
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

// import the themes from the theme.js file
import {
  lightTheme, 
  darkTheme
} from '../styles/Theme'; 

// define the themes
export const themes = {
  LIGHT: 'light',
  DARK: 'dark'
};

// create the theme context
const ThemeContext = createContext();

// use the theme context
export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme'); // get the saved theme from the local storage
    return savedTheme || themes.LIGHT; // return the saved theme, or the light theme if no theme is saved
  });

  const [fontSize, setFontSize] = useState(() => {
    const savedFontSize = localStorage.getItem('fontSize'); // get the saved font size from the local storage
    return savedFontSize ? parseInt(savedFontSize, 10) : 100; // return the saved font size, or 100 if no font size is saved
  });

  const [contentSpacing, setContentSpacing] = useState(() => {
    const savedSpacing = localStorage.getItem('contentSpacing'); // get the saved spacing from the local storage
    return savedSpacing ? parseInt(savedSpacing, 10) : 100; // return the saved spacing, or 100 if no spacing is saved
  });

  const [useDyslexiaFont, setUseDyslexiaFont] = useState(() => {
    const saved = localStorage.getItem('useDyslexiaFont'); // get the saved use dyslexia font from the local storage
    return saved === 'true'; // return the saved use dyslexia font, or false if no use dyslexia font is saved
  });

  const changeTheme = (newTheme) => {
    setTheme(newTheme); // set the theme to the new theme
    localStorage.setItem('theme', newTheme); // save the new theme to the local storage
  };

  const changeFontSize = (newSize) => {
    setFontSize(newSize); // set the font size to the new font size
    localStorage.setItem('fontSize', newSize.toString()); // save the new font size to the local storage
    document.documentElement.style.fontSize = `${newSize}%`;
  };

  const changeContentSpacing = (newSpacing) => {
    setContentSpacing(newSpacing); // set the content spacing to the new content spacing
    localStorage.setItem('contentSpacing', newSpacing.toString()); // save the new content spacing to the local storage
    document.documentElement.style.setProperty('--content-spacing', `${newSpacing}%`);
  };

  const toggleDyslexiaFont = () => {
    setUseDyslexiaFont(prev => {
      const newValue = !prev; // set the new value to the opposite of the previous value
      localStorage.setItem('useDyslexiaFont', newValue.toString()); // save the new use dyslexia font to the local storage
      if (newValue) { // if the new value is true
        document.body.classList.add('dyslexia-font-enabled'); // add the dyslexia font enabled class to the body
      } else { // if the new value is false
        document.body.classList.remove('dyslexia-font-enabled'); // remove the dyslexia font enabled class from the body
      }
      return newValue;
    });
  };

  const getThemeObject = () => {
    switch (theme) { // execute different theme objects based on the theme
      case themes.DARK:
        return darkTheme;
      default: // if the theme is not dark, return the light theme
        return lightTheme;
    }
  };

  return (
    // provide the theme context to the app
    <ThemeContext.Provider
      value={{
        theme,
        changeTheme,
        fontSize,
        changeFontSize,
        contentSpacing,
        changeContentSpacing,
        themes,
        useDyslexiaFont,
        toggleDyslexiaFont
      }}
    >
      {/* provide the MUI theme provider to the app */}
      <MuiThemeProvider theme={getThemeObject()}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}; 

export default ThemeProvider;
