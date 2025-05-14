// the login page (this is shown the first time the user opens the app and they are not logged in)

// for managing state in components
import { useState } from 'react';

// for managing navigation
import {
  useNavigate,
  Link as RouterLink
} from 'react-router-dom';

// for managing authentication
import { useAuth } from '../../context/AuthContext';

// material ui components
import { 
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Link as MuiLink
} from '@mui/material';

// for managing the theme, based on dark or light mode
import { useTheme } from '@mui/material/styles';

const Login = () => {

  // state variables for managing form inputs and status, all originally nothing or false
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // navigation
  const navigate = useNavigate();

  // authentication
  const { signIn, authError } = useAuth();
  const theme = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault(); // prevent the default action of the form (refreshing the page)

    setError('');
    setLoading(true);

    try {
      await signIn(email, password); // sign in the user
      navigate('/'); // navigate to the home page
    }
    catch (error) {
      if (error.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please check your credentials and try again.');
      } else {
        setError(error.message || authError || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // return means to actually display the component on the screen
  return (
    <Container
        component="main" // the main container for the login page
        maxWidth={false} // explicitly set the max width to false, so the container takes the full width of the screen
        sx={{ 
            display: 'flex', // use flexbox layout to align items
            alignItems: 'center', // vertically centre the content
            justifyContent: 'center', // horizontally centre the content
            minHeight: '100vh', // ensure the container takes at least the full height of the viewport
            bgcolor: theme.palette.background.default // set the background colour to the default background colour defined in the palette in the styles/theme file
        }}
    >
      {/* the container for the login page */}
      <Paper 
        elevation={3}
        sx={{ 
            p: 4, // add inside padding, with space aroud the content
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: '1000px',
            bgcolor: theme.palette.background.paper,
            borderRadius: 2 // round the corners of the paper
        }}
      >
        {/* the title of the login page */}
        <Typography
          variant="h5"
          sx={{
            color: theme.palette.text.primary
          }}
        >
          Log in to your account
        </Typography>

        <Typography
          variant="h5"
          sx={{
            color: theme.palette.text.primary
          }}
        >
          Note: All details are stored securely and never in plain text
        </Typography>
        
        <Box
          component="form" // the form element for the login page
          onSubmit={handleLogin} // log the user in when the form is submitted
          sx={{
            mt: 1, // add a top margin of one, for space
            width: '100%' // take the full width of the container
          }}
        >
          {/* if there is an error, display the error message */}
          {error && (
            <Alert
              severity="error" // display the error message in red
              sx={{
                width: '100%',
                mb: 2
              }}
            >
              {error}
            </Alert>
          )}

          {/* the email input field */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)} // update the email state when the input changes
          />

          {/* the password input field */}
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />
          <Button
            type="submit" // submit the form when the button is clicked
            fullWidth
            variant="contained" // add a filled background colour to the button
            disabled={loading} // disable the button if the user is loading
            sx={{ 
              mt: 3,
              mb: 2 // add a bottom margin of two, for space
            }}
          >
            {loading ? 'Logging in...' : 'Log in'} {/* determine the text of the button based on the loading state */}
          </Button>
          
          <Box sx={{ textAlign: 'center' }}>
            <MuiLink 
              component={RouterLink} // for routing to the register page
              to="/register" 
              variant="body2"
            >
              {"Don't have an account? Register"}
            </MuiLink>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login; // export to allow the component to be used in other files
