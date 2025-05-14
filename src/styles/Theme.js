// get the colours from the theme palette to use in the application

// create a theme for the application
import { createTheme } from '@mui/material/styles'; 

// the base theme for the application
const baseTheme = { 
  typography: {
    // font stack
    fontFamily: [
      '-apple-system', 
      'BlinkMacSystemFont', 
      'Segoe UI', 
      'Roboto', 
      'Helvetica Neue', 
      'Arial', 
      'sans-serif' 
    ],
    // font sizes and weights for the different heading levels
    h1: {
      fontSize: '2.5rem', 
      fontWeight: 600
    },
    h2: {
      fontSize: '2rem', 
      fontWeight: 600
    },
    h3: {
      fontSize: '1.75rem', 
      fontWeight: 600
    },
    h4: {
      fontSize: '1.5rem', 
      fontWeight: 600
    },
    h5: {
      fontSize: '1.25rem', 
      fontWeight: 600
    },
    h6: {
      fontSize: '1rem', 
      fontWeight: 600
    }
  },
  // default border radius for the compnents, unless overridden
  shape: {
    borderRadius: 8
  },

  // by default, apply no text transformation to the text of the buttons
  // and apply a default font weight of 500
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', 
          fontWeight: 500
        }
      }
    }
  }
};

// the light theme for the application
export const lightTheme = createTheme({ 
  ...baseTheme, // extend the base theme

  // the palette for the light theme
  // in the main application, theme.palette is the definer to use these styles
  palette: { 
    mode: 'light', 
    primary: {
      main: '#1976d2', // dark blue
      light: '#42a5f5', // light blue
      dark: '#1565c0' // darker blue
    },
    secondary: {
      main: '#9c27b0', // purple
      light: '#ba68c8', // lighter purple
      dark: '#7b1fa2' // darker purple
    },
    background: {
      default: '#f5f5f5', // white-grey
      paper: '#ffffff' // white
    },
    text: {
      primary: '#212121', // dark grey
      secondary: '#757575' // grey
    }
  }
});

// the dark theme for the application
export const darkTheme = createTheme({ 
  ...baseTheme, // extend the base theme

  // the palette for the dark theme
  palette: {
    mode: 'dark', 
    primary: {
      main: '#90caf9', // light blue
      light: '#e3f2fd', // lighter blue
      dark: '#42a5f5' // darker blue
    },
    secondary: {
      main: '#ce93d8', // pink
      light: '#f3e5f5', // lighter pink
      dark: '#ab47bc' // purple
    },
    background: {
      default: '#121212', // black
      paper: '#1e1e1e' // dark grey
    },
    text: {
      primary: '#ffffff', // white
      secondary: '#b0b0b0' // light grey
    }
  }
});

