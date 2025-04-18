import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Divider,
  GlobalStyles,
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';
import { 
  Menu as MenuIcon,
  SmartToy as SmartToyIcon,
  AccountCircle,
  Person
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useThemeContext } from '../../context/ThemeContext';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';

function Header() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { theme: currentTheme } = useThemeContext();
  const isDarkMode = currentTheme === 'dark';
  
  // Auth state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
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

  const handleProfileMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      handleCloseMenu();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const menuItems = [
    { text: 'Home', path: '/' },
    { text: 'Get Started', path: '/welcome' },
    { text: 'Machine Learning', path: '/machine-learning' },
    { text: 'Emotion Detection', path: '/emotion-detection' },
    { text: 'Fuzzy Logic', path: '/fuzzy-logic' }
  ];

  // Add a skip to content link for accessibility
  const SkipLink = () => (
    <a href="#main-content" className="skip-to-content">
      Skip to main content
    </a>
  );

  // Auth related menu items
  const authMenuItems = !loading && (
    <Box 
      sx={{ 
        marginLeft: 2, 
        display: 'flex', 
        alignItems: 'center',
        color: isDarkMode ? '#e0e0e0' : '#555'
      }}
    >
      {user ? (
        <>
          <IconButton
            onClick={handleProfileMenu}
            size="large"
            aria-label="account"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="inherit"
          >
            {user.photoURL ? (
              <Avatar 
                sx={{ width: 32, height: 32 }}
                src={user.photoURL} 
                alt={user.displayName || "User"} 
              />
            ) : (
              <Avatar sx={{ width: 32, height: 32, backgroundColor: isDarkMode ? '#555' : '#ddd' }}>
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : <Person />}
              </Avatar>
            )}
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={() => {
              handleCloseMenu();
              navigate('/profile');
            }}>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </>
      ) : (
        <Box>
          <Button 
            component={Link} 
            to="/login"
            sx={{
              color: isDarkMode ? '#e0e0e0' : '#555',
              '&:hover': {
                color: isDarkMode ? '#ffffff' : '#000000',
              }
            }}
          >
            Login
          </Button>
          <Button 
            component={Link} 
            to="/register"
            variant="outlined"
            sx={{
              ml: 1,
              borderColor: isDarkMode ? '#e0e0e0' : '#555',
              color: isDarkMode ? '#e0e0e0' : '#555',
              '&:hover': {
                borderColor: isDarkMode ? '#ffffff' : '#000000',
                color: isDarkMode ? '#ffffff' : '#000000',
                backgroundColor: 'transparent'
              }
            }}
          >
            Register
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      <GlobalStyles
        styles={{
          'a': {
            textDecoration: 'none !important',
            color: isDarkMode ? '#ffffff !important' : '#000000 !important',
          },
          'a:hover': {
            color: isDarkMode ? '#ffffff !important' : '#000000 !important',
            textDecoration: 'none !important',
          },
          'a:focus': {
            outline: 'none !important',
            textDecoration: 'none !important',
            color: isDarkMode ? '#ffffff !important' : '#000000 !important',
          },
          'a:focus-visible': {
            outline: 'none !important',
            textDecoration: 'none !important',
            color: isDarkMode ? '#ffffff !important' : '#000000 !important',
          },
          'a:visited': {
            color: isDarkMode ? '#ffffff !important' : '#000000 !important',
          },
          'button:focus': {
            outline: 'none !important',
            textDecoration: 'none !important'
          },
          '.MuiButton-root': {
            textDecoration: 'none !important'
          },
          '.MuiButton-root:focus': {
            outline: 'none !important',
            textDecoration: 'none !important'
          },
          '.MuiButtonBase-root:focus-visible': {
            outline: 'none !important',
            boxShadow: 'none !important'
          },
          '.MuiButtonBase-root.MuiButton-root::after': {
            display: 'none !important'
          },
          '[role="button"]:focus': {
            outline: 'none !important',
          }
        }}
      />
      {/* Add a global styling fix for React Router Links */}
      <style jsx global>{`
        a {
          color: ${isDarkMode ? '#ffffff' : '#000000'};
          text-decoration: none;
        }
        a:hover, a:focus, a:active, a:visited {
          color: ${isDarkMode ? '#ffffff' : '#000000'};
          text-decoration: none;
        }
      `}</style>
      <SkipLink />
      <AppBar 
        position="static" 
        sx={{
          backgroundColor: isDarkMode ? '#121212' : '#fff',
          boxShadow: isDarkMode ? '0 4px 20px rgba(0, 0, 0, 0.5)' : '0 2px 10px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Top row with logo and title */}
        <Toolbar 
          sx={{
            maxWidth: 'lg',
            width: '100%',
            margin: '0 auto',
            padding: { xs: '0.5rem 1rem', md: '0.5rem 2rem' },
            justifyContent: 'space-between'
          }}
        >
          <Box className="flex-shrink-0">
            <SmartToyIcon 
              sx={{ 
                fontSize: 36,
                color: isDarkMode ? '#ffffff' : '#000000',
                display: { xs: 'none', sm: 'block' }
              }} 
            />
          </Box>

          <Box className="flex-grow flex justify-center">
            <Typography 
              variant="h5" 
              sx={{
                display: 'flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
                fontWeight: 700,
                fontSize: { xs: '1.3rem', sm: '1.5rem' },
                color: isDarkMode ? '#fff' : '#333'
              }}
            >
              The Bare Basics of AI
            </Typography>
          </Box>

          {/* Authentication section for desktop */}
          {!isMobile && authMenuItems}

          {/* Mobile menu button */}
          {isMobile && (
            <Box className="flex-shrink-0">
              <IconButton 
                onClick={handleDrawerOpen}
                aria-label="menu"
                sx={{
                  color: isDarkMode ? '#fff' : '#333'
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>

        {/* Bottom row with navigation links (desktop only) */}
        {!isMobile && (
          <Box 
            sx={{
              backgroundColor: isDarkMode ? '#1e1e1e' : '#f5f5f5',
              borderTop: isDarkMode ? '1px solid #333' : '1px solid #e0e0e0'
            }}
          >
            <Box 
              sx={{
                maxWidth: 'lg',
                width: '100%',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Box 
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: { xs: 2, md: 4 },
                  py: 1,
                  alignItems: 'center'
                }}
              >
                {menuItems.map((item, index) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <React.Fragment key={item.path}>
                      <Button 
                        component={Link} 
                        to={item.path} 
                        disableRipple
                        sx={{
                          textTransform: 'none',
                          fontSize: '0.95rem',
                          fontWeight: 500,
                          color: isDarkMode ? '#e0e0e0' : '#555',
                          minWidth: 0,
                          px: 2,
                          borderBottom: isActive 
                            ? 'none' 
                            : 'none',
                          borderRadius: '4px',
                          position: 'relative',
                          paddingBottom: '4px',
                          textDecoration: 'none !important',
                          '&::before': isActive ? {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: '20%',
                            width: '60%',
                            height: '2px',
                            backgroundColor: isDarkMode ? '#ffffff' : '#000000',
                            borderRadius: '4px',
                          } : {},
                          '& a': {
                            textDecoration: 'none !important',
                          },
                          '&:hover': {
                            color: isDarkMode ? '#ffffff' : '#000000',
                            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                            textDecoration: 'none',
                            borderRadius: '4px',
                          },
                          '&:focus': {
                            outline: 'none !important',
                            borderRadius: '4px',
                          }
                        }}
                      >
                        {item.text}
                      </Button>
                    </React.Fragment>
                  );
                })}
              </Box>
            </Box>
          </Box>
        )}
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: {
            width: 240,
            backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
            color: isDarkMode ? '#e0e0e0' : '#555'
          }
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
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                color: isDarkMode ? '#fff' : '#333'
              }}
            >
              Menu
            </Typography>
          </Box>
          <Divider sx={{ mb: 2, backgroundColor: isDarkMode ? '#333' : '#e0e0e0' }} />
          
          {/* Navigation Links */}
          <List>
            {menuItems.map((item) => (
              <ListItem 
                key={item.path}
                component={Link}
                to={item.path}
                button
                onClick={handleDrawerClose}
                sx={{ 
                  borderRadius: '4px',
                  mb: 1,
                  bgcolor: location.pathname === item.path ? 
                    (isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)') : 
                    'transparent',
                  '&:hover': {
                    bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'
                  },
                  '&:focus': {
                    outline: 'none !important'
                  }
                }}
              >
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    style: { 
                      fontWeight: location.pathname === item.path ? 600 : 400,
                      color: isDarkMode ? '#e0e0e0' : '#555'
                    } 
                  }} 
                />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2, backgroundColor: isDarkMode ? '#333' : '#e0e0e0' }} />
          
          {/* Auth section in mobile */}
          {!loading && (
            <Box sx={{ mt: 'auto' }}>
              {user ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, px: 2 }}>
                    <Avatar 
                      sx={{ width: 32, height: 32, mr: 2, backgroundColor: isDarkMode ? '#555' : '#ddd' }}
                      src={user.photoURL}
                    >
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : <Person />}
                    </Avatar>
                    <Typography variant="body2" noWrap>
                      {user.displayName || user.email}
                    </Typography>
                  </Box>
                  <ListItem 
                    button
                    component={Link}
                    to="/profile"
                    onClick={handleDrawerClose}
                    sx={{ 
                      borderRadius: '4px',
                      mb: 1,
                      '&:hover': {
                        bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'
                      },
                      '&:focus': {
                        outline: 'none !important'
                      }
                    }}
                  >
                    <ListItemText primary="Profile" />
                  </ListItem>
                  <ListItem 
                    button
                    onClick={() => {
                      handleLogout();
                      handleDrawerClose();
                    }}
                    sx={{ 
                      borderRadius: '4px',
                      '&:hover': {
                        bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'
                      },
                      '&:focus': {
                        outline: 'none !important'
                      }
                    }}
                  >
                    <ListItemText primary="Logout" />
                  </ListItem>
                </>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button
                    fullWidth
                    component={Link}
                    to="/login"
                    variant="outlined"
                    onClick={handleDrawerClose}
                    sx={{
                      borderColor: isDarkMode ? '#e0e0e0' : '#555',
                      color: isDarkMode ? '#e0e0e0' : '#555',
                      '&:hover': {
                        borderColor: isDarkMode ? '#ffffff' : '#000000',
                        backgroundColor: 'transparent'
                      }
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    fullWidth
                    component={Link}
                    to="/register"
                    variant="contained"
                    onClick={handleDrawerClose}
                    sx={{
                      bgcolor: isDarkMode ? '#e0e0e0' : '#555',
                      color: isDarkMode ? '#1a1a1a' : '#fff',
                      '&:hover': {
                        bgcolor: isDarkMode ? '#ffffff' : '#000000'
                      }
                    }}
                  >
                    Register
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
}

export default Header; 