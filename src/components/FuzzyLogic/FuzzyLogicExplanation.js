// the drop-down menus for the explanation

// material ui components
import {
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useTheme } from '@mui/material/styles';

const FuzzyLogicExplanation = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: '16px',
        width: '100%',
        margin: '0 auto 40px auto', // centre the element horizontally and adds a 40px margin at the bottom
        backgroundColor: theme.palette.background.paper,
        overflow: 'hidden', // hide any content that exceeds the element's boundaries
      }}
    >
      <Accordion 
        sx={{ 
          backgroundColor: isDarkMode ? theme.palette.primary.dark + '30' : theme.palette.primary.light + '40', // add a 30% dark mode and 40% light mode background colour
          border: `1px solid ${theme.palette.primary.main}`,
          borderRadius: '16px',
          boxShadow: 'none',
          '&.MuiAccordion-root:before': {
            display: 'none', // hide the border
          },
          mb: 2 
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="what-is-fl-content"
          id="what-is-fl-header"
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary
            }}
          >
            What is Fuzzy Logic?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • Unlike traditional logic where something is either absolutely true (1) or absolutely false (0), fuzzy logic handles intermediate truth (from 0 to 1).
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • It is a way of handling "partial truth", where the truth value lies between absolutely true and absolutely false.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • For example, if someone is queried "Is it hot?", instead of a plain "yes" or "no", fuzzy logic would accommodate a range of in-between answers, such as "it's warm" or "it's cool".
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • The fuzzy system would render this as 0.3 warm and 0.7 cool, thus there is a confused idea about the temperature.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion 
        sx={{ 
          backgroundColor: isDarkMode ? theme.palette.success.dark + '30' : theme.palette.success.light + '40',
          border: `1px solid ${theme.palette.success.main}`,
          borderRadius: '16px',
          boxShadow: 'none',
          '&.MuiAccordion-root:before': {
            display: 'none',
          },
          mb: 2
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="real-world-fl-example-content"
          id="real-world-fl-example-header"
        >
          <Typography 
            variant="h5"
            sx={{ 
              fontWeight: 600,
              color: theme.palette.text.primary
            }}
          >
            Real World Example: Temperature
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography
            variant="body2"
            sx={{ 
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • Fuzzy logic can characterise temperature using labels such as "cold", "moderate", and "hot", with overlapping ranges.
          </Typography>
          <Typography
            variant="body2"
            sx={{ 
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • At 5°C, it may be 100% cold and 0% moderate.
          </Typography>
          <Typography variant="body2"
            sx={{ 
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • At 12°C, it may be 60% cold and 40% moderate, which means it's getting warmer, and showing a shift in the logical output.
          </Typography>
          <Typography variant="body2"
            sx={{ 
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • 25°C is 100% moderate, as this is room temperature on average. 
          </Typography>
          <Typography variant="body2"
            sx={{ 
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • 45°C is 100% hot, as this is the normal temperature of an oven. 
          </Typography>
          <Typography variant="body2"
            sx={{ 
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • Fuzzy logic gives smooth transitions between these ranges, instead of sudden binary changes. 
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion 
        sx={{ 
          backgroundColor: isDarkMode ? theme.palette.secondary.dark + '30' : theme.palette.secondary.light + '40',
          border: `1px solid ${theme.palette.secondary.main}`,
          borderRadius: '16px',
          boxShadow: 'none',
          '&.MuiAccordion-root:before': {
            display: 'none',
          },
          mb: 2
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="why-does-fl-matter-content"
          id="why-does-fl-matter-header"
        >
          <Typography
            variant="h5"
            sx={{ 
              fontWeight: 600,
              color: theme.palette.text.primary
            }}
          >
            Why does Fuzzy Logic Matter?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2"
            sx={{ 
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • Fuzzy logic reflects how people actually speak and think, saying "kind of cold" or "pretty warm".
          </Typography>
          <Typography variant="body2"
            sx={{ 
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            •  It allows systems to work with vague inputs, handling uncertainty effectively.
          </Typography>
          <Typography variant="body2"
            sx={{ 
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • It models human reasoning using flexible "if-then" rules, rather than rigid calculations.
          </Typography>
          <Typography variant="body2"
            sx={{ 
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • Fuzzy logic simplifies the design of systems where precise mathematical modeling is too complex.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default FuzzyLogicExplanation;