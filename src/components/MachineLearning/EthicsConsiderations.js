// the ethical considerations at the bottom of the page

// material ui components
import {
    Paper,
    Typography
} from '@mui/material';

import { useTheme } from '@mui/material/styles';

const EthicsConsiderations = () => {
    const theme = useTheme();

    return (
        <Paper
            elevation={theme.palette.mode === 'dark' ? 2 : 1}
            sx={{
                p: 3,
                mt: 0,
                borderRadius: '12px',
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    mb: 2,
                    fontWeight: 600,
                    color: theme.palette.text.primary
                }}
            >
                Ethical Considerations in Machine Learning
            </Typography>
            <Typography
                variant="body2"
                sx={{ mb: 1 }}
            >
                <strong>• Bias:</strong> Cynthia Rudin explained that tabular data can be unfair when it includes variables that are hints for race or income, for example. In her analysis of the COMPAS risk assessment tool, she addressed a question about how hard it is for someone to find a job above minimum wage, which reflects a person's socioeconomic status without saying so directly.
            </Typography>
            <Typography
                variant="body2"
                sx={{ mb: 1 }}
            >
                <strong>• Responsibility:</strong> Rudin's study highlights the responsibility of data scientists and practitioners to choose models that are accurate, as well as understandable. In critical applications such as criminal justice or medicine, making decisions using simple, understandable models allows decisions to be justified and defended.
            </Typography>
            <Typography
                variant="body2"
                sx={{ mb: 1 }}
            >
                <strong>• Transparency:</strong> Transparency in machine learning models is essential to comprehend and trust the decisions. The paper makes a case for simple, understandable models so that people can view how the predictions are being made, allowing them to identify hidden biases in the data, leading to more trusting users using such systems.
            </Typography>
        </Paper>
    );
};

export default EthicsConsiderations;