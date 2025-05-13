// accessibility menu in the bottom right left of the screen

import { useState } from 'react';

// material ui components
import {
  Button,
  Menu,
  Divider,
  Typography,
  Switch,
  Slider,
  Box,
  Tooltip,
  Fab,
} from '@mui/material';

// icons
import {
  AccessibilityNew as AccessibilityIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  FormatSize as FontSizeIcon,
  FormatColorText as DyslexiaFontIcon,
} from '@mui/icons-material';

// define a theme when the user changes properties inside the accessibility menu
import { useThemeContext } from '../../context/ThemeContext';

import { useTheme } from '@mui/material/styles';

function AccessibilityMenu() {

  // state variable to store the current anchor element (open or close) for the menu, initialised as null
  const [anchorEl, setAnchorEl] = useState(null);

  // get the theme context through the properties of the theme
  const {
    theme: currentThemeMode,
    changeTheme,
    fontSize,
    changeFontSize,
    useDyslexiaFont,
    toggleDyslexiaFont,
    themes,
  } = useThemeContext();
  
  const theme = useTheme();

  // set the anchor element to the element that triggered the event, opening the menu
  const handleClick = (event) => { 
    setAnchorEl(event.currentTarget);
  };

  // set the anchor element to null, closing the menu
  const handleClose = () => { 
    setAnchorEl(null);
  };

  // changing the theme
  const handleThemeChange = (newTheme) => {
    changeTheme(newTheme);
  };

  // changing the font size
  const handleFontSizeChange = (event, newValue) => {
    changeFontSize(newValue);
  };

  return (
    <>
      <Box
        className="accessibility-fab-container" // class name for styling the floating action button container
        sx={{
          position: 'fixed', // position the fab container so it stays in place when scrolling
          bottom: 20, // position the fab 20 pixels from the bottom of the screen
          zIndex: 100, // ensure the fab is always on top of other elements
          left: 20 // position the fab 20 pixels from the left of the screen
        }}
      >
        {/* clickable tooltip for the fab */}
        <Tooltip title="Accessibility Options">
          <Fab
            aria-controls="accessibility-menu" // associates the button with the accessibility menu for assistive technologies
            aria-haspopup="true" // indicates that the button controls a menu that can be opened
            onClick={handleClick} // open the menu when the button is clicked
            aria-label="Open accessibility menu" // provides a label for screen readers to describe the button's action
            size="medium"
            sx={{
              bgcolor: theme.palette.background.paper,
              color: theme.palette.text.primary,

              // while hovered over, change the background colour to the dark grey or light grey depending on the theme
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200],
              }
            }}
          >
            {/* accessibility icon */}
            <AccessibilityIcon sx={{ color: theme.palette.text.primary }} />
          </Fab>
        </Tooltip>
      </Box>

      <Menu
        id="accessibility-menu" // sets the id for the menu, used for accessibility and linking with aria-controls
        anchorEl={anchorEl} // specifies the element the menu is anchored to
        keepMounted // keeps the menu in the DOM when closed for performance optimisation
        open={Boolean(anchorEl)} // determines if the menu is open based on the anchor element
        onClose={handleClose} // closes the menu when the close button is clicked
        slotProps={{
          paper: {
            elevation: 3,
            sx: {
              width: 300,
              padding: 2,
              bgcolor: theme.palette.background.default
            }
          }
        }}
        anchorOrigin={{
          vertical: 'top', // positions the menu above the anchor element
          horizontal: 'left' // aligns the menu to the left of the anchor element
        }}
        transformOrigin={{
          vertical: 'bottom', // sets the origin for the menu's transformation to the bottom
          horizontal: 'left' // aligns the transformation origin to the left
        }}
      >
        <Typography
          variant="h6"
          sx={{ 
            mb: 1,
            px: 2, // adds padding to the left and right of the text
            color: theme.palette.text.primary
          }}>
          Accessibility Options
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ px: 2, mb: 2 }}>
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{ color: theme.palette.text.secondary }}
          >
            Theme
          </Typography>

          {/* distribute the child elements evenly, with space around each item. */}
          <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
            <Button
              // if the current theme is light, make the button filled with the primary colour, otherwise make it outlined
              variant={currentThemeMode === themes.LIGHT ? "contained" : "outlined"}
              onClick={() => handleThemeChange(themes.LIGHT)}
              startIcon={<LightModeIcon />}
              size="small"
              sx={{
                width: '45%',
                borderColor: theme.palette.divider,
                color: currentThemeMode === themes.LIGHT ? theme.palette.primary.contrastText : theme.palette.text.primary,
                '&:hover': {
                  bgcolor: currentThemeMode === themes.LIGHT
                    ? theme.palette.primary.main
                    : theme.palette.action.hover
                }
              }}
            >
              Light
            </Button>
            <Button
              variant={currentThemeMode === themes.DARK ? "contained" : "outlined"}
              onClick={() => handleThemeChange(themes.DARK)}
              startIcon={<DarkModeIcon />}
              size="small"
              sx={{
                width: '45%',
                borderColor: theme.palette.divider,
                color: currentThemeMode === themes.DARK ? theme.palette.primary.contrastText : theme.palette.text.primary,
                '&:hover': {
                  bgcolor: currentThemeMode === themes.DARK
                    ? theme.palette.primary.main
                    : theme.palette.action.hover
                }
              }}
            >
              Dark
            </Button>
          </Box>
        </Box>
        
        <Box sx={{ px: 2, mb: 2 }}>
          {/* font size, with a smaller heading and space below */}
          <Typography variant="subtitle2" gutterBottom display="flex" alignItems="center" sx={{ color: theme.palette.text.secondary }}>
            <FontSizeIcon sx={{ mr: 1, fontSize: 20 }} />
            Font Size
          </Typography>
          <Slider
            value={fontSize}
            onChange={handleFontSizeChange}
            aria-labelledby="font-size-slider"
            valueLabelDisplay="auto"
            step={10} // increase font size in steps of 10
            marks
            min={100} // minimum font size
            max={150} // maximum font size
            sx={{
              mt: 2,
              color: theme.palette.text.primary,
              '& .MuiSlider-thumb': {
                bgcolor: theme.palette.text.primary
              },
              // for the tracked part of the slider
              '& .MuiSlider-track': {
                bgcolor: theme.palette.text.primary,
              },
              // for the untracked part of the slider
              '& .MuiSlider-rail': {
                bgcolor: theme.palette.action.disabledBackground,
              }
            }}
          />
          <Box 
            sx={{
              display: 'flex',
              justifyContent: 'space-between', // add space between the text for the sizes
              mt: 1
            }}>
            {/* text for the font sizes */}
            <Typography variant="caption">Default</Typography>
            <Typography variant="caption">Larger</Typography>
            <Typography variant="caption">Largest</Typography>
          </Box>
        </Box>

        <Box 
          sx={{ 
            px: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
          <Typography
            variant="subtitle2"
            id="dyslexia-font-label"
            sx={{ color: theme.palette.text.secondary }}
          >
            <DyslexiaFontIcon
              sx={{
                mr: 1,
                fontSize: 20
              }}
            />
            Dyslexia Font
          </Typography>
          <Switch
            checked={useDyslexiaFont}
            onChange={toggleDyslexiaFont}
          />
        </Box>

        <Box
          sx={{
            px: 2,
            py: 1,
            display: 'flex',
            justifyContent: 'flex-end' // align the button to the right
          }}>
          <Button
            variant="contained"
            onClick={handleClose}
            size="small"
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
              }
            }}
          >
            Close
          </Button>
        </Box>
      </Menu>
    </>
  );
}

export default AccessibilityMenu;