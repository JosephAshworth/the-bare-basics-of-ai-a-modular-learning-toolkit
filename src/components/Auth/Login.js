import { useState } from 'react'; // import useState, for managing state in functional components

import {
  useNavigate, // import useNavigate, for programmatic navigation
  Link as RouterLink // import Link as RouterLink, for creating navigable links
} from 'react-router-dom';

import { useAuth } from '../../context/AuthContext'; // import the useAuth hook from the AuthContext file. This hook provides authentication functionality

import { 
  Container, // import the Container component from MUI
  Box, // import the Box component from MUI
  Typography, // import the Typography component from MUI
  TextField, // import the TextField component from MUI
  Button, // import the Button component from MUI
  Paper, // import the Paper component from MUI
  Alert, // import the Alert component from MUI
  Link as MuiLink // import the Link component from MUI
} from '@mui/material';

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on dark or light mode

const Login = () => {

  const [email, setEmail] = useState(''); // for storing and updating the email input, initialised as an empty string
  const [password, setPassword] = useState(''); // for storing and updating the password input, initialised as an empty string
  const [error, setError] = useState(''); // for storing and updating the error message, initialised as an empty string
  const [loading, setLoading] = useState(false); // for storing and updating whether a login is in progress, initialised as a boolean value of false

  const navigate = useNavigate(); // for redirecting users to a different page after login

  const { signIn, authError } = useAuth(); // for signing in a user and handling any authentication errors
  const theme = useTheme(); // for getting the MUI theme object

  const handleLogin = async (e) => { // asynchronous function for handling the login form submission
    e.preventDefault(); // prevents the default form submission behaviour

    setError(''); // resets any previous error messages to an empty string
    setLoading(true); // sets the loading state to true to indicate that the login is in progress

    try { // try to sign in the user
      await signIn(email, password); // attempts to sign in the user with the provided email and password
      navigate('/'); // redirects the user to the home page after successful login
    } catch (error) {
      if (error.code === 'auth/invalid-credential') { // checks if the error code is 'auth/invalid-credential'
        setError('Invalid email or password. Please check your credentials and try again.'); // sets an error message if the credentials are invalid
      } else {
        setError(error.message || authError || 'Login failed. Please try again.'); // sets an error message if the login fails
      }
    } finally { // finally, regardless of success or failure
      setLoading(false); // sets the loading state to false after the attempt
    }
  };

  return ( // returns the login component
    <Container // the container component is used to wrap the login form
        component="main" // sets the component to main, this is used to create a main container for the page
        maxWidth={false} // explicitly disable maxWidth, this is used to ensure the login form is a suitable width for the screen
        sx={{ 
            display: 'flex', // sets the display to flex, this is used to align the login form in the centre of the screen
            alignItems: 'center', // sets the align items to centre, this is used to centre the login form horizontally
            justifyContent: 'center', // sets the justify content to centre, this is used to centre the login form vertically
            minHeight: '100vh', // sets the min height to 100vh, this is used to ensure the login form is a suitable height for the screen
            bgcolor: theme.palette.background.default // sets the background colour to the default background colour, this is used to ensure the login form is a suitable colour for the theme
        }}
    >
      <Paper 
        elevation={3} // set the elevation to 3, this is used to give the login form a shadow
        sx={{ 
            p: 4, // adds internal space to the login form
            display: 'flex', // sets the display to flex, this is used to align the login form in the centre of the screen
            flexDirection: 'column', // makes the login form a vertical column
            alignItems: 'center', // centres the login form horizontally
            maxWidth: '1000px', // sets the max width to 1000px
            bgcolor: theme.palette.background.paper, // sets the background colour to the paper background colour, this is used to ensure the login form is a suitable colour for the theme
            borderRadius: 2 // adds some rounding to the login form
        }}
      >
        <Typography
          variant="h5" // set the variant to h5, this is used to set the font size of the login form title
          sx={{
            color: theme.palette.text.primary // set the title colour to the primary text colour, this is used to ensure the login form is a suitable color for the theme
          }}
        >
          Log in to your account {/* the login form title */}
        </Typography>

        <Typography
          variant="h5" // set the variant to h5, this is used to set the font size of the login form title
          sx={{
            color: theme.palette.text.primary // set the title colour to the primary text colour, this is used to ensure the login form is a suitable color for the theme
          }}
        >
          Note: All details are stored securely and never in plain text {/* the login form title */}
        </Typography>
        
        <Box
          component="form" // set the component to form, this is used to create a form
          onSubmit={handleLogin} // set the onSubmit event to the handleLogin function, this is used to handle the form submission
          sx={{
            mt: 1, // set the margin top to 1, this is used to add space between the title and the form
            width: '100%' // set the width to 100%, so the form takes the full width of the parent
          }}
        >
          {error && ( // if there is an error, display the error message
            <Alert
              severity="error" // sets the severity to error, this is used to display an error message
              sx={{
                width: '100%', // sets the width to 100%, so the error message takes the full width of the parent
                mb: 2 // sets the margin bottom to 2, this is used to add space between the error message and the form
              }}
            >
              {error} {/* displays the error message */}
            </Alert>
          )}
          <TextField // the text field component is used to create a text input field
            margin="normal" // sets the margin to normal, this is used to add space between the text field and the form
            required // sets the required prop to true, this is used to ensure the text field is required
            fullWidth // sets the full width to true, so the text field takes the full width of the parent
            id="email" // sets the id to email, this is used to identify the text field
            label="Email Address" // sets the label to Email Address, this is used to label the text field
            name="email" // sets the name to email, this is used to identify the text field
            autoComplete="email" // sets the autoComplete prop to email, this is used to provide a hint to the user about the type of input
            autoFocus // sets the autoFocus prop to true, this is used to focus the text field when the page loads
            value={email} // sets the value to the email state, this is used to display the email in the text field
            onChange={(e) => setEmail(e.target.value)} // sets the onChange event to the setEmail function, this is used to update the email state when the user types in the text field

          />
          <TextField // the text field component is used to create a text input field
            margin="normal" // sets the margin to normal, this is used to add space between the text field and the form
            required // sets the required prop to true, this is used to ensure the text field is required
            fullWidth // sets the full width to true, so the text field takes the full width of the parent
            name="password" // sets the name to password, this is used to identify the text field
            label="Password" // sets the label to Password, this is used to label the text field
            type="password" // sets the type to password, this is used to ensure the text field is a password input
            id="password" // sets the id to password, this is used to identify the text field
            autoComplete="current-password" // sets the autoComplete prop to current-password, this is used to provide a hint to the user about the type of input
            value={password} // sets the value to the password state, this is used to display the password in the text field
            onChange={(e) => setPassword(e.target.value)} // sets the onChange event to the setPassword function, this is used to update the password state when the user types in the text field
          />
          <Button // the button component is used to create a button
            type="submit" // sets the type to submit, this is used to submit the form
            fullWidth // sets the full width to true, so the button takes the full width of the parent
            variant="contained" // sets the variant to contained, this is used to create a button with a background colour
            disabled={loading} // sets the disabled prop to loading, this is used to disable the button if the login is in progress
            sx={{ 
              mt: 3, // sets the margin top to 3, this is used to add space between the button and the area above it
              mb: 2 // sets the margin bottom to 2, this is used to add space between the button and the area below the form
            }}
          >
            {loading ? 'Logging in...' : 'Log in'} {/* if the login is in progress, display the text Logging in..., otherwise display the text Log in */}
          </Button>
          
          <Box sx={{ textAlign: 'center' }}> {/* the box component is used to create a box, this is used to centre the text */}
             <MuiLink 
                component={RouterLink} // use RouterLink for navigation
                to="/register" // sets the to prop to the register page, this is used to navigate to the register page
                variant="body2" // sets the variant to body2, this is used to set the font size of the text
             >
              {"Don't have an account? Register"} {/* allow the user to navigate to the register page if they don't have an account */}
             </MuiLink>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login; // Export the Login component as the default export, making it available to be used in other files
