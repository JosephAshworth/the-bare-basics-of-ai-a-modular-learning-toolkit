import 
  React, // import React
  { 
    useState, // import useState, this is used to manage state in functional components
    useEffect // import useEffect, this is used to manage side effects in functional components
  } 
from 'react';

import { 
  AppBar, // import the AppBar component from MUI
  Toolbar, // import the Toolbar component from MUI
  Typography, // import the Typography component from MUI
  Button, // import the Button component from MUI
  IconButton, // import the IconButton component from MUI
  useMediaQuery, // import the useMediaQuery hook from MUI
  Drawer, // import the Drawer component from MUI
  List, // import the List component from MUI
  ListItem, // import the ListItem component from MUI
  ListItemText, // import the ListItemText component from MUI
  Box, // import the Box component from MUI
  Divider, // import the Divider component from MUI
  Avatar, // import the Avatar component from MUI
  Menu, // import the Menu component from MUI
  MenuItem, // import the MenuItem component from MUI
  CircularProgress // import the CircularProgress component from MUI
} from '@mui/material';

import { 
  Menu as MenuIcon, // import the Menu icon from the @mui/icons-material library
  SmartToy as SmartToyIcon, // import the SmartToy icon from the @mui/icons-material library
  Person, // import the Person icon from the @mui/icons-material library
  Launch as LaunchIcon // import Launch icon
} from '@mui/icons-material'; // import the Material-UI icons from the @mui/icons-material library

import { 
  Link, // import the Link component from the react-router-dom library, used to create links
  useLocation, // import the useLocation component from the react-router-dom library, used to get the current location
  useNavigate // import the useNavigate component from the react-router-dom library, used to navigate to a new page
} from 'react-router-dom';

import { auth } from '../../firebase'; // import the Firebase authentication instance from the firebase file

import { signOut } from 'firebase/auth'; // import the signOut function from the firebase/auth library. This is used to sign out the user

import { onAuthStateChanged } from 'firebase/auth'; // import the onAuthStateChanged function from firebase/auth to listen for authentication state changes

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on dark or light mode

