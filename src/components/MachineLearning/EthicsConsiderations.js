import {
  Paper, // import Paper from @mui/material
  Typography // import Typography from @mui/material
} from '@mui/material'; // import all the components from @mui/material

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on dark or light mode

const EthicsConsiderations = () => {
  const theme = useTheme(); // for getting the MUI theme object

  return (
    <Paper
        elevation={theme.palette.mode === 'dark' ? 2 : 1} // use the theme object to get the elevation of the paper, which is 2 for dark mode and 1 for light mode, adding a shadow to the paper
        sx={{
            p: 3, // padding of 3 units
            mt: 0, // margin top of 0 units
            borderRadius: '12px', // border radius of 12px
            backgroundColor: theme.palette.background.paper, // background colour of the paper, which is the paper colour from the theme
            border: `1px solid ${theme.palette.divider}` // border of the paper, which is the divider colour from the theme
        }}
    >
        <Typography
            variant="h6" // variant of the typography
            sx={{
                mb: 2, // margin bottom of 2 units
                fontWeight: 600, // font weight of 600
                color: theme.palette.text.primary // colour of the text, which is the primary colour from the theme
            }} // style of the typography
        >
            Ethical Considerations in Machine Learning
        </Typography>
        <Typography
            variant="body2" // variant of the typography, giving it a smaller font size
            sx={{ mb: 1 }} // style of the typography, giving it a margin bottom of 1 unit
        >
            <strong>• Bias:</strong> Cynthia Rudin explained that tabular data can be unfair when it includes variables that are hints for race or income, for example. In her analysis of the COMPAS risk assessment tool, she addressed a question about how hard it is for someone to find a job above minimum wage, which reflects a person's socioeconomic status without saying so directly.
        </Typography>
        <Typography
            variant="body2" // variant of the typography, giving it a smaller font size
            sx={{ mb: 1 }} // style of the typography, giving it a margin bottom of 1 unit
        >
            <strong>• Responsibility:</strong> Rudin's study highlights the responsibility of data scientists and practitioners to choose models that are accurate, as well as understandable. In critical applications such as criminal justice or medicine, making decisions using simple, understandable models allows decisions to be justified and defended.
        </Typography>
        <Typography
            variant="body2" // variant of the typography, giving it a smaller font size
            sx={{ mb: 1 }} // style of the typography, giving it a margin bottom of 1 unit
        >
            <strong>• Transparency:</strong> Transparency in machine learning models is essential to comprehend and trust the decisions. The paper makes a case for simple, understandable models so that people can view how the predictions are being made, allowing them to identify hidden biases in the data, leading to more trusting users using such systems.
        </Typography>
    </Paper>
  );
};

export default EthicsConsiderations; // export the EthicsConsiderations component as the default export, so it can be used in other components
