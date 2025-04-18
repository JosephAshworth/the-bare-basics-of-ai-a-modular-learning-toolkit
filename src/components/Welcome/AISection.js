import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Stack,
  Paper, 
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Collapse,
  Grid
} from '@mui/material';
import {
  School as SchoolIcon,
  Chat as ChatIcon,
  Visibility as VisibilityIcon,
  SettingsRemote as RobotIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const AISection = ({ isDarkMode, sectionBackground }) => {
  // Track expanded state for each panel independently
  const [expandedPanels, setExpandedPanels] = useState({
    'panel-0': false,
    'panel-1': false,
    'panel-2': false,
    'panel-3': false
  });

  const handlePanelToggle = (panelId) => (event, isExpanded) => {
    setExpandedPanels(prev => ({
      ...prev,
      [panelId]: isExpanded
    }));
  };

  // Define distinct vibrant colors for each AI capability
  const colorMap = {
    learning: {
      light: isDarkMode ? 'rgba(33, 150, 243, 0.2)' : 'rgba(33, 150, 243, 0.1)',
      main: isDarkMode ? '#2196f3' : '#1976d2' // Blue
    },
    nlp: {
      light: isDarkMode ? 'rgba(171, 71, 188, 0.2)' : 'rgba(171, 71, 188, 0.1)',
      main: isDarkMode ? '#ab47bc' : '#8e24aa' // Purple
    },
    vision: {
      light: isDarkMode ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.1)',
      main: isDarkMode ? '#4caf50' : '#388e3c' // Green
    },
    robotics: {
      light: isDarkMode ? 'rgba(255, 152, 0, 0.2)' : 'rgba(255, 152, 0, 0.1)',
      main: isDarkMode ? '#ff9800' : '#f57c00' // Orange/Amber
    }
  };

  const features = [
    {
      icon: <SchoolIcon />,
      title: 'Learning & Problem Solving',
      summary: 'Systems that can learn from examples and solve complex problems.',
      points: [
        'Clear examples with practical applications',
        'Step-by-step learning from data patterns',
        'Improving accuracy with more experience'
      ],
      colorKey: 'learning'
    },
    {
      icon: <ChatIcon />,
      title: 'Natural Language Processing',
      summary: 'Understanding and generating human language.',
      points: [
        'Converting speech to text and back',
        'Translating between different languages',
        'Understanding context and meaning'
      ],
      colorKey: 'nlp'
    },
    {
      icon: <VisibilityIcon />,
      title: 'Computer Vision',
      summary: 'Processing and analyzing visual information.',
      points: [
        'Identifying objects in images and videos',
        'Facial recognition and emotion detection',
        'Medical imaging and security applications'
      ],
      colorKey: 'vision'
    },
    {
      icon: <RobotIcon />,
      title: 'Robotics & Automation',
      summary: 'Control and automation of physical systems.',
      points: [
        'Autonomous navigation in physical spaces',
        'Precision manufacturing and assembly',
        'Human-robot collaboration systems'
      ],
      colorKey: 'robotics'
    }
  ];

  // Feature card rendering function
  const renderFeatureCard = (feature, index) => {
    const { icon, title, summary, points, colorKey } = feature;
    const panelId = `panel-${index}`;
    const isExpanded = expandedPanels[panelId];
    
    // Shared card styles to ensure consistency
    const cardStyles = {
      backgroundColor: isDarkMode ? 'rgba(70, 45, 25, 0.7)' : '#fff',
      border: isDarkMode 
        ? `1px solid ${colorMap[colorKey].light}` 
        : '1px solid rgba(0,0,0,0.05)',
      borderRadius: '16px',
      boxShadow: isDarkMode ? `0 8px 32px rgba(0, 0, 0, 0.3)` : '0 4px 20px rgba(0,0,0,0.08)',
      width: '100%',
      margin: 0,
      padding: 0,
      position: 'relative',
    };
    
    return (
      <Paper className="feature-card" elevation={2} sx={cardStyles}>
        {/* Expand button positioned in top right */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            handlePanelToggle(panelId)(e, !isExpanded);
          }}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: colorMap[colorKey].main,
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
            zIndex: 2
          }}
          aria-expanded={isExpanded}
          aria-label="toggle details"
        >
          <ExpandMoreIcon />
        </IconButton>
        
        {/* Content Container - fixed size no matter what */}
        <Box sx={{ pt: 4, pb: 2, px: 3 }}>
          {/* Main Content - this stays fixed */}
          <Box sx={{ 
            minHeight: '250px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}>
            {/* Icon Circle */}
            <Box 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: colorMap[colorKey].light,
                mb: 3,
                mt: 1,
                mx: 'auto'
              }}
            >
              <Box sx={{ 
                color: colorMap[colorKey].main, 
                fontSize: 36,
                display: 'flex'
              }}>
                {icon}
              </Box>
            </Box>
            
            {/* Title */}
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600, 
                fontSize: '1.5rem',
                mb: 2,
                color: colorMap[colorKey].main,
                textAlign: 'center',
                lineHeight: 1.3
              }}
            >
              {title}
            </Typography>
            
            {/* Summary Text */}
            <Typography 
              variant="body1" 
              sx={{ 
                textAlign: 'center',
                fontSize: '1.1rem',
                lineHeight: 1.4,
                color: isDarkMode ? '#e0e0e0' : 'inherit',
              }}
            >
              {summary}
            </Typography>
          </Box>
          
          {/* Expandable Content - this shows/hides but doesn't affect the main content */}
          <Collapse in={isExpanded} timeout="auto">
            <Box sx={{ mt: 3, pb: 2 }}>
              <List disablePadding>
                {points.map((point, i) => (
                  <ListItem 
                    key={i} 
                    alignItems="flex-start" 
                    sx={{ 
                      px: 0, 
                      py: 0.8,
                      display: 'flex',
                      flexDirection: 'row',
                      textAlign: 'left'
                    }}
                  >
                    <CheckCircleIcon 
                      sx={{ 
                        mr: 2,
                        mt: 0.5,
                        color: colorMap[colorKey].main,
                        flexShrink: 0
                      }}
                    />
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: isDarkMode ? '#e0e0e0' : 'inherit',
                        textAlign: 'left'
                      }}
                    >
                      {point}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Collapse>
        </Box>
      </Paper>
    );
  };

  return (
    <Box sx={{ 
      width: '100%',
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      background: sectionBackground,
      py: 8,
      mb: 0,
      boxShadow: isDarkMode ? 'inset 0 -10px 20px -10px rgba(0, 0, 0, 0.6), inset 0 10px 20px -10px rgba(0, 0, 0, 0.6)' : 'none'
    }}>
      <Container maxWidth="lg" sx={{ textAlign: 'center', backgroundColor: 'transparent' }}>
        <Box className="text-center" sx={{ mb: 6 }}>
          <Typography 
            variant="h3"
            sx={{ 
              animation: 'fadeInUp 0.8s ease-out',
              textAlign: 'center',
              width: '100%',
              marginBottom: 3,
              color: isDarkMode ? '#fff' : 'inherit',
              fontWeight: 700
            }}
          >
            What is Artificial Intelligence?
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              animation: 'fadeInUp 0.8s ease-out 0.2s',
              textAlign: 'center',
              margin: '0 auto',
              maxWidth: '800px',
              color: isDarkMode ? '#e0e0e0' : 'text.secondary',
              mb: 4
            }}
          >
            Artificial Intelligence (AI) refers to computer systems that can perform tasks that typically require human intelligence. These tasks include:
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 4 }}>
              {renderFeatureCard(features[0], 0)}
            </Box>
            <Box>
              {renderFeatureCard(features[2], 2)}
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 4 }}>
              {renderFeatureCard(features[1], 1)}
            </Box>
            <Box>
              {renderFeatureCard(features[3], 3)}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AISection;