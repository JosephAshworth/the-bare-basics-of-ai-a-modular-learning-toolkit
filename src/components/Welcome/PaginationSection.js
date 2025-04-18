// import React from 'react';
// import { Box, Container, Pagination } from '@mui/material';

// const PaginationSection = ({ isDarkMode }) => {
//   return (
//     <Box sx={{ 
//       width: '100%',
//       minHeight: '30vh',
//       display: 'flex',
//       alignItems: 'center',
//       background: isDarkMode
//         ? 'linear-gradient(to bottom, rgba(255, 152, 0, 0.2), rgba(255, 127, 0, 0.3))'
//         : 'linear-gradient(to bottom, rgba(255, 236, 179, 0.5), rgba(255, 248, 230, 0.7), rgba(255, 152, 0, 0.15))',
//       py: 6,
//       mb: 0,
//       borderTop: '1px solid',
//       borderColor: isDarkMode ? 'rgba(255, 152, 0, 0.2)' : 'rgba(255, 152, 0, 0.1)'
//     }}>
//       <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center' }}>
//         <Pagination 
//           count={7} 
//           variant="outlined" 
//           shape="rounded" 
//           sx={{
//             '& .MuiPaginationItem-root': {
//               color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'var(--text-secondary)',
//               borderColor: isDarkMode ? 'rgba(255, 183, 77, 0.3)' : 'rgba(0, 0, 0, 0.1)',
//               '&.Mui-selected': {
//                 bgcolor: isDarkMode ? '#ffb74d' : 'var(--warning)',
//                 color: isDarkMode ? '#000' : 'white',
//                 fontWeight: 'bold',
//                 borderColor: 'transparent'
//               },
//               '&:hover': {
//                 bgcolor: isDarkMode ? 'rgba(255, 183, 77, 0.1)' : 'rgba(255, 152, 0, 0.04)'
//               }
//             }
//           }}
//         />
//       </Container>
//     </Box>
//   );
// };

// export default PaginationSection; 