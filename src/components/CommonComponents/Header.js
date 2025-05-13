// the header at the top

// useEffect is used to perform side effects in functional components
import React, { useState, useEffect } from 'react';

// material ui components
import { 
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  CircularProgress
} from '@mui/material';

import { 
  Menu as MenuIcon,
  SmartToy as SmartToyIcon,
  Person,
  Launch as LaunchIcon
} from '@mui/icons-material';

import { 
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom';

// firebase authentication
import { auth } from '../../firebase';

import { signOut } from 'firebase/auth';

// import function to listen for changes in the user's authentication state
import { onAuthStateChanged } from 'firebase/auth';

import { useTheme } from '@mui/material/styles';

function Header() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // if the screen is mobile
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);


  // check if the user is authenticated
  useEffect(() => {
    if (!auth) {
      console.error('Firebase auth is not initialised.');
      setLoading(false);
      return;
    }
  
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      handleMenuClose();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // define the menu items with their names and paths to other pages
  const menuItems = [
    { text: 'Home', path: '/' },
    { text: 'Get Started', path: '/get-started' },
    { text: 'Machine Learning', path: '/machine-learning' },
    { text: 'Emotion Detection', path: '/emotion-detection' },
    { text: 'Fuzzy Logic', path: '/fuzzy-logic' },
    { text: 'Feedback Survey', path: 'https://docs.google.com/forms/d/e/1FAIpQLSelUUSSj0XvFxl_2-5uxbfR_GBQRChuKAE4HMnm6kJRoHf_FA/viewform?usp=sharing' }
  ];

  // if the user is loading, show a circular progress indicator
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress size={24} />
      </Box>
    );
  }  

  return (
    <>
      <AppBar
        position="static" // position the app bar relative to its normal position in the document flow
        sx={{
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[2] // add a shadow around the app bar
        }}
      >
        <Toolbar>
          {/* prevent the box from shrinking when the flex container is resized */}
          <Box className="flex-shrink-0"> 
            <SmartToyIcon 
              sx={{ 
                fontSize: 36,
                color: theme.palette.text.primary
              }} 
            />
          </Box>

          {/* allow the box to grow and fill available space, using flexbox to center its content */}
          <Box className="flex-grow flex justify-center">
            <Typography 
              sx={{
                textAlign: 'center',
                fontWeight: 700,
                fontSize: { xs: '1.3rem', sm: '1.5rem' }, // set the font size to 1.3rem on extra small screens and 1.5rem on small and larger screens
                color: theme.palette.text.primary,
                px: 5
              }}
            >
              The Bare Basics of AI: A Modular Learning Toolkit
            </Typography>
          </Box>

          {/* if the screen is not mobile and the user is authenticated, show the profile icon and menu */}
          {!isMobile && user && (
            <Box className="flex-shrink-0">
              <IconButton onClick={handleMenuOpen}>

                {/* show the user's profile picture or a default icon of their initials */}
                <Avatar src={user.photoURL}> 
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : <Person />}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {/* close the menu when the profile or logout button is clicked */}
                <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          )}

          {isMobile && (
            <Box className="flex-shrink-0">
              <IconButton 
                onClick={handleDrawerOpen}
                aria-label="menu"
                sx={{
                  color: theme.palette.text.primary
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>

        {!isMobile && (
          <Box 
            sx={{
              backgroundColor: theme.palette.background.default,
              borderTop: `1px solid ${theme.palette.divider}`
            }}
          >
            <Box>
              <Box 
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: { xs: 2, md: 4 },
                  py: 1,
                  alignItems: 'center'
                }}
              >
                {/* map through the menu items and create a button for each */}
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path; // check if the current path matches the item's path to determine if it's active
                  const isExternal = item.path.startsWith('http'); // check if the item's path starts with http to determine if it's an external link

                  // define the common styles for the buttons
                  const commonButtonSx = {
                    textAlign: 'center',
                    fontSize: '0.95rem',
                    paddingBottom: '4px',
                    color: theme.palette.text.primary,

                    // if the button is active and not an external link, add a bottom border to the button, givingf an underline effect
                    '&::before': isActive && !isExternal ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '2px',
                      backgroundColor: theme.palette.text.primary,
                    } : {}, // otherwise, don't add any styles
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover
                    }
                  };

                  return (
                    <React.Fragment key={item.path}> {/* group elements without adding extra nodes to the DOM */}
                      <Button 
                        component={isExternal ? 'a' : Link} // use 'a' for external links and Link for internal navigation
                        href={isExternal ? item.path : undefined} // set href for external links
                        to={!isExternal ? item.path : undefined} // set to for internal links
                        target={isExternal ? '_blank' : undefined} // open external links in a new tab
                        rel={isExternal ? 'noopener noreferrer' : undefined} // add security attributes for external links
                        sx={commonButtonSx}
                      >
                        {item.text}
                        {isExternal && item.text === 'Feedback Survey' && <LaunchIcon sx={{ ml: 0.5, fontSize: 'inherit' }} />}
                      </Button>
                    </React.Fragment>
                  );
                })}
              </Box>
            </Box>
          </Box>
        )}
      </AppBar>

      <Drawer
        anchor="right" // position the drawer on the right side of the screen
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: { width: 250 }
        }}
      >
        <Box
          sx={{
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
        >
          <Box 
            sx={{ 
              display: 'flex',
              justifyContent: 'center',
              mb: 2
            }}> 
            <Typography 
              sx={{ 
                fontWeight: 700,
                color: theme.palette.text.primary
              }}
            >
              Menu
            </Typography>
          </Box>
          <Divider
            sx={{ 
              mb: 2,
              bgcolor: theme.palette.divider
            }} 
          />
          
          <List>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const isExternal = item.path.startsWith('http');

              const commonListItemSx = {
                borderRadius: '4px',
                mb: 1,

                // 'transparent' means no background colour, allowing the underlying colour to show through
                // 'inherit' means the text colour will be inherited from the parent element
                bgcolor: isActive && !isExternal ? theme.palette.primary.main : 'transparent',
                color: isActive && !isExternal ? theme.palette.primary.contrastText : 'inherit',
                '&:hover': {
                  bgcolor: isActive && !isExternal
                    ? theme.palette.primary.main
                    : theme.palette.action.hover
                  }
              };

              return (
                <ListItem 
                  key={item.path}
                  component={isExternal ? 'a' : Link}
                  href={isExternal ? item.path : undefined}
                  to={!isExternal ? item.path : undefined}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  onClick={handleDrawerClose}
                  sx={commonListItemSx}
                >
                  <ListItemText 
                    primary={item.text} // set the primary text of the list item to the item's text
                    sx={{ flexGrow: 1 }} // allow the list item text to grow and fill available space
                    primaryTypographyProps={{
                      style: { 
                        fontWeight: isActive && !isExternal ? 600 : 400
                      },
                      sx: { 
                        textAlign: 'center'
                       } 
                    }} 
                  />
                  {isExternal && item.text === 'Feedback Survey' && <LaunchIcon sx={{ fontSize: '1rem' }} />}
                </ListItem>
              );
            })}
            {user && (
              <>
                <Divider sx={{ my: 2, bgcolor: theme.palette.divider }} />
                  <ListItem 
                    component={Link}
                    to="/profile"
                    onClick={handleDrawerClose}
                    sx={{ 
                      borderRadius: '4px',
                      mb: 1,
                      bgcolor: location.pathname === '/profile' ? theme.palette.primary.main : 'transparent',
                      color: location.pathname === '/profile' ? theme.palette.primary.contrastText : 'inherit',
                      '&:hover': {
                        bgcolor: location.pathname === '/profile' 
                          ? theme.palette.primary.main
                          : theme.palette.action.hover
                      }
                    }}
                  >
                    <ListItemText primary="Profile"/>
                  </ListItem>
                  <ListItem 
                    onClick={() => { handleLogout(); handleDrawerClose(); }}
                    sx={{ 
                      borderRadius: '4px',
                      mb: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: theme.palette.action.hover
                      },
                    }}
                  >
                    <ListItemText primary="Logout" />
                  </ListItem>
                </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default Header;