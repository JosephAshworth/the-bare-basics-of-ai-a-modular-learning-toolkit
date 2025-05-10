import { useState } from 'react'; // import useState, for managing state in functional components

import { 
  createUserWithEmailAndPassword, // import createUserWithEmailAndPassword, for creating a new user with an email and password
  updateProfile // import updateProfile, for updating the user's profile
} from 'firebase/auth';

import { auth } from '../../firebase'; // import the Firebase authentication instance from the firebase file

import { 
  useNavigate, // import useNavigate, for programmatic navigation
  Link as RouterLink // import Link as RouterLink, for creating navigable links
} from 'react-router-dom';

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

const Register = () => {
  const [email, setEmail] = useState(''); // for storing and updating the email input, initialised as an empty string
  const [password, setPassword] = useState(''); // for storing and updating the password input, initialised as an empty string
  const [displayName, setDisplayName] = useState(''); // for storing and updating the display name input, initialised as an empty string
  const [error, setError] = useState(''); // for storing and updating the error message, initialised as an empty string
  const [loading, setLoading] = useState(false); // for storing and updating whether a registration is in progress, initialised as a boolean value of false
  const navigate = useNavigate(); // for redirecting users to a different page after registration
  const theme = useTheme(); // for getting the MUI theme object

  const handleRegister = async (e) => { // asynchronous function for handling the registration form submission
    e.preventDefault(); // prevents the default form submission behaviour

    setError(''); // resets any previous error messages to an empty string
    setLoading(true); // sets the loading state to true to indicate that the registration is in progress

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password); // attempts to create a new user with the provided email and password
      await updateProfile(result.user, { // updates the user's profile with the provided display name
        displayName: displayName // sets the display name to the value of the displayName state variable
      });
      navigate('/'); // redirects the user to the home page after successful registration
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') { // checks if the error code is 'auth/email-already-in-use'
        setError('An account with this email address already exists. Please log in or use a different email.'); // sets an error message if the email is already in use
      } else {
        setError(error.message); // sets an error message if the registration fails
      }
    } finally {
      setLoading(false); // sets the loading state to false after the attempt, regardless of success or failure
    }
  };

  return (
    <Container 
      component="main" // sets the component to main, this is used to create a main container for the page
      maxWidth={false} // explicitly disable maxWidth, this is used to ensure the registration form is a suitable width for the screen
      sx={{ 
        display: 'flex', // sets the display to flex, this is used to align the registration form in the centre of the screen
        alignItems: 'center', // centres the registration form horizontally
        justifyContent: 'center', // centres the registration form vertically
        minHeight: '100vh', // sets the min height to 100vh, this is used to ensure the registration form is a suitable height for the screen
        bgcolor: theme.palette.background.default // sets the background colour to the default background colour, this is used to ensure the registration form is a suitable colour for the theme
      }}
    >
      <Paper 
        elevation={3} // sets the elevation to 3, this is used to give the registration form a shadow
        sx={{ 
            p: 4, // adds internal space to the registration form
            display: 'flex', // sets the display to flex, this is used to align the registration form in the centre of the screen
            flexDirection: 'column', // makes the registration form a vertical column
            alignItems: 'center', // centres the registration form horizontally
            maxWidth: '1000px', // sets the max width to 1000px
            bgcolor: theme.palette.background.paper, // sets the background colour to the paper background colour, this is used to ensure the registration form is a suitable colour for the theme
            borderRadius: 2 // adds some rounding to the registration form
        }}
      >
        <Typography 
          variant="h5" // sets the variant to h5, this is used to set the font size of the title
          sx={{ 
            color: theme.palette.text.primary // set the text colour to the primary text colour, this is used to ensure the text is a suitable colour for the theme
          }}
        >
          Create your account {/* the registration form title */}
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
          component="form" // sets the component to form, this is used to create a form
          onSubmit={handleRegister} // sets the onSubmit event to the handleRegister function, this is used to handle the form submission
          sx={{ 
            mt: 1, // sets the margin top to 1, this is used to add space between the title and the form
            width: '100%' // sets the width to 100%, so the form takes the full width of the parent
          }}
        >
          {error && ( // if there is an error, display the error message
            <Alert severity="error" // sets the severity to error, this is used to display an error message
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
            id="displayName" // sets the id to displayName, this is used to identify the text field
            label="Display Name" // sets the label to Display Name, this is used to label the text field
            name="displayName" // sets the name to displayName, this is used to identify the text field
            autoComplete="name" // sets the autoComplete prop to name, this is used to provide a hint to the user about the type of input
            autoFocus // sets the autoFocus prop to true, this is used to focus the text field when the page loads
            value={displayName} // sets the value to the displayName state, this is used to display the displayName in the text field
            onChange={(e) => setDisplayName(e.target.value)} // sets the onChange event to the setDisplayName function, this is used to update the displayName state when the user types in the text field
          />
          <TextField // the text field component is used to create a text input field
            margin="normal" // sets the margin to normal, this is used to add space between the text field and the form
            required // sets the required prop to true, this is used to ensure the text field is required
            fullWidth // sets the full width to true, so the text field takes the full width of the parent
            id="email" // sets the id to email, this is used to identify the text field
            label="Email Address" // sets the label to Email Address, this is used to label the text field
            name="email" // sets the name to email, this is used to identify the text field
            autoComplete="email" // sets the autoComplete prop to email, this is used to provide a hint to the user about the type of input
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
            autoComplete="new-password" // sets the autoComplete prop to new-password, this is used to provide a hint to the user about the type of input
            value={password} // sets the value to the password state, this is used to display the password in the text field
            onChange={(e) => setPassword(e.target.value)} // sets the onChange event to the setPassword function, this is used to update the password state when the user types in the text field
          />
          <Button // the button component is used to create a button
            type="submit" // sets the type to submit, this is used to submit the form
            fullWidth // sets the full width to true, so the button takes the full width of the parent
            variant="contained" // sets the variant to contained, this is used to create a button with a background colour
            disabled={loading} // sets the disabled prop to loading, this is used to disable the button if the registration is in progress
            sx={{ mt: 3, mb: 2 }} // sets the margin top to 3, this is used to add space between the button and the area above it, and the margin bottom to 2, this is used to add space between the button and the area below the form
            >
              {loading ? 'Creating account...' : 'Register'} {/* if the registration is in progress, display the text Creating account..., otherwise display the text Register */}
          </Button>
          
          <Box sx={{ textAlign: 'center' }}> {/* the box component is used to create a box, this is used to centre the text */}
             <MuiLink 
                component={RouterLink} // Use RouterLink for navigation
                to="/login" // sets the to prop to the login page, this is used to navigate to the login page
                variant="body2" // sets the variant to body2, this is used to set the font size of the text
             >
              {"Already have an account? Log in"} {/* allow the user to navigate to the login page if they already have an account */}
             </MuiLink>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register; // Export the Register component as the default export, making it available to be used in other files
