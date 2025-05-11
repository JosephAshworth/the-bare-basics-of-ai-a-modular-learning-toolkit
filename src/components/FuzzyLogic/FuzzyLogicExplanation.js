import {
  Typography, // import Typography from MUI
  Paper, // import Paper from MUI
  Accordion, // import Accordion from MUI
  AccordionSummary, // import AccordionSummary from MUI
  AccordionDetails, // import AccordionDetails from MUI
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // import ExpandMoreIcon from MUI

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on dark or light mode

const FuzzyLogicExplanation = () => {
  const theme = useTheme(); // for getting the MUI theme object
  const isDarkMode = theme.palette.mode === 'dark'; // check if the theme is dark mode

  return (
    <Paper
      elevation={2} // set the elevation of the paper to 2, this is used to give the paper a shadow
      sx={{
        p: { xs: 2, sm: 3 }, // set the padding of the paper to 2 for small screens and 3 for larger screens
        borderRadius: '16px', // set the border radius of the paper to 16px
        width: '100%', // set the width of the paper to 100%
        margin: '0 auto 40px auto', // set the margin of the paper to 0 auto 40px auto, this is used to centre the paper
        backgroundColor: theme.palette.background.paper, // set the background colour of the paper to the background colour of the theme
        overflow: 'hidden', // set the overflow of the paper to hidden, this is used to prevent the paper from overflowing (going out of the container)
      }}
    >
      <Accordion 
        sx={{ 
          backgroundColor: isDarkMode ? theme.palette.primary.dark + '30' : theme.palette.primary.light + '40', // set the background colour of the accordion to the primary colour of the theme, with a 30% opacity for dark mode and a 40% opacity for light mode
          border: `1px solid ${theme.palette.primary.main}`, // set the border of the accordion to the primary colour of the theme
          borderRadius: '16px', // set the border radius of the accordion to 16px
          boxShadow: 'none', // set the box shadow of the accordion to none, this is used to remove the shadow of the accordion
          '&.MuiAccordion-root:before': {
            display: 'none', // set the before pseudo-element of the accordion to none, this is used to remove the border of the accordion
          },
          mb: 2 // set the margin bottom of the accordion to 2, this is used to add space between the accordions
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />} // set the expand icon of the accordion to the ExpandMoreIcon from MUI
          aria-controls="what-is-fl-content" // set the aria-controls of the accordion to what-is-fl-content
          id="what-is-fl-header" // set the id of the accordion to what-is-fl-header
        >
          <Typography
            variant="h5" // set the variant of the typography to h5
            sx={{
              fontWeight: 600, // set the font weight of the typography to 600
              color: theme.palette.text.primary // set the colour of the typography to the primary colour of the theme
            }}
          >
            What is Fuzzy Logic?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography
            variant="body2" // set the variant of the typography to body2
            sx={{
              mb: 3, // set the margin bottom of the typography to 3
              color: theme.palette.text.primary // set the colour of the typography to the primary colour of the theme
            }}
          >
            • Unlike traditional logic where something is either absolutely true (1) or absolutely false (0), fuzzy logic handles intermediate truth (from 0 to 1).
          </Typography>
          <Typography
            variant="body2" // set the variant of the typography to body2
            sx={{
              mb: 3, // set the margin bottom of the typography to 3
              color: theme.palette.text.primary // set the colour of the typography to the primary colour of the theme
            }}
          >
            • It is a way of handling "partial truth", where the truth value lies between absolutely true and absolutely false.
          </Typography>
          <Typography
            variant="body2" // set the variant of the typography to body2
            sx={{
              mb: 3, // set the margin bottom of the typography to 3
              color: theme.palette.text.primary // set the colour of the typography to the primary colour of the theme
            }}
          >
            • For example, if someone is queried "Is it hot?", instead of a plain "yes" or "no", fuzzy logic would accommodate a range of in-between answers, such as "it's warm" or "it's cool".
          </Typography>
          <Typography
            variant="body2" // set the variant of the typography to body2
            sx={{
              mb: 3, // set the margin bottom of the typography to 3
              color: theme.palette.text.primary // set the colour of the typography to the primary colour of the theme
            }}
          >
            • The fuzzy system would render this as 0.3 warm and 0.7 cool, thus there is a confused idea about the temperature.
          </Typography>
        </AccordionDetails>
      </Accordion>


      <Accordion 
        sx={{ 
          backgroundColor: isDarkMode ? theme.palette.success.dark + '30' : theme.palette.success.light + '40', // set the background colour of the accordion to the success colour of the theme, with a 30% opacity for dark mode and a 40% opacity for light mode
          border: `1px solid ${theme.palette.success.main}`, // set the border of the accordion to the success colour of the theme
          borderRadius: '16px', // set the border radius of the accordion to 16px
          boxShadow: 'none', // set the box shadow of the accordion to none, this is used to remove the shadow of the accordion
          '&.MuiAccordion-root:before': {
            display: 'none', // set the before pseudo-element of the accordion to none, this is used to remove the border of the accordion
          },
          mb: 2 // set the margin bottom of the accordion to 2, this is used to add space between the accordions
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />} // set the expand icon of the accordion to the ExpandMoreIcon from MUI
          aria-controls="real-world-fl-example-content" // set the aria-controls of the accordion to real-world-fl-example-content
          id="real-world-fl-example-header" // set the id of the accordion to real-world-fl-example-header
        >
          <Typography 
            variant="h5" // set the variant of the typography to h5
            sx={{ 
              fontWeight: 600, // set the font weight of the typography to 600
              color: theme.palette.text.primary // set the colour of the typography to the primary colour of the theme
            }}
          >
            Real World Example: Temperature
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography
            variant="body2" // set the variant of the typography to body2
            sx={{ 
              mb: 3, // set the margin bottom of the typography to 3
              color: theme.palette.text.primary // set the colour of the typography to the primary colour of the theme
            }}
          >
            • Fuzzy logic can characterise temperature using labels such as "cold", "moderate", and "hot", with overlapping ranges.
          </Typography>
          <Typography
            variant="body2" // set the variant of the typography to body2
            sx={{ 
              mb: 3, // set the margin bottom of the typography to 3
              color: theme.palette.text.primary // set the colour of the typography to the primary colour of the theme
            }}
          >
            • At 5°C, it may be 100% cold and 0% moderate.
          </Typography>
          <Typography variant="body2" // set the variant of the typography to body2
            sx={{ 
              mb: 3, // set the margin bottom of the typography to 3
              color: theme.palette.text.primary // set the colour of the typography to the primary colour of the theme
            }}
          >
            • At 12°C, it may be 60% cold and 40% moderate, which means it's getting warmer, and showing a shift in the logical output.
          </Typography>
          <Typography variant="body2" // set the variant of the typography to body2
            sx={{ 
              mb: 3, // set the margin bottom of the typography to 3
              color: theme.palette.text.primary // set the colour of the typography to the primary colour of the theme
            }}
          >
            • 25°C is 100% moderate, as this is room temperature on average. 
          </Typography>
          <Typography variant="body2" // set the variant of the typography to body2
            sx={{ 
              mb: 3, // set the margin bottom of the typography to 3
              color: theme.palette.text.primary // set the colour of the typography to the primary colour of the theme
            }}
          >
            • 45°C is 100% hot, as this is the normal temperature of an oven. 
          </Typography>
          <Typography variant="body2" // set the variant of the typography to body2
            sx={{ 
              mb: 3, // set the margin bottom of the typography to 3
              color: theme.palette.text.primary // set the colour of the typography to the primary colour of the theme
            }}
          >
            • Fuzzy logic gives smooth transitions between these ranges, instead of sudden binary changes. 
          </Typography>
        </AccordionDetails>
      </Accordion>


      <Accordion 
        sx={{ 
          backgroundColor: isDarkMode ? theme.palette.secondary.dark + '30' : theme.palette.secondary.light + '40', // set the background colour of the accordion to the secondary colour of the theme, with a 30% opacity for dark mode and a 40% opacity for light mode
          border: `1px solid ${theme.palette.secondary.main}`, // set the border of the accordion to the secondary colour of the theme
          borderRadius: '16px', // set the border radius of the accordion to 16px
          boxShadow: 'none', // set the box shadow of the accordion to none, this is used to remove the shadow of the accordion
          '&.MuiAccordion-root:before': {
            display: 'none', // set the before pseudo-element of the accordion to none, this is used to remove the border of the accordion
          },
          mb: 2
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />} // set the expand icon of the accordion to the ExpandMoreIcon from MUI
          aria-controls="why-does-fl-matter-content" // set the aria-controls of the accordion to why-does-fl-matter-content
          id="why-does-fl-matter-header" // set the id of the accordion to why-does-fl-matter-header
        >
          <Typography
            variant="h5" // set the variant of the typography to h5
            sx={{ 
              fontWeight: 600, // set the font weight of the typography to 600
              color: theme.palette.text.primary // set the colour of the typography to the primary colour of the theme
            }}
          >
            Why does Fuzzy Logic Matter?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" // set the variant of the typography to body2
            sx={{ 
              mb: 3, // set the margin bottom of the typography to 3
              color: theme.palette.text.primary // set the colour of the typography to the primary colour of the theme
            }}
          >
            • Fuzzy logic reflects how people actually speak and think, saying "kind of cold" or "pretty warm".
          </Typography>
          <Typography variant="body2" // set the variant of the typography to body2
            sx={{ 
              mb: 3, // set the margin bottom of the typography to 3
              color: theme.palette.text.primary // set the colour of the typography to the primary colour of the theme
            }}
          >
            •  It allows systems to work with vague inputs, handling uncertainty effectively.
          </Typography>
          <Typography variant="body2" // set the variant of the typography to body2
            sx={{ 
              mb: 3, // set the margin bottom of the typography to 3
              color: theme.palette.text.primary // set the colour of the typography to the primary colour of the theme
            }}
          >
            • It models human reasoning using flexible "if-then" rules, rather than rigid calculations.
          </Typography>
          <Typography variant="body2" // set the variant of the typography to body2
            sx={{ 
              mb: 3, // set the margin bottom of the typography to 3
              color: theme.palette.text.primary // set the colour of the typography to the primary colour of the theme
            }}
          >
            • Fuzzy logic simplifies the design of systems where precise mathematical modeling is too complex.
          </Typography>
        </AccordionDetails>
      </Accordion>
      

    </Paper>
  );
};

export default FuzzyLogicExplanation; // export the FuzzyLogicExplanation component, this is used to use the component in other files
