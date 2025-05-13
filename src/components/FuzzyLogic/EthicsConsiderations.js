// display the ethical considerations at the bottom of the page

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
                Ethical Considerations in Fuzzy Logic
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    mb: 1
                }}
            >
                <strong>• Bias:</strong> An article by Goran Ferenc and others points out that fuzzy logic in self-driving cars can reflect the personal assumptions of the people who design it. This means the car’s decisions might unintentionally favour certain driving styles or cultural norms over others.
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    mb: 1
                }}
            >
                <strong>• Responsibility:</strong> This study highlights the responsibility of those who define the fuzzy rules to ensure they incorporate fairness into the systems. For example, if a car misinterprets the closeness of a pedestrian, or how fast it is safe to turn, it becomes difficult to understand how the fuzzy system is implemented, leading to responsibility debates.
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    mb: 1
                }}
            >
                <strong>• Transparency:</strong> Fuzzy logic is more transparent than basic AI models, but it is still difficult for non-experts to understand how decisions are made. Phrases such as "mostly safe" or "a little bit close" make sense to humans, but might not be helpful to others affected by a system's choices.
            </Typography>
        </Paper>
    );
};

export default EthicsConsiderations;