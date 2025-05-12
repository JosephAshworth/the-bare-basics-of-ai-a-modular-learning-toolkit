import { useState } from 'react'; // import useState, for managing state in functional components

import {
  Button, // import the Button component from MUI
  Menu, // import the Menu component from MUI
  Divider, // import the Divider component from MUI
  Typography, // import the Typography component from MUI
  Switch, // import the Switch component from MUI
  Slider, // import the Slider component from MUI
  Box, // import the Box component from MUI
  Tooltip, // import the Tooltip component from MUI
  Fab, // import the Fab component from MUI
} from '@mui/material';

import {
  AccessibilityNew as AccessibilityIcon, // import the AccessibilityNew icon from the @mui/icons-material library
  Brightness4 as DarkModeIcon, // import the DarkMode icon from the @mui/icons-material library
  Brightness7 as LightModeIcon, // import the LightMode icon from the @mui/icons-material library
  FormatSize as FontSizeIcon, // import the FontSize icon from the @mui/icons-material library
  FormatColorText as DyslexiaFontIcon, // import the DyslexiaFont icon from the @mui/icons-material library
} from '@mui/icons-material';

import { useThemeContext } from '../../context/ThemeContext'; // import the useThemeContext hook from the ThemeContext file. This hook is used to access the theme context

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on dark or light mode

