import
  { createContext, // import createContext from React, this is used to create a context object for the theme
    useState, // import useState from React, this is used to manage state in functional components
    useContext // import useContext from React, this is used to access the context object
  } from 'react';

import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'; // import the ThemeProvider as MuiThemeProvider from @mui/material/styles, which is used to provide the themes to the app

import {
  lightTheme, // import the lightTheme from the theme file
  darkTheme, // import the darkTheme from the theme file
  accessibleTheme // import the accessibleTheme from the theme file
} from '../styles/theme'; 

export const themes = {
  LIGHT: 'light', // the light theme
  DARK: 'dark', // the dark theme
  ACCESSIBLE: 'accessible', // the accessible theme
};

const ThemeContext = createContext(); // create the ThemeContext object

export const useThemeContext = () => useContext(ThemeContext); // use the useThemeContext hook, allowing the component to access the theme context

export const ThemeProvider = ({ children }) => { // create the ThemeProvider component, which is used to provide the theme context to the app
  const [theme, setTheme] = useState(() => { // state variable for the theme
    const savedTheme = localStorage.getItem('theme'); // get the saved theme from the localStorage
    return savedTheme || themes.LIGHT; // return the saved theme or the light theme
  });


  const [fontSize, setFontSize] = useState(() => { // state variable for the font size
    const savedFontSize = localStorage.getItem('fontSize'); // get the saved font size from the localStorage
    return savedFontSize ? parseInt(savedFontSize, 10) : 100; // return the saved font size or 100 if there is no saved font size
  });


  const [contentSpacing, setContentSpacing] = useState(() => { // state variable for the content spacing
    const savedSpacing = localStorage.getItem('contentSpacing'); // get the saved spacing from the localStorage
    return savedSpacing ? parseInt(savedSpacing, 10) : 100; // return the saved spacing or 100 if there is no saved spacing
  });


  const [useDyslexiaFont, setUseDyslexiaFont] = useState(() => { // state variable for the use dyslexia font
    const saved = localStorage.getItem('useDyslexiaFont'); // get the saved use dyslexia font from the localStorage
    return saved === 'true'; // return the saved use dyslexia font or true if there is no saved use dyslexia font
  });



  const changeTheme = (newTheme) => { // change the theme
    setTheme(newTheme); // set the theme to the new theme
    localStorage.setItem('theme', newTheme); // save the new theme to the localStorage
    
    if (newTheme === themes.DARK) { // if the new theme is the dark theme
      document.body.classList.add('dark-mode'); // add the dark mode class to the body
      document.body.classList.remove('accessible-mode'); // remove the accessible mode class from the body
    } else if (newTheme === themes.ACCESSIBLE) { // if the new theme is the accessible theme
      document.body.classList.add('accessible-mode'); // add the accessible mode class to the body
      document.body.classList.remove('dark-mode'); // remove the dark mode class from the body
    } else { // if the new theme is not the dark or accessible theme
      document.body.classList.remove('dark-mode', 'accessible-mode'); // remove the dark mode and accessible mode classes from the body
    }
  };

  const changeFontSize = (newSize) => { // change the font size
    setFontSize(newSize); // set the font size to the new size
    localStorage.setItem('fontSize', newSize.toString()); // save the new size to the localStorage
    document.documentElement.style.fontSize = `${newSize}%`; // set the font size to the new size
  };

  const changeContentSpacing = (newSpacing) => { // change the content spacing
    setContentSpacing(newSpacing); // set the content spacing to the new spacing
    localStorage.setItem('contentSpacing', newSpacing.toString()); // save the new spacing to the localStorage
    document.documentElement.style.setProperty('--content-spacing', `${newSpacing}%`); // set the content spacing to the new spacing
  };

  const toggleDyslexiaFont = () => { // toggle the dyslexia font
    setUseDyslexiaFont(prev => { // set the use dyslexia font to the previous use dyslexia font
      const newValue = !prev; // set the new value to the previous use dyslexia font
      localStorage.setItem('useDyslexiaFont', newValue.toString()); // save the new value to the localStorage
      if (newValue) { // if the new value is true
        document.body.classList.add('dyslexia-font-enabled'); // add the dyslexia font enabled class to the body
      } else { // if the new value is false
        document.body.classList.remove('dyslexia-font-enabled'); // remove the dyslexia font enabled class from the body
      }
      return newValue; // return the new value
    });
  };




  const getThemeObject = () => { // get the theme object
    switch (theme) { // switch the theme
      case themes.DARK: // if the theme is the dark theme
        return darkTheme; // return the dark theme
      case themes.ACCESSIBLE: // if the theme is the accessible theme
        return accessibleTheme; // return the accessible theme
      default: // if the theme is not the dark or accessible theme
        return lightTheme; // return the light theme
    }
  };

  return (
    <ThemeContext.Provider // provide the theme context to the app
      value={{ // set the value of the context object
        theme, // the theme
        changeTheme, // the change theme function
        fontSize, // get the font size
        changeFontSize, // the change font size function
        contentSpacing, // the content spacing
        changeContentSpacing, // the change content spacing function
        themes, // the themes
        useDyslexiaFont, // whether to use the dyslexia font
        toggleDyslexiaFont // the toggle dyslexia font function
      }}
    >
      <MuiThemeProvider theme={getThemeObject()}> {/* provide the theme to the app */}
        {children} {/* render the children */}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}; 