function Header() {
  const theme = useTheme(); // for getting the MUI theme object
  const location = useLocation(); // for getting the location from the location context
  const navigate = useNavigate(); // for getting the navigate function from the navigate context
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // for checking if the screen is mobile
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // for setting the isDrawerOpen state to false
  
  const [user, setUser] = useState(null); // for setting the user state to null
  const [loading, setLoading] = useState(true); // for setting the loading state to true
  const [anchorEl, setAnchorEl] = useState(null); // for setting the anchor element to null

  useEffect(() => {
    if (!auth) { // for checking if the auth instance is not initialised
      console.error('Firebase auth is not initialised.'); // for logging an error
      setLoading(false); // for setting loading to false as the authentication has not happened
      return; // for exiting
    }
  
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => { // for subscribing to changes in the authentication state
      setUser(currentUser); // for updating the local user state with the authenticated user
      setLoading(false); // for setting loading to false as the authentication check is complete
    });
  
    return () => unsubscribe(); // for cleaning up the listener when the component unmounts
  }, []);

  const handleDrawerOpen = () => { // for handling the drawer open event
    setIsDrawerOpen(true); // for setting the isDrawerOpen state to true, which is used to open the drawer
  };

  const handleDrawerClose = () => { // for handling the drawer close event
    setIsDrawerOpen(false); // for setting the isDrawerOpen state to false, which is used to close the drawer
  };

  const handleMenuOpen = (event) => { // for handling the menu open event
    setAnchorEl(event.currentTarget); // for setting the anchor element to the current target, which is used to open the profile menu
  };

  const handleMenuClose = () => { // for handling the close menu event
    setAnchorEl(null); // for setting the anchor element to null, which is used to close the profile menu
  };

  const handleLogout = async () => { // for handling the logout event
    try {
      await signOut(auth); // for signing out the user
      handleMenuClose(); // for closing the profile menu
      navigate('/login'); // for navigating to the login page
    } catch (error) {
      console.error('Error logging out:', error); // for logging the error to the console
    }
  };

  const menuItems = [ // for defining the menu items
    { text: 'Home', path: '/' }, // for defining the home menu item, with the path to the home page
    { text: 'Get Started', path: '/welcome' }, // for defining the get started menu item, with the path to the welcome page
    { text: 'Machine Learning', path: '/machine-learning' }, // for defining the machine learning menu item, with the path to the machine learning page
    { text: 'Emotion Detection', path: '/emotion-detection' }, // for defining the emotion detection menu item, with the path to the emotion detection page
    { text: 'Fuzzy Logic', path: '/fuzzy-logic' }, // for defining the fuzzy logic menu item, with the path to the fuzzy logic page
    { text: 'Feedback Survey', path: 'https://docs.google.com/forms/d/e/1FAIpQLSelUUSSj0XvFxl_2-5uxbfR_GBQRChuKAE4HMnm6kJRoHf_FA/viewform?usp=sharing' } // for defining the feedback survey menu item, with the path to the feedback survey link
  ];

  if (loading) { // if the authentication state is loading
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress size={24} /> {/* display a loading spinner */}
      </Box>
    );
  }  

  return (
    <>
      <AppBar // for defining the app bar component
        position="static" // for defining the position of the app bar as static, which means it will be fixed at the top of the screen
        sx={{
          backgroundColor: theme.palette.background.paper, // for setting the background colour of the app bar to the paper colour of the theme
          boxShadow: theme.shadows[2], // for setting the box shadow of the app bar to the second shadow of the theme
        }}
      >
        <Toolbar> {/* for defining the toolbar component, which is used to display the app bar */}
          <Box className="flex-shrink-0"> {/* for defining the box component, which is used to display the smart toy icon, the flex shrink 0 property is used to ensure the icon does not shrink when the screen is resized */}
            <SmartToyIcon 
              sx={{ 
                fontSize: 36, // for setting the font size of the smart toy icon
                color: theme.palette.text.primary, // for setting the text colour of the smart toy icon to the primary text colour of the theme
              }} 
            />
          </Box>

          <Box className="flex-grow flex justify-center"> {/* for defining the box component, which is used to display the title of the app, the flex grow property is used to ensure the title takes up the remaining space, and the flex justify centre property is used to centre the title */}
            <Typography 
              sx={{
                textAlign: 'center', // for setting the text alignment of the title, which is centre to ensure the title is centred
                fontWeight: 700, // for setting the font weight of the title, which is 700 to ensure the title is bold
                fontSize: { xs: '1.3rem', sm: '1.5rem' }, // for setting the font size of the title, which is 1.3rem if the screen is small and 1.5rem if the screen is large
                color: theme.palette.text.primary, // for setting the text colour of the title to the primary text colour of the theme
                px: 5 // for setting the horizontal padding of the title to 5, which is the amount of space between the title and the left and right of the screen
              }}
            >
              The Bare Basics of AI: A Modular Learning Toolkit {/* for setting the title of the app */}
            </Typography>
          </Box>

          {!isMobile && user && ( // for defining the profile icon, which is displayed if the screen is not mobile and the user is logged in
            <Box className="flex-shrink-0"> {/* for defining the box component, which is used to display the profile icon */}
              <IconButton onClick={handleMenuOpen}> {/* for defining the icon button component, which is used to open the profile menu */}
                <Avatar src={user.photoURL}> {/* for defining the avatar component, which is used to display the user's profile picture */}
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : <Person />} {/* for displaying the user's initial or a person icon if no display name */}
                </Avatar>
              </IconButton>
              <Menu // for defining the menu component, which is used to display the profile menu
                anchorEl={anchorEl} // for setting the anchor element of the menu
                open={Boolean(anchorEl)} // for setting the open state of the menu
                onClose={handleMenuClose} // for setting the onClose event of the menu
              >
                <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>Profile</MenuItem> {/* for defining the profile menu item */}
                <MenuItem onClick={handleLogout}>Logout</MenuItem> {/* for defining the logout menu item */}
              </Menu>
            </Box>
          )}

          {isMobile && ( // for defining the menu icon, which is displayed if the screen is mobile
            <Box className="flex-shrink-0"> {/* for defining the box component, which is used to display the menu icon, the flex shrink 0 property is used to ensure the icon does not shrink when the screen is resized */}
              <IconButton 
                onClick={handleDrawerOpen} // for setting the onClick event of the menu icon, which is used to open the drawer
                aria-label="menu" // for setting the aria-label of the menu icon, which is used to describe the menu icon
                sx={{
                  color: theme.palette.text.primary // for setting the text colour of the menu icon to the primary text colour of the theme
                }}
              >
                <MenuIcon /> {/* for setting the menu icon */}
              </IconButton>
            </Box>
          )}
        </Toolbar>

        {!isMobile && ( // for defining the menu, which is displayed if the screen is not mobile
          <Box 
            sx={{
              backgroundColor: theme.palette.background.default, // for setting the background colour of the menu to the default background colour of the theme
              borderTop: `1px solid ${theme.palette.divider}` // for setting the border top of the menu to the divider colour of the theme
            }}
          >
            <Box>
              <Box 
                sx={{
                  display: 'flex', // for setting the display of the menu to flex to ensure the menu is displayed in a row 
                  justifyContent: 'center', // for setting the justify content of the menu to centre to ensure the menu is centred
                  gap: { xs: 2, md: 4 }, // for setting the gap of the menu to 2 if the screen is small and 4 if the screen is large
                  py: 1, // for setting the padding of the menu to 1 to ensure the menu is not too wide
                  alignItems: 'center' // for setting the align items of the menu to centre to ensure the menu is centred
                }}
              >
                {menuItems.map((item) => { // for defining the menu items, which is a list of items that are displayed in the menu
                  const isActive = location.pathname === item.path; // for setting the isActive state, which is true if the current path is the same as the path of the item
                  const isExternal = item.path.startsWith('http'); // for checking if the path is an external URL

                  const commonButtonSx = {
                    textAlign: 'center', // for setting the text align of the button to centre to ensure the button is centred
                    fontSize: '0.95rem', // for setting the font size of the button to 0.95rem to ensure the button is not too wide
                    paddingBottom: '4px', // for setting the padding of the button to 4px to ensure the button is not too wide
                    color: theme.palette.text.primary, // for setting the text colour of the button to the primary text colour of the theme
                    '&::before': isActive && !isExternal ? { // for defining the before pseudo-element of the button, which happens when the button is active
                      content: '""', // for defining the content of the button, which makes the button look like a link with a line under it
                      position: 'absolute', // for setting the position of the underline to absolute to ensure the underline is positioned correctly
                      bottom: 0, // for setting the bottom of the underline to 0 to ensure the underline is at the bottom of the button
                      left: 0, // for setting the left of the underline to 0 to ensure the underline is at the left of the button
                      width: '100%', // for setting the width of the underline to 100% to ensure the underline is the width of the button
                      height: '2px', // for setting the height of the underline to 2px to ensure the underline is not too tall
                      backgroundColor: theme.palette.primary.main, // for setting the background colour of the underline to the primary colour of the theme
                    } : {},
                    '&:hover': { // for setting the hover pseudo-element of the button, which happens when the button is hovered over
                      backgroundColor: theme.palette.action.hover // for setting the background colour of the button to the hover colour of the theme
                    }
                  };

                  return (
                    <React.Fragment key={item.path}> {/* for defining the React fragment component, which is used to display the menu items */}
                      <Button 
                        component={isExternal ? 'a' : Link} // for setting the component of the button to 'a' for external links and Link for internal links
                        href={isExternal ? item.path : undefined} // for setting the href of the button to the path of the item if it is an external link and undefined if it is an internal link
                        to={!isExternal ? item.path : undefined} // for setting the to of the button to the path of the item if it is an internal link and undefined if it is an external link
                        target={isExternal ? '_blank' : undefined} // for setting the target of the button to '_blank' for external links and undefined if it is an internal link
                        rel={isExternal ? 'noopener noreferrer' : undefined} // for setting the rel of the button to 'noopener noreferrer' for external links and undefined if it is an internal link
                        sx={commonButtonSx} // for setting the sx of the button to the commonButtonSx
                      >
                        {item.text} {/* for setting the text of the button */}
                        {isExternal && item.text === 'Feedback Survey' && <LaunchIcon sx={{ ml: 0.5, fontSize: 'inherit' }} />} {/* for setting the LaunchIcon specifically for the Survey link (which is external) */}
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
        anchor="right" // for defining the anchor of the drawer, which is right to ensure the drawer is on the right side of the screen
        open={isDrawerOpen} // for defining the open state of the drawer, which is true to ensure the drawer is open
        onClose={handleDrawerClose} // for defining the onClose event of the drawer, which is used to close the drawer
        PaperProps={{
          sx: { width: 250 } // for setting the width of the drawer to 250
        }}
      >
        <Box
          sx={{
            padding: '1rem', // for setting the padding of the drawer to 1rem to ensure there is space between the menu items and the drawer
            display: 'flex', // for setting the display of the drawer to flex to ensure the drawer is displayed in a row
            flexDirection: 'column', // for setting the flex direction of the drawer to column to ensure the drawer is displayed in a column
            height: '100%' // for setting the height of the drawer to 100% to ensure the drawer is the height of the screen
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', // for setting the display of the box to flex to ensure the box is displayed in a row
              justifyContent: 'center', // for setting the justify content of the box to centre to ensure the box is centred
              mb: 2 // for setting the margin bottom of the box to 2 to ensure there is space between the title and the menu items
            }}> 
            <Typography 
              sx={{ 
                fontWeight: 700, // for setting the font weight of the title to 700 to ensure the title is bold
                color: theme.palette.text.primary // for setting the text colour of the title to the primary text colour of the theme
              }}
            >
              Menu {/* for setting the title of the drawer */}
            </Typography>
          </Box>
          <Divider
            sx={{ 
              mb: 2, // for setting the margin bottom of the divider to 2 to ensure there is space between the title and the menu items
              bgcolor: theme.palette.divider // for setting the background colour of the divider to the divider colour of the theme
            }} 
          />
          
          <List> {/* for setting the list component, which is used to display the menu items */}
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path; // for setting the isActive state, which is true if the current path is the same as the path of the item
              const isExternal = item.path.startsWith('http'); // for checking if the path is an external URL

              const commonListItemSx = {  // for setting the common list item styles
                borderRadius: '4px', // for setting the border radius of the list item to 4px to ensure the list item is rounded
                mb: 1, // for setting the margin bottom of the list item to 1 to ensure there is space between the list items
                bgcolor: isActive && !isExternal ? theme.palette.primary.main : 'transparent', // for setting the background colour of the list item to the primary colour of the theme if the list item is active and not external and transparent if it is not active or external
                color: isActive && !isExternal ? theme.palette.primary.contrastText : 'inherit', // for setting the text colour of the list item to the primary contrast text colour of the theme if the list item is active and not external and inherit if it is not active or external
                '&:hover': { // for setting the hover pseudo-element of the list item, which happens when the list item is hovered over
                  bgcolor: isActive && !isExternal
                    ? theme.palette.primary.main // for setting the background colour of the list item to the primary colour of the theme if the list item is active and not external
                    : theme.palette.action.hover // for setting the background colour of the list item to the hover colour of the theme if the list item is not active or external
                  }
              };

              return (
                <ListItem 
                  key={item.path} // for setting the key of the list item to the path of the item
                  component={isExternal ? 'a' : Link} // for setting the component of the list item to 'a' for external links and Link for internal links
                  href={isExternal ? item.path : undefined} // for setting the href of the list item to the path of the item if it is an external link and undefined if it is an internal link
                  to={!isExternal ? item.path : undefined} // for setting the to of the list item to the path of the item if it is an internal link and undefined if it is an external link
                  target={isExternal ? '_blank' : undefined} // for setting the target of the list item to '_blank' for external links and undefined if it is an internal link
                  rel={isExternal ? 'noopener noreferrer' : undefined} // for setting the rel of the list item to 'noopener noreferrer' for external links and undefined if it is an internal link, this is used to prevent the page from being opened in a new tab
                  onClick={handleDrawerClose} // for setting the onClick event of the list item to handleDrawerClose, which is used to close the drawer
                  sx={commonListItemSx} // for setting the sx (styles) of the list item to the commonListItemSx
                >
                  <ListItemText 
                    primary={item.text} // for setting the primary text of the list item to the text of the item
                    sx={{ flexGrow: 1 }} // for setting the flex grow of the list item to 1 to ensure the text takes up the remaining space
                    primaryTypographyProps={{ // for setting the primary typography props of the list item to the text of the item
                      style: { 
                        fontWeight: isActive && !isExternal ? 600 : 400 // for setting the font weight of the text of the list item to 600 if the list item is active and not external and 400 if it is not active or external
                      },
                      sx: { 
                        textAlign: 'center' // for setting the text align of the text of the list item to centre to ensure the text is centred
                       } 
                    }} 
                  />
                  {isExternal && item.text === 'Feedback Survey' && <LaunchIcon sx={{ fontSize: '1rem' }} />} {/* for setting the LaunchIcon specifically for the Survey link (which is external) */}
                </ListItem>
              );
            })}
            {user && ( // for setting the profile and logout buttons, which are displayed if the user is logged in
              <>
                <Divider sx={{ my: 2, bgcolor: theme.palette.divider }} /> {/* for setting the divider component, which is used to display a divider */}
                  <ListItem 
                    component={Link} // for setting the component of the list item to Link, which is used to create a link
                    to="/profile" // for setting the to of the list item to the profile page
                    onClick={handleDrawerClose} // for setting the onClick event of the list item to handleDrawerClose, which is used to close the drawer
                    sx={{ 
                      borderRadius: '4px', // for setting the border radius of the list item to 4px to ensure the list item is rounded
                      mb: 1, // for setting the margin bottom of the list item to 1 to ensure there is space between the list items
                      bgcolor: location.pathname === '/profile' ? theme.palette.primary.main : 'transparent', // for setting the background colour of the list item to the primary colour of the theme if the list item is active and not external and transparent if it is not active or external
                      color: location.pathname === '/profile' ? theme.palette.primary.contrastText : 'inherit', // for setting the text colour of the list item to the primary contrast text colour of the theme if the list item is active and not external and the text colour of the theme if it is not active or external
                      '&:hover': { // for setting the hover pseudo-element of the list item, which happens when the list item is hovered over
                        bgcolor: location.pathname === '/profile' 
                          ? theme.palette.primary.main // for setting the background colour of the list item to the primary colour of the theme if the list item is active and not external
                          : theme.palette.action.hover // for setting the background colour of the list item to the hover colour of the theme if the list item is not active or external
                      }
                    }}
                  >
                    <ListItemText primary="Profile"/> {/* for setting the primary text of the list item to the text of the item */}
                  </ListItem>
                  <ListItem 
                    onClick={() => { handleLogout(); handleDrawerClose(); }} // for setting the onClick event of the list item to handleLogout, which is used to logout the user and handleDrawerClose, which is used to close the drawer
                    sx={{ 
                      borderRadius: '4px', // for setting the border radius of the list item to 4px to ensure the list item is rounded
                      mb: 1, // for setting the margin bottom of the list item to 1 to ensure there is space between the list items
                      cursor: 'pointer', // for setting the cursor of the list item to pointer to ensure the cursor is a pointer when the list item is hovered over
                      '&:hover': { // for setting the hover pseudo-element of the list item, which happens when the list item is hovered over
                        bgcolor: theme.palette.action.hover // for setting the background colour of the list item to the hover colour of the theme
                      },
                    }}
                  >
                    <ListItemText primary="Logout" /> {/* for setting the primary text of the list item to the text of the item */}
                  </ListItem>
                </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default Header; // Export the Header component as the default export, making it available to be used in other files
