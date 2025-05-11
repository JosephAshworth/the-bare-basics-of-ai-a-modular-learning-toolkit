import {
  Paper, // import Paper from MUI
  Typography // import Typography from MUI
} from '@mui/material';

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on dark or light mode

const EthicsConsiderations = () => {
  const theme = useTheme(); // for getting the MUI theme object

  return (
    <Paper 
        elevation={theme.palette.mode === 'dark' ? 2 : 1} // for setting the elevation of the paper to 2 for dark mode and 1 for light mode, this is used to give the paper a shadow
        sx={{
            p: 3, // for setting the padding of the paper to 3
            mt: 0, // set the margin top of the paper to 0, to remove the default margin of the paper
            borderRadius: '12px', // for setting the border radius of the paper to 12px
            backgroundColor: theme.palette.background.paper, // set the background colour of the paper to the background colour of the theme
            border: `1px solid ${theme.palette.divider}` // for setting the border of the paper to the divider colour of the theme
        }}
    >
        <Typography
            variant="h6"
            sx={{
                mb: 2, // set the margin bottom of the typography to 2
                fontWeight: 600, // set the font weight of the typography to 600
                color: theme.palette.text.primary // set the colour of the typography to the primary colour of the theme
            }}
        >
            Ethical Considerations in Fuzzy Logic
        </Typography>
        <Typography
            variant="body2"
            sx={{
                mb: 1 // set the margin bottom of the typography to 1
            }}
        >
            <strong>• Bias:</strong> An article by Goran Ferenc and others points out that fuzzy logic in self-driving cars can reflect the personal assumptions of the people who design it. This means the car’s decisions might unintentionally favour certain driving styles or cultural norms over others.
        </Typography>
        <Typography
            variant="body2"
            sx={{
                mb: 1 // set the margin bottom of the typography to 1
            }}
        >
            <strong>• Responsibility:</strong> This study highlights the responsibility of those who define the fuzzy rules to ensure they incorporate fairness into the systems. For example, if a car misinterprets the closeness of a pedestrian, or how fast it is safe to turn, it becomes difficult to understand how the fuzzy system is implemented, leading to responsibility debates.
        </Typography>
        <Typography
            variant="body2"
            sx={{
                mb: 1 // set the margin bottom of the typography to 1
            }}
        >
            <strong>• Transparency:</strong> Fuzzy logic is more transparent than basic AI models, but it is still difficult for non-experts to understand how decisions are made. Phrases such as "mostly safe" or "a little bit close" make sense to humans, but might not be helpful to others affected by a system's choices.
        </Typography>
    </Paper>
  );
};

export default EthicsConsiderations; // export the EthicsConsiderations component, this is used to use the component in other files
