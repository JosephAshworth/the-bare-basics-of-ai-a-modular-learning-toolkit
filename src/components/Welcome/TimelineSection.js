import
  React, // import React
  { useState } // import useState, this is used to manage state in functional components
from 'react';

import { 
  Box, // import Box from MUI
  Container, // import Container from MUI
  Typography, // import Typography from MUI
  Modal, // import Modal from MUI
  IconButton // import IconButton from MUI
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close'; // import CloseIcon from MUI

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on dark or light mode

const timelineData = [ // set the timeline data, this is an array of objects, each object represents a timeline item
  {
    year: '1950s', // set the year of the timeline item
    title: 'The birth of AI', // set the title of the timeline item
    description: 'The term "Artificial Intelligence" was coined at the Dartmouth Conference' // set the description of the timeline item
  },
  {
    year: '1960s', // set the year of the timeline item
    title: 'Early Development', // set the title of the timeline item
    description: 'First robotics and natural language processing programs were created' // set the description of the timeline item
  },
  {
    year: '1980s', // set the year of the timeline item
    title: 'Expert Systems', // set the title of the timeline item
    description: 'AI systems began to be used in practical applications' // set the description of the timeline item
  },
  {
    year: '2010s', // set the year of the timeline item
    title: 'Deep Learning Revolution', // set the title of the timeline item
    description: 'Breakthrough in neural networks and machine learning' // set the description of the timeline item
  },
  {
    year: '2023 onwards', // set the year of the timeline item
    title: 'AI Integration', // set the title of the timeline item
    description: 'AI becomes integral to daily life and business operations worldwide' // set the description of the timeline item
  }
];

const PopupContent = ({ item }) => { // set the PopupContent component, this is a functional component that renders the content of the modal
  const theme = useTheme(); // set the theme, this is used to access the theme object, which styles the components based on dark or light mode
  return (
    <React.Fragment>
      <Typography variant="h1" sx={{ 
        mb: 1, // set the margin bottom to 1, this is used to create a margin for the typography
        textAlign: 'center', // set the text alignment to centre, this is used to centre the text
        color: theme.palette.text.primary // set the colour to the primary colour from the theme object
      }}>
        {item.year}
      </Typography>
      <Typography  sx={{ 
        fontWeight: 600, // set the font weight to 600, this is used to create a bold font
        color: theme.palette.warning.main, // set the colour to the warning colour from the theme object
        mb: 1, // set the margin bottom to 1, this is used to create a margin for the typography
        textAlign: 'center' // set the text alignment to centre, this is used to centre the text
      }}>
        {item.title}
      </Typography>
      <Typography sx={{ 
        textAlign: 'center', // set the text alignment to centre, this is used to centre the text
        color: theme.palette.text.secondary // set the colour to the secondary colour from the theme object
      }}>
        {item.description} {/* set the description to the description from the item */}
      </Typography>
    </React.Fragment>
  );
}

const TimelineSection = () => { // set the TimelineSection component, this is a functional component that renders the timeline
  const theme = useTheme(); // for getting the MUI theme object
  const [selectedItemIndex, setSelectedItemIndex] = useState(null); // set the selected item index, this is used to manage the selected dot

  const handleTimelineClick = (index) => {
    setSelectedItemIndex(index); // set the selected item index to the index of the clicked dot
  };

  const handleCloseModal = () => {
    setSelectedItemIndex(null); // set the selected item index to null, this is used to close the modal
  };

  const selectedItem = selectedItemIndex !== null ? timelineData[selectedItemIndex] : null; // set the selected item to the selected item index if it is not null, this is used to display the content of the modal

  return (
    <Box sx={{
      py: 8, // set the vertical padding top and bottom to 8, this is used to create a padding for the box
    }}>
      <Container>
        <Typography variant="h3" sx={{ 
          mb: 8, // set the margin bottom to 8, this is used to create space between the heading and the timeline
          color: theme.palette.text.primary, // set the colour to the primary colour from the theme object
          textAlign: 'center' // set the text alignment to centre, this is used to centre the text
        }}>
          A Brief History of AI
        </Typography>

        <Box sx={{
          display: 'flex', // set the display to flex, this is used to create a flex container
          flexDirection: 'column', // set the flex direction to column, this is used to create a vertical flex container
          position: 'relative', // set the position to relative, this is used to position the timeline relative to the normal position of the page
        }}>
          <Box sx={{
            position: 'absolute', // set the position to absolute, this is used to position the timeline relative to the parent container
            left: '50%', // set the left position to 50%, this is used to centre the timeline
            top: '10px', // set the top position to 10px, this is used to create a margin for the timeline
            bottom: '50px', // set the bottom position to 50px, this is used to create a margin for the timeline
            width: '2px', // set the width to 2px, this is used to create a width for the timeline
            bgcolor: theme.palette.warning.main, // set the background colour to the warning colour from the theme object
          }}></Box>

          {timelineData.map((item, index) => { // map through the timeline data, this is used to create a timeline item for each item in the timeline data
            const isRightSide = index % 2 === 0; // set the isRightSide to the index modulo 2, this is used to determine if the timeline item is on the right or left side
            const contentMargin = '20px'; // set the content margin to 20px, this is used to create a margin for the timeline
            const dotRadius = 8; // set the dot radius to 8, this is used to create a radius for the dot

            return (
              <Box
                key={index} // set the key to the index to ensure that the timeline item is unique
                sx={{
                  mb: 4, // set the margin bottom to 4, this is used to create a margin for the timeline
                  position: 'relative', // set the position to relative, this is used to position the timeline relative to the parent container
                }}
              >
                <Box
                  sx={{
                    position: 'absolute', // set the position to absolute, this is used to position the timeline relative to the parent container
                    left: '50%', // set the left position to 50%, this is used to centre the timeline
                    top: '50%', // set the top position to 50%, this is used to centre the timeline
                    transform: 'translate(-50%, -50%)', // set the transform to translate(-50%, -50%), this is used to centre the timeline
                    width: '16px', // set the width to 16px, this is used to create a width for the timeline
                    height: '16px', // set the height to 16px, this is used to create a height for the timeline
                    borderRadius: '50%', // set the border radius to 50%, this is used to create a rounded border for the timeline
                    backgroundColor: theme.palette.warning.main, // set the background colour to the warning colour from the theme object
                    cursor: 'pointer', // set the cursor to pointer, this is used to create a pointer cursor for the timeline
                    zIndex: 1, // set the z index to 1, this is used to make the timeline item appear on top of the other timeline items
                    '&:hover': {
                      transform: 'translate(-50%, -50%) scale(1.1)', // when the timeline item is hovered over, the timeline item will scale up slightly
                      boxShadow: `0 0 8px ${theme.palette.warning.light}99` // set the box shadow to the warning colour from the theme object
                    }
                  }}
                  onClick={() => handleTimelineClick(index)} // when the timeline item is clicked, the handleTimelineClick function will be called
                ></Box>


                <Box
                  sx={{
                    width: `calc(50% - ${dotRadius}px - ${contentMargin})`, // set the width to the width of the timeline item minus the dot radius and the content margin
                    textAlign: isRightSide ? 'left' : 'right', // set the text alignment to left if the timeline item is on the right side, and right if the timeline item is on the left side
                    ml: isRightSide ? `calc(50% + ${dotRadius}px + ${contentMargin})` : '0', // set the margin left to the dot radius and the content margin if the timeline item is on the right side, and 0 if the timeline item is on the left side
                    mr: isRightSide ? '0' : `calc(50% + ${dotRadius}px + ${contentMargin})` // set the margin right to 0 if the timeline item is on the right side, and the dot radius and the content margin if the timeline item is on the left side
                  }}
                >
                  <Typography
                    variant="h6" // set the variant to h6, this is used to create a heading for the timeline item
                    sx={{
                      fontWeight: 600, // set the font weight to 600, this is used to create a bold font
                      color: theme.palette.warning.main, // set the colour to the warning colour from the theme object
                      display: 'inline-block' // set the display to inline-block, this is used to create a block display for the timeline item
                    }}
                  >
                    {item.year} {/* set the year to the year from the item */}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Container>

      <Modal
        open={selectedItemIndex !== null} // set the open to the selected item index if it is not null, this is used to display the modal
        onClose={handleCloseModal} // when the modal is closed, the handleCloseModal function will be called
        aria-labelledby="timeline-item-title" // set the aria labelled by to the timeline item title
        aria-describedby="timeline-item-description" // set the aria described by to the timeline item description
        closeAfterTransition // set the close after transition to true, this is used to close the modal after the transition
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} // set the display to flex, this is used to create a flex container
      >
        <Box sx={{
          position: 'relative', // set the position to relative, this is used to position the modal relative to the normal position of the page
          outline: 'none', // set the outline to none, this is used to remove the outline of the modal
          p: 2, // set the padding to 2, this is used to create a padding for the modal
          borderRadius: 2, // set the border radius to 2, this is used to create a rounded border for the modal
          maxWidth: '90%', // set the max width to 90%, this is used to create a max width for the modal
          width: 'auto', // set the width to auto, this is used to create a width for the modal
          maxHeight: '80vh', // set the max height to 80vh, this is used to create a max height for the modal
          bgcolor: theme.palette.background.paper, // set the background colour to the background colour from the theme object
          border: `1px solid ${theme.palette.divider}`, // set the border to the divider colour from the theme object
          boxShadow: theme.shadows[10], // set the box shadow to the shadow from the theme object
          color: theme.palette.text.primary, // set the colour to the primary colour from the theme object
        }}>
          <IconButton
            aria-label="close" // set the aria label to close, this is used to create a close button for the modal
            onClick={handleCloseModal} // when the close button is clicked, the handleCloseModal function will be called
            sx={{
              position: 'absolute', // set the position to absolute, this is used to position the close button relative to the modal
              right: 8, // set the right position to 8, this is used to create a margin for the close button
              top: 8, // set the top position to 8, this is used to create a margin for the close button
              color: (theme) => theme.palette.grey[500], // set the colour to the grey colour from the theme object
            }}
          >
            <CloseIcon /> {/* set the close icon to the close icon from MUI */}
          </IconButton>
          {selectedItem && ( // if an item is selected
            <Box sx={{ pt: 4, pb: 2, px: 3 }}> {/* set the padding top to 4, the padding bottom to 2, and the padding left and right to 3, this is used to create a padding for the modal */}
              <PopupContent item={selectedItem} /> {/* set the popup content to the selected item */}
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default TimelineSection; // export the TimelineSection component, so it can be used in other files
