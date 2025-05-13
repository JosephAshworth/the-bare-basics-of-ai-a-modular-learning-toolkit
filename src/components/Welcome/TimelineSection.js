// the timeline at the bottom that shows the history of AI

import React, { useState } from 'react';

// material ui components
import { 
  Box, 
  Container, 
  Typography, 
  Modal, 
  IconButton 
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

import { useTheme } from '@mui/material/styles';

// define the data for each dot on the timeline
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
    year: '2023 onwards',
    title: 'AI Integration',
    description: 'AI becomes integral to daily life and business operations worldwide'
  }
];

const PopupContent = ({ item }) => {
  const theme = useTheme();
  return (
    // define a content box with an overlay on the background page
    // these are returned as a single element without a wrapper in the DOM
    <React.Fragment>
      <Typography variant="h1" sx={{ 
        mb: 1,
        textAlign: 'center',
        color: theme.palette.text.primary
      }}>
        {item.year}
      </Typography>
      <Typography  sx={{ 
        fontWeight: 600,
        color: theme.palette.warning.main,
        mb: 1,
        textAlign: 'center'
      }}>
        {item.title}
      </Typography>
      <Typography sx={{ 
        textAlign: 'center',
        color: theme.palette.text.secondary
      }}>
        {item.description}
      </Typography>
    </React.Fragment>
  );
}

const TimelineSection = () => {
  const theme = useTheme();
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);

  const handleTimelineClick = (index) => {
    setSelectedItemIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedItemIndex(null);
  };

  // check if a timeline content box is open
  // if so, get the content for display
  const selectedItem = selectedItemIndex !== null ? timelineData[selectedItemIndex] : null;

  return (
    <Box sx={{
      py: 8,
    }}>
      <Container>
        <Typography variant="h3" sx={{ 
          mb: 8,
          color: theme.palette.text.primary,
          textAlign: 'center'
        }}>
          A Brief History of AI
        </Typography>

        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          <Box sx={{
            position: 'absolute',
            left: '50%',
            top: '10px',
            bottom: '50px',
            width: '2px',
            bgcolor: theme.palette.warning.main
          }}></Box>

          {/* for each item in the timeline data, display the content */}
          {timelineData.map((item, index) => {
            const isRightSide = index % 2 === 0; // check if the year text is on the right side of the timeline
            const contentMargin = '20px'; // the margin between the dot and the year text
            const dotRadius = 8; // the space around the dot

            return (
              <Box
                key={index} // help React identify each element in the list via its unique index key
                sx={{
                  mb: 4,
                  position: 'relative'
                }}
              >
                <Box
                  sx={{
                    position: 'absolute', // allow for top and left properties to be used
                    left: '50%', // half the parent element's width, effectively centering the dots
                    top: '50%', // half the parent element's height, effectively centering the dots
                    transform: 'translate(-50%, -50%)', // move the dots half their own width and height to the left and up
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: theme.palette.warning.main,
                    cursor: 'pointer',
                    zIndex: 1,
                    '&:hover': {
                      transform: 'translate(-50%, -50%) scale(1.1)', // when the dot is hovered over, make it larger
                      boxShadow: `0 0 8px ${theme.palette.warning.light}99` // as well as adding a light shadow
                    }
                  }}
                  onClick={() => handleTimelineClick(index)}
                ></Box>

                <Box
                  sx={{
                    width: `calc(50% - ${dotRadius}px - ${contentMargin})`, // the width of the year text box
                    textAlign: isRightSide ? 'left' : 'right', // if the year text is on the right side, align it to the left and vice versa
                    ml: isRightSide ? `calc(50% + ${dotRadius}px + ${contentMargin})` : '0', // if the year text is on the right side, move it to the right
                    mr: isRightSide ? '0' : `calc(50% + ${dotRadius}px + ${contentMargin})` // if the year text is on the left side, move it to the left
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.warning.main,
                      display: 'inline-block' // make sure the year text can still be styled with block properties while aligning inline with other elements
                    }}
                  >
                    {item.year}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Container>

      <Modal
        open={selectedItemIndex !== null}
        onClose={handleCloseModal}
        aria-labelledby="timeline-item-title"
        aria-describedby="timeline-item-description"
        closeAfterTransition
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box sx={{
          position: 'relative',
          outline: 'none',
          p: 2,
          borderRadius: 2,
          maxWidth: '90%',
          width: 'auto',
          maxHeight: '80vh',
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[10]
        }}>
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme.palette.text.secondary
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* display the pop up overlays themselves */}
          {selectedItem && (
            <Box sx={{ pt: 4, pb: 2, px: 3 }}>
              <PopupContent item={selectedItem} />
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default TimelineSection;