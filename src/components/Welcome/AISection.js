// the drop-downs that teach about the applications of AI

import React, { useState } from 'react';

// material ui components
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
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

import { useTheme } from '@mui/material/styles';

const AISection = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  // track whether each feature is expanded or not
  const [expandedPanels, setExpandedPanels] = useState({
    'panel-0': false,
    'panel-1': false,
    'panel-2': false,
    'panel-3': false
  });

  // toggle the expansion state of a feature
  // updating the state to reflect whether a specific feature is expanded or collapsed
  const handlePanelToggle = (panelId) => (event, isExpanded) => {
    setExpandedPanels(prev => ({
      ...prev,
      [panelId]: isExpanded
    }));
  };

  // create a palette of colours for each feature, using the theme's palette
  const aiPalettes = React.useMemo(() => ({
    learning: theme.palette.primary,
    nlp: theme.palette.secondary,
    vision: theme.palette.success,
    robotics: theme.palette.warning,
  }), [theme.palette.primary, theme.palette.secondary, theme.palette.success, theme.palette.warning]);

  // define the features in each drop down
  // including the icon, title, summary explanation, informational points and colour key
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
      colourKey: 'learning'
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
      colourKey: 'nlp'
    },
    {
      icon: <VisibilityIcon />,
      title: 'Computer Vision',
      summary: 'Processing and analysing visual information.',
      points: [
        'Identifying objects in images and videos',
        'Facial recognition and emotion detection',
        'Medical imaging and security applications'
      ],
      colourKey: 'vision'
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
      colourKey: 'robotics'
    }
  ];

  const renderFeatureCard = (feature, index, colourPalette) => {
    const { icon, title, summary, points } = feature;
    const panelId = `panel-${index}`; // give each panel a unique id for the state, to know which one has triggered the expansion or collapse
    const isExpanded = expandedPanels[panelId];
    
    const cardStyles = {
      borderRadius: '16px',
      width: '100%',
      position: 'relative',
      cursor: 'pointer',
      overflow: 'hidden'
    };
    
    return (
      <Paper 
        elevation={2}
        sx={cardStyles}
        onClick={(e) => {
          handlePanelToggle(panelId)(e, !isExpanded);
        }}
      > 
        <ExpandMoreIcon 
          sx={{ 
            position: 'absolute', // place in accordance with the paper, allowing properties such as top and right to be used
            top: 16, // 16px from the top of the paper
            right: 16, // 16px from the right of the paper
            color: colourPalette.main,
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
            zIndex: 2
          }}
        />
        
        <Box sx={{ pb: 2, px: 3 }}>
          <Box sx={{ 
            minHeight: '250px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
            <Box 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                bgcolor: isDarkMode ? colourPalette.main + '30' : colourPalette.light + '30',
                mb: 3,
                mt: 1,
                mx: 'auto'
              }}
            >
              <Box sx={{ 
                color: colourPalette.main,
              }}>
                {icon}
              </Box>
            </Box>
            
            <Typography 
              sx={{ 
                fontWeight: 700,
                fontSize: '1.4rem',
                mb: 2,
                color: colourPalette.main,
              }}
            >
              {title}
            </Typography>
            
            <Typography 
              sx={{ 
                fontSize: '1.1rem',
                lineHeight: 1.4,
                color: theme.palette.text.secondary,
              }}
            >
              {summary}
            </Typography>
          </Box>
          
          {/* if the panel is expanded, display the points */}
          <Collapse in={isExpanded}>
            <Box sx={{ mt: 3, pb: 2 }}>
              <List disablePadding>
                {/* for each point, display the text for the point and the checkmark icon */}
                {points.map((point, i) => (
                  <ListItem 
                    key={i}
                    sx={{ 
                      py: 0.8,
                    }}
                  >
                    <CheckCircleIcon 
                      sx={{ 
                        mr: 2,
                        mt: 0.5,
                        color: colourPalette.main,
                      }}
                    />
                    <Typography 
                      sx={{ 
                        color: theme.palette.text.secondary,
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
      py: 8,
    }}>
      <Container sx={{ textAlign: 'center' }}>
        <Box className="text-center" sx={{ mb: 6 }}>
          <Typography 
            variant="h3"
            sx={{ 
              animation: 'fadeInUp 0.8s ease-out',
              textAlign: 'center',
              marginBottom: 3,
              color: theme.palette.text.primary,
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
              color: theme.palette.text.secondary,
            }}
          >
            Artificial Intelligence (AI) refers to computer systems that can perform tasks that typically require human intelligence. These tasks include:
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ width: '100%', mb: 4 }}>
              {renderFeatureCard(features[0], 0, aiPalettes[features[0].colourKey])}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ width: '100%', mb: 4 }}>
              {renderFeatureCard(features[1], 1, aiPalettes[features[1].colourKey])}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ width: '100%', mb: 4 }}>
              {renderFeatureCard(features[2], 2, aiPalettes[features[2].colourKey])}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ width: '100%' }}>
              {renderFeatureCard(features[3], 3, aiPalettes[features[3].colourKey])}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AISection;