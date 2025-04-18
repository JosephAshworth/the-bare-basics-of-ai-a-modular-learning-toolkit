import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  Divider,
  Typography,
  Switch,
  Slider,
  FormControlLabel,
  IconButton,
  Box,
  Tooltip,
  Fab,
} from '@mui/material';
import {
  AccessibilityNew as AccessibilityIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  FormatSize as FontSizeIcon,
  LineWeight as LineWeightIcon,
} from '@mui/icons-material';
import { useThemeContext, themes } from '../../context/ThemeContext';

function AccessibilityMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const {
    theme,
    changeTheme,
    fontSize,
    changeFontSize,
    contentSpacing,
    changeContentSpacing,
    themes,
  } = useThemeContext();
  
  // Create a global style to remove blue focus outlines
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      #accessibility-menu *:focus {
        outline: none !important;
        box-shadow: none !important;
      }
      #accessibility-menu .MuiPaper-root {
        --mui-palette-primary-main: #000000;
        --mui-palette-primary-light: #333333;
      }
      #accessibility-menu .MuiButtonBase-root:after {
        border-color: transparent !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeChange = (newTheme) => {
    changeTheme(newTheme);
  };

  const handleFontSizeChange = (event, newValue) => {
    changeFontSize(newValue);
  };

  const handleContentSpacingChange = (event, newValue) => {
    changeContentSpacing(newValue);
  };
  
  const isDarkMode = theme === themes.DARK;

  return (
    <>
      {/* Floating Accessibility Button */}
      <Box
        className="accessibility-fab-container"
        sx={{
          position: 'fixed',
          bottom: 20,
          left: 20,
          zIndex: 1000,
          '& .MuiButtonBase-root:focus': {
            outline: 'none',
            boxShadow: 'none'
          }
        }}
      >
        <Tooltip title="Accessibility Options">
          <Fab
            aria-controls="accessibility-menu"
            aria-haspopup="true"
            onClick={handleClick}
            aria-label="Open accessibility menu"
            size="medium"
            sx={{
              boxShadow: '0 3px 5px 2px rgba(0, 0, 0, 0.15)',
              bgcolor: isDarkMode ? '#000' : '#fff',
              color: isDarkMode ? '#fff' : '#000',
              '&:hover': {
                bgcolor: isDarkMode ? '#444' : '#f0f0f0'
              }
            }}
          >
            <AccessibilityIcon />
          </Fab>
        </Tooltip>
      </Box>
      
      <Menu
        id="accessibility-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        slotProps={{
          paper: {
            elevation: 3,
            sx: {
              width: 300,
              maxWidth: '100%',
              padding: 2,
              '& .MuiButtonBase-root:focus': {
                outline: 'none !important',
                boxShadow: 'none !important'
              },
              '& .MuiButtonBase-root::after': {
                outline: 'none !important'
              },
              '& *:focus': {
                outline: 'none !important'
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: isDarkMode ? '#444' : '#ddd'
              },
              '& .MuiSlider-thumb:hover, & .MuiSlider-thumb.Mui-focusVisible': {
                boxShadow: 'none !important'
              },
              '& .MuiSwitch-thumb': {
                boxShadow: 'none !important'
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: '#000 !important'
              },
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: '#000 !important'
              },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: isDarkMode ? '#fff' : '#000 !important',
                borderWidth: '1px !important'
              },
              '& .MuiInputBase-root.Mui-focused': {
                boxShadow: 'none !important'
              },
              '& .Mui-focused:not(.Mui-disabled)': {
                boxShadow: 'none !important'
              }
            }
          }
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Typography variant="h6" sx={{ mb: 1, px: 2 }}>
          Accessibility Options
        </Typography>
        
        <Divider sx={{ mb: 2 }} />
        
        {/* Theme Selection */}
        <Box sx={{ px: 2, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Theme
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
            <Button
              variant={!isDarkMode ? "contained" : "outlined"}
              onClick={() => handleThemeChange(themes.LIGHT)}
              startIcon={<LightModeIcon />}
              size="small"
              sx={{ 
                width: '45%',
                bgcolor: !isDarkMode ? '#000' : 'transparent',
                color: !isDarkMode ? '#fff' : isDarkMode ? '#fff' : '#000',
                borderColor: isDarkMode ? '#fff' : 'transparent',
                '&:hover': {
                  bgcolor: !isDarkMode ? '#333' : 'rgba(255, 255, 255, 0.1)'
                },
                '&:focus': {
                  outline: 'none',
                  boxShadow: 'none'
                }
              }}
            >
              Light
            </Button>
            <Button
              variant={isDarkMode ? "contained" : "outlined"}
              onClick={() => handleThemeChange(themes.DARK)}
              startIcon={<DarkModeIcon />}
              size="small"
              sx={{ 
                width: '45%',
                bgcolor: isDarkMode ? '#000' : 'transparent',
                color: isDarkMode ? '#fff' : '#000',
                borderColor: !isDarkMode ? '#000' : 'transparent',
                '&:hover': {
                  bgcolor: isDarkMode ? '#333' : 'rgba(0, 0, 0, 0.05)'
                },
                '&:focus': {
                  outline: 'none',
                  boxShadow: 'none'
                }
              }}
            >
              Dark
            </Button>
          </Box>
        </Box>
        
        {/* Font Size */}
        <Box sx={{ px: 2, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom display="flex" alignItems="center">
            <FontSizeIcon sx={{ mr: 1, fontSize: 20 }} />
            Font Size
          </Typography>
          <Slider
            value={fontSize}
            onChange={handleFontSizeChange}
            aria-labelledby="font-size-slider"
            valueLabelDisplay="auto"
            step={10}
            marks
            min={80}
            max={150}
            sx={{ 
              mt: 2,
              color: '#000', 
              '& .MuiSlider-thumb': {
                bgcolor: isDarkMode ? '#fff' : '#000',
                '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                  boxShadow: 'none'
                }
              },
              '& .MuiSlider-track': {
                bgcolor: isDarkMode ? '#fff' : '#000',
              },
              '& .MuiSlider-rail': {
                bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
              }
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption">Smaller</Typography>
            <Typography variant="caption">Default</Typography>
            <Typography variant="caption">Larger</Typography>
          </Box>
        </Box>
        
        {/* Content Spacing */}
        <Box sx={{ px: 2, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom display="flex" alignItems="center">
            <LineWeightIcon sx={{ mr: 1, fontSize: 20 }} />
            Content Spacing
          </Typography>
          <Slider
            value={contentSpacing}
            onChange={handleContentSpacingChange}
            aria-labelledby="content-spacing-slider"
            valueLabelDisplay="auto"
            step={10}
            marks
            min={100}
            max={150}
            sx={{ 
              mt: 2,
              color: '#000', 
              '& .MuiSlider-thumb': {
                bgcolor: isDarkMode ? '#fff' : '#000',
                '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                  boxShadow: 'none'
                }
              },
              '& .MuiSlider-track': {
                bgcolor: isDarkMode ? '#fff' : '#000',
              },
              '& .MuiSlider-rail': {
                bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
              }
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption">Normal</Typography>
            <Typography variant="caption">Expanded</Typography>
          </Box>
        </Box>
        
        <Divider sx={{ mt: 2, mb: 1 }} />
        
        <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            onClick={handleClose} 
            size="small"
            sx={{
              bgcolor: '#000',
              color: '#fff',
              '&:hover': {
                bgcolor: '#333'
              },
              '&:focus': {
                outline: 'none',
                boxShadow: 'none'
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