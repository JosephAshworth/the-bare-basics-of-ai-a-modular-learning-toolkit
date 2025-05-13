// the register page (when the user is not logged in and they click the register button)

import { useState } from 'react';

// creating a new user and updating their profile using firebase authentication
import { 
  createUserWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth';

// authentication
import { auth } from '../../firebase';

// navigation
import { 
  useNavigate,
  Link as RouterLink
} from 'react-router-dom';

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

// manage the theme based on dark or light mode
import { useTheme } from '@mui/material/styles';

const Register = () => {

  // state variables for managing form inputs and status, all originally nothing or false
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();


  const theme = useTheme();

  const handleRegister = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password); // create a user with an email and password
      await updateProfile(result.user, {
        displayName: displayName // update the display name of the user
      });
      navigate('/'); // navigate to the home page
    }
    
    catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('An account with this email address already exists. Please log in or use a different email.');
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container 
      component="main"
      maxWidth={false}
      sx={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: theme.palette.background.default
      }}
    >
      <Paper 
        elevation={3}
        sx={{ 
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: '1000px',
            bgcolor: theme.palette.background.paper,
            borderRadius: 2
        }}
      >
        <Typography 
          variant="h5"
          sx={{ 
            color: theme.palette.text.primary
          }}
        >
          Create your account
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
          component="form"
          onSubmit={handleRegister} // handle the register on form submission
          sx={{ 
            mt: 1,
            width: '100%'
          }}
        >
          {error && (
            <Alert severity="error"
              sx={{ 
                width: '100%',
                mb: 2
              }}
            >
              {error}
            </Alert>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            id="displayName"
            label="Display Name"
            name="displayName"
            autoComplete="name"
            autoFocus
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Creating account...' : 'Register'}
          </Button>
          
          <Box sx={{ textAlign: 'center' }}>
             <MuiLink 
                component={RouterLink}
                to="/login"
                variant="body2"
             >
              {"Already have an account? Log in"}
             </MuiLink>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;