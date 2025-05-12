import { createTheme } from '@mui/material/styles'; // import createTheme from MUI, for creating a theme

const baseTheme = { // base theme configuration
  typography: {
    fontFamily: [
      '-apple-system', // macOS system font
      'BlinkMacSystemFont', // macOS Safari fallback
      'Segoe UI', // Windows
      'Roboto', // Android/Material
      'Helvetica Neue', // older macOS
      'Arial', // miscellaneous font
      'sans-serif' // miscellaneous font
    ],
    h1: {
      fontSize: '2.5rem', // font size of h1
      fontWeight: 600, // font weight of h1
    },
    h2: {
      fontSize: '2rem', // font size of h2
      fontWeight: 600, // font weight of h2
    },
    h3: {
      fontSize: '1.75rem', // font size of h3
      fontWeight: 600, // font weight of h3
    },
    h4: {
      fontSize: '1.5rem', // font size of h4
      fontWeight: 600, // font weight of h4
    },
    h5: {
      fontSize: '1.25rem', // font size of h5
      fontWeight: 600, // font weight of h5
    },
    h6: {
      fontSize: '1rem', // font size of h6
      fontWeight: 600, // font weight of h6
    }
  },
  shape: {
    borderRadius: 8, // border radius of 8 units
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // text transform of none
          fontWeight: 500, // font weight of 500
        }
      }
    }
  }
};


export const lightTheme = createTheme({ // create a custom light theme
  ...baseTheme, // extend the base theme configuration
  palette: { // define the color palette
    mode: 'light', // set the theme mode to light
    primary: {
      main: '#1976d2', // blue
      light: '#42a5f5', // sky
      dark: '#1565c0', // cobalt
    },
    secondary: {
      main: '#9c27b0', // purple
      light: '#ba68c8', // orchid
      dark: '#7b1fa2', // plum
    },
    background: {
      default: '#f5f5f5', // grey
      paper: '#ffffff', // white
    },
    text: {
      primary: '#212121', // black
      secondary: '#757575', // silver
    }
  }
});




export const darkTheme = createTheme({ // create a custom dark theme
  ...baseTheme, // extend the base theme configuration
  palette: {
    mode: 'dark', // set the theme mode to dark
    primary: {
      main: '#90caf9', // blue
      light: '#e3f2fd', // powder
      dark: '#42a5f5', // sky
    },
    secondary: {
      main: '#ce93d8', // lilac
      light: '#f3e5f5', // blush
      dark: '#ab47bc', // violet
    },
    background: {
      default: '#121212', // black
      paper: '#1e1e1e', // charcoal
    },
    text: {
      primary: '#ffffff', // white
      secondary: '#b0b0b0', // grey
    }
  }
});


export const accessibleTheme = createTheme({ // create an accessible theme
  typography: {
    ...baseTheme.typography, // extend the base typography settings
    fontSize: 16, // larger font size
  }
});
