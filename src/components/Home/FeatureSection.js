import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Collapse,
  IconButton,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { 
  TouchApp as TouchAppIcon,
  Navigation as NavigationIcon,
  Balance as BalanceIcon,
  LightbulbOutlined as LightbulbIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const FeatureSection = ({ isDarkMode, sectionBackground }) => {
  const [expandedFeatures, setExpandedFeatures] = useState({
    0: false,
    1: false,
    2: false,
    3: false
  });

  const handleFeatureToggle = (index) => (event, isExpanded) => {
    setExpandedFeatures(prev => ({
      ...prev,
      [index]: isExpanded
    }));
  };

  // Define theme colors based on dark mode
  const themeColors = {
    primary: {
      main: isDarkMode ? '#66ccff' : '#1976d2',
      light: isDarkMode ? 'rgba(102, 204, 255, 0.2)' : 'rgba(25, 118, 210, 0.1)'
    },
    secondary: {
      main: isDarkMode ? '#ce93d8' : '#9c27b0',
      light: isDarkMode ? 'rgba(206, 147, 216, 0.2)' : 'rgba(156, 39, 176, 0.1)'
    },
    success: {
      main: isDarkMode ? '#81c784' : '#4caf50',
      light: isDarkMode ? 'rgba(129, 199, 132, 0.2)' : 'rgba(76, 175, 80, 0.1)'
    },
    warning: {
      main: isDarkMode ? '#ffb74d' : '#ff9800',
      light: isDarkMode ? 'rgba(255, 183, 77, 0.2)' : 'rgba(255, 152, 0, 0.1)'
    }
  };

  const features = [
    {
      title: 'Interactive Learning',
      icon: <TouchAppIcon sx={{ fontSize: 32 }} />,
      colorClass: 'primary',
      points: [
        'Clear explanations with practical examples',
        'Step-by-step guides and tutorials',
        'Learn at your own pace with structured content'
      ]
    },
    {
      title: 'Intuitive Navigation',
      icon: <NavigationIcon sx={{ fontSize: 32 }} />,
      colorClass: 'secondary',
      points: [
        'Clear, modular learning structure',
        'Easy-to-follow progression from basics to advanced',
        'Flexible learning at your own pace'
      ]
    },
    {
      title: 'Ethical Foundation',
      icon: <BalanceIcon sx={{ fontSize: 32 }} />,
      colorClass: 'success',
      points: [
        'Understanding AI\'s impact on society',
        'Responsible AI development practices',
        'Shaping the future of AI responsibly'
      ]
    },
    {
      title: 'Fundamental Understanding',
      icon: <LightbulbIcon sx={{ fontSize: 32 }} />,
      colorClass: 'warning',
      points: [
        'Core AI concepts explained simply',
        'Building a strong foundation for future learning',
        'Practical applications of AI fundamentals'
      ]
    }
  ];

  const renderFeatureCard = (feature, index) => {
    const isExpanded = expandedFeatures[index];
    
    return (
      <Paper 
        elevation={isDarkMode ? 3 : 1}
        sx={{ 
          animation: `fadeInUp 0.8s ease-out ${index * 0.2}s`,
          padding: 0,
          backgroundColor: isDarkMode ? 'rgb(16, 35, 60)' : '#fff',
          borderRadius: '16px',
          transition: 'all 0.3s ease',
          width: '100%',
          height: 'auto',
          minHeight: '200px',
          position: 'relative',
          overflow: 'visible',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Expand button in top right */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            handleFeatureToggle(index)(e, !isExpanded);
          }}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: themeColors[feature.colorClass].main,
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
            zIndex: 2
          }}
          aria-expanded={isExpanded}
          aria-label="toggle details"
        >
          <ExpandMoreIcon />
        </IconButton>
        
        {/* Card Content with centered elements */}
        <Box 
          sx={{ 
            padding: '24px', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            textAlign: 'center',
            position: 'relative'
          }}
        >
          {/* Icon Circle */}
          <Box 
            sx={{ 
              background: themeColors[feature.colorClass].light,
              borderRadius: '50%', 
              width: '80px',
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
              mt: 1,
              mx: 'auto'
            }}
          >
            <Box sx={{ 
              color: themeColors[feature.colorClass].main, 
              fontSize: 36,
              display: 'flex'
            }}>
              {feature.icon}
            </Box>
          </Box>
          
          {/* Title */}
          <Typography 
            variant="h5" 
            sx={{
              color: themeColors[feature.colorClass].main,
              fontWeight: 700,
              textAlign: 'center',
              fontSize: '1.4rem',
              width: '100%',
              mb: 1
            }}
          >
            {feature.title}
          </Typography>
        </Box>

        {/* Accordion for bullet points */}
        <Accordion 
          expanded={isExpanded}
          onChange={handleFeatureToggle(index)}
          disableGutters
          sx={{
            background: 'transparent',
            boxShadow: 'none',
            '&:before': { display: 'none' },
            mt: 0
          }}
        >
          <AccordionSummary
            aria-controls={`panel-${index}-content`}
            id={`panel-${index}-header`}
            sx={{ 
              display: 'none' // Hide the default summary since we're using a custom button
            }}
          />
          <AccordionDetails sx={{ padding: '0px 24px 24px' }}>
            <Box sx={{ mt: 1 }}>
              {feature.points.map((point, pointIndex) => (
                <Box key={pointIndex} sx={{ display: 'flex', mb: 2, alignItems: 'flex-start' }}>
                  <CheckCircleIcon 
                    sx={{ 
                      mr: 2, 
                      mt: 0.5,
                      color: themeColors[feature.colorClass].main,
                      flexShrink: 0
                    }} 
                  />
                  <Typography variant="body1" sx={{ color: isDarkMode ? '#e0e0e0' : 'inherit', textAlign: 'left' }}>
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
      py: 10, 
      background: sectionBackground,
      position: 'relative',
      boxShadow: isDarkMode ? 'inset 0 10px 20px -10px rgba(0, 0, 0, 0.6)' : 'none',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      margin: 0,
      padding: 0
    }}>
      {/* Content Container */}
      <Box sx={{ 
        width: '92%', 
        maxWidth: '1100px', 
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Title Section */}
        <Box sx={{ 
          width: '100%', 
          textAlign: 'center', 
          mb: 6
        }}>
          <Typography 
            variant="h3" 
            sx={{ 
              animation: 'fadeInUp 0.8s ease-out',
              textAlign: 'center',
              width: '100%',
              marginBottom: 3,
              color: isDarkMode ? '#fff' : 'inherit'
            }}
          >
            Learn AI the Right Way
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              animation: 'fadeInUp 0.8s ease-out 0.2s',
              textAlign: 'center',
              margin: '0 auto',
              maxWidth: '800px',
              color: isDarkMode ? '#e0e0e0' : 'text.secondary'
            }}
          >
            Why beginners choose our platform for their AI learning journey
          </Typography>
        </Box>

        {/* Feature Grid */}
        <Box 
          sx={{
            width: '100%',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            padding: '20px',
            boxSizing: 'border-box'
          }}
        >
          <Grid 
            container 
            spacing={3}
            sx={{ 
              width: '100%',
              margin: 0
            }}
          >
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: { xs: 3, md: 4 } }}>
                {renderFeatureCard(features[0], 0)}
              </Box>
              <Box>
                {renderFeatureCard(features[2], 2)}
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: { xs: 3, md: 4 } }}>
                {renderFeatureCard(features[1], 1)}
              </Box>
              <Box>
                {renderFeatureCard(features[3], 3)}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default FeatureSection; 