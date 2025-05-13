// the footer itself

// material ui components
import {
  Box,
  Container,
  Typography,
} from '@mui/material';

import { useTheme } from '@mui/material/styles';

function Footer() {
  const theme = useTheme();

  return (
    <Box
      component="footer" // specify that it is a footer
      sx={{
        py: 5,
        bgcolor: theme.palette.background.default
      }}
    >
      {/* sets the maximum width of the container to 'lg' (large), ensuring the content is responsive and fits well on larger screens */}
      <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary
              }}
            >
              © {new Date().getFullYear()} The Bare Basics of AI: A Modular Learning Toolkit. All rights reserved.
            </Typography>
          </Box>
      </Container>
    </Box>
  );
}

export default Footer;