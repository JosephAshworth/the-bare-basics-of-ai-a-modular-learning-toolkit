// the drop-downs for website features

import React, { useState } from 'react';

// material ui components
import { 
  Box,
  Typography,
  Grid,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container
} from '@mui/material';

import { useTheme } from '@mui/material/styles';

import { 
  TouchApp as TouchAppIcon,
  Navigation as NavigationIcon,
  Balance as BalanceIcon,
  LightbulbOutlined as LightbulbIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const FeatureSection = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  // track whether each feature is expanded or not
  const [expandedFeatures, setExpandedFeatures] = useState({
    0: false,
    1: false,
    2: false,
    3: false
  });

  // toggle the expansion state of a feature
  // updating the state to reflect whether a specific feature is expanded or collapsed
  const handleFeatureToggle = (index) => (event, isExpanded) => {
    setExpandedFeatures(prev => ({
      ...prev,
      [index]: isExpanded
    }));
  };

  // create a palette of colours for each feature, using the theme's palette
  const featurePalettes = React.useMemo(() => ({
    first: theme.palette.primary,
    second: theme.palette.secondary,
    third: theme.palette.success,
    fourth: theme.palette.warning,
  }), [theme.palette.primary, theme.palette.secondary, theme.palette.success, theme.palette.warning]);

  // define the features in each drop down, including the title, icon, colour key, and informational points
  const features = [
    {
      title: 'Interactive Learning',
      icon: <TouchAppIcon sx={{ fontSize: 32 }} />,
      colourKey: 'first',
      points: [
        'Clear explanations with practical examples',
        'Step-by-step guides and tutorials',
        'Learn at your own pace with structured content'
      ]
    },
    {
      title: 'Intuitive Navigation',
      icon: <NavigationIcon sx={{ fontSize: 32 }} />,
      colourKey: 'second',
      points: [
        'Clear, modular learning structure',
        'Easy-to-follow progression from basics to advanced',
        'Flexible learning at your own pace'
      ]
    },
    {
      title: 'Ethical Foundation',
      icon: <BalanceIcon sx={{ fontSize: 32 }} />,
      colourKey: 'third',
      points: [
        'Understanding AI\'s impact on society',
        'Responsible AI development practices',
        'Shaping the future of AI responsibly'
      ]
    },
    {
      title: 'Fundamental Understanding',
      icon: <LightbulbIcon sx={{ fontSize: 32 }} />,
      colourKey: 'fourth',
      points: [
        'Core AI concepts explained simply',
        'Building a strong foundation for future learning',
        'Practical applications of AI fundamentals'
      ]
    }
  ];

  const renderFeatureCard = (feature, index, colourPalette) => {
    const isExpanded = expandedFeatures[index];
    
    return (
      <Paper
        elevation={isDarkMode ? 3 : 1}
        sx={{ 
          backgroundColor: theme.palette.background.paper,
          borderRadius: '16px',
          position: 'relative',
          transition: 'height 0.3s ease', // smooth transition when the card is expanded or collapsed
          height: isExpanded ? '380px' : '200px', // height of the card when expanded or collapsed
          boxShadow: theme.shadows[isDarkMode ? 3 : 1],
          cursor: 'pointer',
          overflow: 'hidden'
        }}
        onClick={(e) => {
          handleFeatureToggle(index)(e, !isExpanded); // toggle the expansion state of the card when clicked
        }}
      >
        <ExpandMoreIcon 
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: colourPalette.main,
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', // rotate the icon when the card is expanded or collapsed
            transition: 'transform 0.3s ease',
            zIndex: 2
          }}
        />
        
        <Box 
          sx={{ 
            padding: '24px'
          }}
        >
          <Box 
            sx={{ 
              bgcolor: theme.palette.mode === 'dark' ? colourPalette.main + '30' : colourPalette.light + '30',
              borderRadius: '50%',
              width: '80px',
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
              mt: 1,
              mx: 'auto' // centre the icon horizontally
            }}
          >
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colourPalette.main,
              fontSize: 36
            }}>
              {feature.icon}
            </Box>
          </Box>
          
          <Typography 
            sx={{
              color: colourPalette.main,
              fontWeight: 700,
              textAlign: 'center',
              fontSize: '1.4rem',
              mb: 1
            }}
          >
            {feature.title}
          </Typography>
        </Box>

        <Accordion 
          expanded={isExpanded}
          disableGutters
          sx={{
            background: 'transparent',
            boxShadow: 'none',
            '&:before': { display: 'none' } // hide the pseudo-element before the main element, often used to remove default styling
          }}
        >
          {/* the expandable part of the card */}
          <AccordionSummary
            aria-controls={`panel-${index}-content`}
            id={`panel-${index}-header`}
            sx={{ 
              display: 'none'
            }}
          />

          {/* the content of the card's expandable section */}
          <AccordionDetails>
            <Box>
              {/* display each point as a checkmark icon followed by a text description */}
              {feature.points.map((point, pIndex) => (
                <Box key={pIndex} sx={{ display: 'flex', mb: 2 }}>
                  <CheckCircleIcon 
                    sx={{ 
                      mr: 2, // add a right margin for spacing
                      color: colourPalette.main
                    }} 
                  />
                  <Typography sx={{ color: theme.palette.text.primary }}>
                    {point}
                  </Typography>
                </Box>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      </Paper>
    );
  };

  return (
    <Box sx={{ 
      display: 'flex',
      justifyContent: 'center',
      py: 8
    }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h3"
            sx={{ 
              textAlign: 'center',
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            Learn AI the Right Way
          </Typography>
          <Typography 
            variant="h6"
            sx={{ 
              textAlign: 'center',
              margin: '0 auto',
              maxWidth: '800px',
              color: theme.palette.text.secondary
            }}
          >
            Why beginners choose our platform for their AI learning journey
          </Typography>
        </Box>

        {/* responsive layour for rendering the feature cards */}
        <Box sx={{ padding: { xs: 1, sm: 2 } }}>
          <Grid container spacing={4}>
            {features.slice(0, 2).map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
              <Box sx={{ mb: { xs: 3, md: 4 } }}>
                  {renderFeatureCard(feature, index, featurePalettes[feature.colourKey])}
              </Box>
            </Grid>
            ))}
            
            {features.slice(2, 4).map((feature, index) => (
              <Grid item xs={12} md={6} key={index + 2}>
              <Box>
                  {renderFeatureCard(feature, index + 2, featurePalettes[feature.colourKey])}
              </Box>
            </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default FeatureSection;