function AccessibilityMenu() {
  const [anchorEl, setAnchorEl] = useState(null); // for storing and updating the anchor element (the element that is currently open), initialised as null
  const {
    theme: currentThemeMode, // rename to avoid conflict with muiTheme
    changeTheme, // access the changeTheme function from the theme context
    fontSize, // access the fontSize from the theme context
    changeFontSize, // access the changeFontSize function from the theme context
    useDyslexiaFont, // access the useDyslexiaFont from the theme context
    toggleDyslexiaFont, // access the toggleDyslexiaFont function from the theme context
    themes, // access the themes from the theme context
  } = useThemeContext(); // unpack the theme, changeTheme, fontSize, changeFontSize, useDyslexiaFont, toggleDyslexiaFont, and themes from the theme context. This is used to access the individual values from the theme context
  
  const theme = useTheme(); // get the actual MUI theme object

  const handleClick = (event) => { 
    setAnchorEl(event.currentTarget); // set the anchor element to the current target of the event when the menu is clicked
  };

  const handleClose = () => { 
    setAnchorEl(null); // set the anchor element to null when the menu is closed
  };

  const handleThemeChange = (newTheme) => {
    changeTheme(newTheme); // change the theme to the new theme when the theme is changed
  };

  const handleFontSizeChange = (event, newValue) => {
    changeFontSize(newValue); // change the font size to the new font size when the font size is changed
  };

  return (
    <>
      <Box
        className="accessibility-fab-container" // set the class name of the accessibility fab container
        sx={{
          position: 'fixed', // set the position of the accessibility fab container to fixed. This is used to ensure that the menu is always visible
          bottom: 20, // set the bottom position of the accessibility fab container to 20. This style makes the menu appear at the bottom of the screen
          zIndex: 100, // ensure the accessibility menu is always above other elements. This style makes sure it is always visible
          left: 20 // set the left position of the accessibility fab container to 20. This style makes the menu appear on the left side of the screen
        }}
      >
        <Tooltip title="Accessibility Options"> {/* set the tooltip title to Accessibility Options */}
          <Fab
            aria-controls="accessibility-menu" // set the aria-controls to accessibility-menu. This is used to make sure the menu can be understood by assistive technologies
            aria-haspopup="true" // Sets the aria-haspopup to true. This is used to make sure the popup element is created when the menu is opened
            onClick={handleClick} // set the onClick event to handleClick. This is used to open the menu when the button is clicked
            aria-label="Open accessibility menu" // set the aria-label to Open accessibility menu. This is used to make sure the menu can be understood by screen readers
            size="medium" // set the size of the button to medium
            sx={{
              bgcolor: theme.palette.background.paper, // set the background colour of the button to the background colour of the theme
              color: theme.palette.text.primary, // set the colour of the button to the text colour of the theme
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200], // set the background colour of the button to the background colour of the theme when the button is hovered over
              }
            }}
          >
            <AccessibilityIcon sx={{ color: theme.palette.text.primary }} /> {/* set the colour of the icon to the text colour of the theme */}
          </Fab>
        </Tooltip>
      </Box>

      <Menu
        id="accessibility-menu" // set the id of the accessibility menu to accessibility-menu. This is used to associate the menu with the button
        anchorEl={anchorEl} // set the anchor element of the menu to the anchor element of the button
        keepMounted // set the keep mounted to true. This is used to keep the menu mounted when it is open
        open={Boolean(anchorEl)} // set the open to the boolean of the anchor element. This is used to check if the menu is open
        onClose={handleClose} // set the on close event to handleClose. This is used to close the menu when the button is clicked
        slotProps={{
          paper: {
            elevation: 3, // set the elevation of the menu to 3, this is used to set the shadow of the menu
            sx: {
              width: 300, // set the width of the menu to 300
              padding: 2, // set the padding of the menu to 2, so it is not too close to the edges of the screen
              bgcolor: theme.palette.background.default, // set the background colour of the menu to the background colour of the theme
            }
          }
        }}
        anchorOrigin={{
          vertical: 'top', // set the vertical position of the anchor to the top of the anchor element
          horizontal: 'left', // set the horizontal position of the anchor to the left of the anchor element
        }}
        transformOrigin={{
          vertical: 'bottom', // set the vertical position of the transform origin to the bottom of the popover or menu
          horizontal: 'left', // set the horizontal position of the transform origin to the left of the popover or menu
        }}
      >
        <Typography
          variant="h6" // set the variant of the title to h6, this is used to set the size of the title
          sx={{ 
            mb: 1, // set the margin bottom of the title to 1, this is used to add a margin between the title and the divider
            px: 2, // set the padding left of the title to 2, this is used to add a padding between the title and the left edge of the menu
            color: theme.palette.text.primary // set the colour of the title to the text colour of the theme
          }}>
          Accessibility Options {/* set the text of the title to Accessibility Options */}
        </Typography>

        <Divider sx={{ mb: 2 }} /> {/* set the divider of the menu to 2, so it is not too close to the edges of the screen */}

        <Box sx={{ px: 2, mb: 2 }}> {/* set the padding of the menu to 2, and adds a margin bottom of 2 */}
          <Typography
            variant="subtitle2" // set the variant of the subtitle to subtitle2, this is used to set the size of the subtitle
            gutterBottom // set the gutter bottom of the subtitle to true, this is used to add a margin between the subtitle and the divider
            sx={{ color: theme.palette.text.secondary }} // set the colour of the subtitle to the text colour of the theme
          >
            Theme {/* set the text of the subtitle to Theme */}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-around' }}> {/* set the display of the menu to flex, and the justify content to space around, ensuring the buttons are evenly spaced */}
            <Button
              variant={currentThemeMode === themes.LIGHT ? "contained" : "outlined"} // set the variant of the button to contained if the theme is light mode and outlined if the theme is dark mode
              onClick={() => handleThemeChange(themes.LIGHT)} // set the onClick event to handleThemeChange, which changes the theme to light mode
              startIcon={<LightModeIcon />} // set the start icon of the button to the LightModeIcon
              size="small" // set the size of the button to small
              sx={{
                width: '45%', // set the width of the button to 45%
                borderColor: theme.palette.divider, // set the border colour of the button to the divider colour of the theme
                color: currentThemeMode === themes.LIGHT ? theme.palette.primary.contrastText : theme.palette.text.primary, // set the colour of the button to the primary contrast text colour of the theme if the theme is light mode and the text colour of the theme if the theme is dark mode
                '&:hover': {
                  bgcolor: currentThemeMode === themes.LIGHT
                    ? theme.palette.primary.main // set the background colour of the button to the primary colour of the theme if the theme is light mode
                    : theme.palette.action.hover // set the background colour of the button to the hover colour of the theme if the theme is dark mode
                },
              }}
            >
              Light {/* set the text of the button to Light */}
            </Button>
            <Button
              variant={currentThemeMode === themes.DARK ? "contained" : "outlined"} // set the variant of the button to contained if the theme is dark mode and outlined if the theme is light mode
              onClick={() => handleThemeChange(themes.DARK)} // set the onClick event to handleThemeChange, which changes the theme to dark mode
              startIcon={<DarkModeIcon />} // set the start icon of the button to the DarkModeIcon
              size="small" // set the size of the button to small
              sx={{
                width: '45%', // set the width of the button to 45%
                borderColor: theme.palette.divider, // set the border colour of the button to the divider colour of the theme
                color: currentThemeMode === themes.DARK ? theme.palette.primary.contrastText : theme.palette.text.primary, // set the colour of the button to the primary contrast text colour of the theme if the theme is dark mode and the text colour of the theme if the theme is light mode
                '&:hover': {
                  bgcolor: currentThemeMode === themes.DARK
                    ? theme.palette.primary.main // set the background colour of the button to the primary colour of the theme if the theme is dark mode
                    : theme.palette.action.hover // set the background colour of the button to the hover colour of the theme if the theme is light mode
                },
              }}
            >
              Dark {/* set the text of the button to Dark */}
            </Button>
          </Box>
        </Box>
        
        <Box sx={{ px: 2, mb: 2 }}> {/* set the padding of the menu to 2, and adds a margin bottom of 2 */}
          <Typography variant="subtitle2" gutterBottom display="flex" alignItems="center" sx={{ color: theme.palette.text.secondary }}> {/* set the subtitle of the menu to 2, and adds a gutter bottom of 2, and the display of the menu to flex, and the align items to centre */}
            <FontSizeIcon sx={{ mr: 1, fontSize: 20 }} /> {/* set the start icon of the menu to the FontSizeIcon */}
            Font Size {/* set the text of the menu to Font Size */}
          </Typography>
          <Slider
            value={fontSize} // set the value of the slider to the font size
            onChange={handleFontSizeChange} // set the onChange event to handleFontSizeChange, which changes the font size to the new font size when the slider is changed
            aria-labelledby="font-size-slider" // set the aria-labelledby to font-size-slider, which is the id of the slider
            valueLabelDisplay="auto" // set the value label display to auto, which displays the value of the slider as a label
            step={10} // set the step of the slider to 10, which is the amount the slider will change when the user clicks on it
            marks // set the marks of the slider
            min={100} // set the minimum value of the slider to 100, which is the smallest font size
            max={150} // set the maximum value of the slider to 150, which is the largest font size
            sx={{
              mt: 2, // set the margin top of the slider to 2, which is the amount of space between the slider and the text
              color: theme.palette.text.primary, // set the colour of the slider to the text colour of the theme
              '& .MuiSlider-thumb': {
                bgcolor: theme.palette.text.primary // set the background colour of the thumb to the text colour of the theme
              },
              '& .MuiSlider-track': {
                bgcolor: theme.palette.text.primary, // set the background colour of the track to the text colour of the theme
              },
              '& .MuiSlider-rail': {
                bgcolor: theme.palette.action.disabledBackground, // set the background colour of the rail to the disabled background colour of the theme
              }
            }}
          />
          <Box 
            sx={{
              display: 'flex', // set the display of the menu to flex, so the text is aligned properly
              justifyContent: 'space-between', // set the justify content of the menu to space between, so the text is evenly spaced
              mt: 1 // set the margin top of the menu to 1, so the text is not too close to the slider
            }}>
            <Typography variant="caption">Default</Typography> {/* set the text of the menu to Default, which is the default font size */}
            <Typography variant="caption">Larger</Typography> {/* set the text of the menu to Larger, which is the larger font size */}
            <Typography variant="caption">Largest</Typography> {/* set the text of the menu to Largest, which is the largest font size */}
          </Box>
        </Box>

        <Box 
          sx={{ 
            px: 2, // set the horizontal padding of the menu to 2, so it is not too close to the right of the menu
            display: 'flex', // set the display of the menu to flex, so the text is aligned properly
            alignItems: 'center', // set the align items of the menu to centre, so the text is aligned properly
            justifyContent: 'space-between' // set the justify content of the menu to space between, so the text is evenly spaced
          }}>
          <Typography
            variant="subtitle2"// set the variant of the subtitle to subtitle2, so the text is not too small
            id="dyslexia-font-label" // set the id of the menu to dyslexia-font-label, so the text is aligned properly
            sx={{ color: theme.palette.text.secondary }} // set the colour of the subtitle to the text colour of the theme
          >
            <DyslexiaFontIcon
              sx={{
                mr: 1, // set the margin right of the icon to 1, so the icon is not too close to the text
                fontSize: 20 // set the font size of the icon to 20, so the icon is not too small
              }}
            />
            Dyslexia Font {/* Sets the text of the menu to Dyslexia Font */}
          </Typography>
          <Switch
            checked={useDyslexiaFont} // sets the checked state of the switch to the useDyslexiaFont state
            onChange={toggleDyslexiaFont} // sets the onChange event to toggleDyslexiaFont, which toggles the dyslexia font when the switch is changed
          />
        </Box>

        <Box
          sx={{
            px: 2, // set the horizontal padding of the menu to 2, so it is not too close to the right of the menu
            py: 1, // set the vertical padding of the menu to 1, so it is not too close to the bottom of the menu
            display: 'flex', // set the display of the menu to flex, which is used to align the text properly
            justifyContent: 'flex-end' // set the justify content of the menu to flex-end, so the text is aligned properly at the end of the menu
          }}>
          <Button
            variant="contained" // set the variant of the button to contained
            onClick={handleClose} // set the onClick event to handleClose, which closes the menu
            size="small" // set the size of the button to small
            sx={{
              bgcolor: theme.palette.primary.main, // set the background colour of the button to the primary colour of the theme
              color: theme.palette.primary.contrastText, // set the colour of the button to the primary contrast text colour of the theme
              '&:hover': {
                bgcolor: theme.palette.primary.dark, // set the background colour of the button to the primary dark colour of the theme
              }
            }}
          >
            Close {/* set the text of the button to Close */}
          </Button>
        </Box>
      </Menu>
    </>
  );
}

export default AccessibilityMenu; // export the AccessibilityMenu component as the default export, making it available to be used in other files
