import {
  Box, // import the Box component from MUI
  Container, // import the Container component from MUI
  Typography, // import the Typography component from MUI
} from '@mui/material';

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on dark or light mode

function Footer() {
  const theme = useTheme(); // for getting the MUI theme object

  return (
    <Box
      component="footer" // set the component of the box to footer
      sx={{
        py: 5, // set the padding of the box to 5, which is the amount of space between the box and the text
        bgcolor: theme.palette.background.default // set the background colour of the box to the default background colour of the theme
      }}
    >
      <Container maxWidth="lg"> {/* set the max width of the container to lg, which sets the width of the container to the width of the screen */}
          <Box sx={{ textAlign: 'center' }}> {/* set the text alignment of the box to centre, which centres the text */}
            <Typography
              variant="h6" // set the variant of the text to h6, which is the size of the text
              sx={{
                color: theme.palette.text.secondary // set the text colour of the text to the secondary text colour of the theme
              }}
            >
              © {new Date().getFullYear()} The Bare Basics of AI: A Modular Learning Toolkit. All rights reserved. {/* set the text of the text to the current year, and the Bare Basics of AI. All rights reserved. */}
            </Typography>
          </Box>
      </Container>
    </Box>
  );
}

export default Footer; // export the Footer component as the default export, making it available to be used in other files
