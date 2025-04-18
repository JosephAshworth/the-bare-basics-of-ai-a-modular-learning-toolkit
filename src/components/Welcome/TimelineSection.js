import React, { useState } from 'react';
import { Box, Container, Typography, Popover, Tooltip } from '@mui/material';

const timelineData = [
  {
    year: '1950s',
    title: 'The birth of AI',
    description: 'The term "Artificial Intelligence" was coined at the Dartmouth Conference'
  },
  {
    year: '1960s',
    title: 'Early Development',
    description: 'First robotics and natural language processing programs were created'
  },
  {
    year: '1980s',
    title: 'Expert Systems',
    description: 'AI systems began to be used in practical applications'
  },
  {
    year: '2010s',
    title: 'Deep Learning Revolution',
    description: 'Breakthrough in neural networks and machine learning'
  },
  {
    year: '2023',
    title: 'AI Integration',
    description: 'AI becomes integral to daily life and business operations worldwide'
  }
];

const TimelineSection = ({ isDarkMode, sectionBackground }) => {
  const [anchorEls, setAnchorEls] = useState({});

  const handleTimelineClick = (event, index) => {
    setAnchorEls(prev => ({
      ...prev,
      [index]: prev[index] ? null : event.currentTarget
    }));
  };

  const handleTimelineClose = (index) => {
    setAnchorEls(prev => ({
      ...prev,
      [index]: null
    }));
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
      borderColor: isDarkMode ? 'rgba(255, 152, 0, 0.2)' : 'rgba(255, 152, 0, 0.1)',
      boxShadow: isDarkMode ? 'inset 0 10px 20px -10px rgba(0, 0, 0, 0.6)' : 'none'
    }}>
      <Container maxWidth="lg" sx={{ backgroundColor: 'transparent' }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 600, 
          mb: 4,
          color: isDarkMode ? '#fff' : 'inherit'
        }}>
          A Brief History of AI
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {/* Timeline line */}
          <Box sx={{ 
            position: 'absolute', 
            left: '10px', 
            top: '10px', 
            bottom: '10px', 
            width: '2px', 
            bgcolor: isDarkMode ? '#ffb74d' : 'var(--warning)',
            opacity: isDarkMode ? 0.6 : 0.5
          }}></Box>
          
          {/* Timeline items */}
          {timelineData.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', mb: 4, pl: 4, position: 'relative' }}>
              <Tooltip 
                title={
                  <React.Fragment>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{item.title}</Typography>
                    <Typography variant="body2">{item.description}</Typography>
                  </React.Fragment>
                }
                placement="right"
                arrow
              >
                <Box 
                  className="timeline-dot" 
                  sx={{ 
                    position: 'absolute', 
                    left: 0,
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: isDarkMode ? '#ffb74d' : 'var(--warning)',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-50%) scale(1.2)',
                      boxShadow: isDarkMode 
                        ? '0 0 12px rgba(255, 183, 77, 0.8)' 
                        : '0 0 8px rgba(255, 152, 0, 0.6)'
                    }
                  }}
                  onClick={(e) => handleTimelineClick(e, index)}
                ></Box>
              </Tooltip>
              
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                color: isDarkMode ? '#ffb74d' : 'var(--warning)', 
                ml: 2 
              }}>
                {item.year}
              </Typography>
              
              <Popover
                open={Boolean(anchorEls[index])}
                anchorEl={anchorEls[index]}
                onClose={() => handleTimelineClose(index)}
                anchorOrigin={{
                  vertical: 'center',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'center',
                  horizontal: 'left',
                }}
                sx={{
                  '& .MuiPopover-paper': {
                    p: 2,
                    maxWidth: 300,
                    bgcolor: isDarkMode 
                      ? 'rgba(30, 41, 59, 0.95)' 
                      : 'rgba(255, 248, 225, 0.95)',
                    border: isDarkMode 
                      ? '1px solid rgba(255, 183, 77, 0.3)' 
                      : '1px solid var(--warning)',
                    borderRadius: 2,
                    boxShadow: isDarkMode 
                      ? '0 8px 32px rgba(0, 0, 0, 0.5)' 
                      : '0 4px 12px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Typography variant="subtitle1" sx={{ 
                  fontWeight: 600, 
                  color: isDarkMode ? '#ffb74d' : 'var(--warning)', 
                  mb: 1 
                }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: isDarkMode ? '#e0e0e0' : 'inherit' 
                }}>
                  {item.description}
                </Typography>
              </Popover>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default TimelineSection;