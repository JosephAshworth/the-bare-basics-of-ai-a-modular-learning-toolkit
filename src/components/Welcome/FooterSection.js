// import React from 'react';
// import { 
//   Box, 
//   Container, 
//   Grid, 
//   Typography, 
//   TextField, 
//   Button, 
//   IconButton 
// } from '@mui/material';
// import { 
//   Psychology as PsychologyIcon,
//   Send as SendIcon,
//   Twitter as TwitterIcon,
//   LinkedIn as LinkedInIcon,
//   GitHub as GitHubIcon,
//   YouTube as YouTubeIcon 
// } from '@mui/icons-material';

// const FooterSection = ({ isDarkMode }) => {
//   return (
//     <Box 
//       component="footer" 
//       sx={{ 
//         width: '100%',
//         background: isDarkMode
//           ? 'linear-gradient(to bottom, rgba(255, 152, 0, 0.2), rgba(255, 127, 0, 0.3))'
//           : 'linear-gradient(to bottom, rgba(255, 236, 179, 0.5), rgba(255, 248, 230, 0.7), rgba(255, 152, 0, 0.15))', 
//         borderTop: '1px solid',
//         borderColor: isDarkMode ? 'rgba(255, 152, 0, 0.2)' : 'rgba(255, 152, 0, 0.1)', 
//         py: 4,
//         mt: 0
//       }}
//       className="welcome-footer"
//       role="contentinfo"
//       aria-label="Website Footer"
//     >
//       <Container maxWidth="lg">
//         <Grid container spacing={4}>
//           <Grid item xs={12} md={3}>
//             <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//               <PsychologyIcon 
//                 sx={{ 
//                   fontSize: 24, 
//                   color: isDarkMode ? '#ffb74d' : 'var(--warning)', 
//                   mr: 1 
//                 }} 
//                 aria-hidden="true" 
//               />
//               <Typography 
//                 variant="h6" 
//                 sx={{ 
//                   fontWeight: 600,
//                   color: isDarkMode ? '#fff' : 'inherit'
//                 }}
//               >
//                 The Bare Basics of AI
//               </Typography>
//             </Box>
//             <Typography 
//               variant="body2" 
//               sx={{ 
//                 mb: 2,
//                 color: isDarkMode ? '#e0e0e0' : 'inherit'
//               }}
//             >
//               Empowering the next generation of AI practitioners through structured learning.
//             </Typography>
//             <Typography 
//               variant="body2" 
//               sx={{ 
//                 color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'var(--text-secondary)' 
//               }}
//             >
//               © {new Date().getFullYear()} The Bare Basics of AI. All rights reserved.
//             </Typography>
//           </Grid>
//           <Grid item xs={6} md={2}>
//             <Typography 
//               variant="subtitle1" 
//               sx={{ 
//                 fontWeight: 600, 
//                 mb: 2,
//                 color: isDarkMode ? '#fff' : 'inherit'
//               }}
//             >
//               Quick Links
//             </Typography>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//               <Typography 
//                 variant="body2" 
//                 component="a" 
//                 href="/about" 
//                 className="footer-link"
//                 sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'inherit' }}
//               >
//                 About Us
//               </Typography>
//               <Typography 
//                 variant="body2" 
//                 component="a" 
//                 href="/careers" 
//                 className="footer-link"
//                 sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'inherit' }}
//               >
//                 Careers
//               </Typography>
//               <Typography 
//                 variant="body2" 
//                 component="a" 
//                 href="/blog" 
//                 className="footer-link"
//                 sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'inherit' }}
//               >
//                 Blog
//               </Typography>
//               <Typography 
//                 variant="body2" 
//                 component="a" 
//                 href="/contact" 
//                 className="footer-link"
//                 sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'inherit' }}
//               >
//                 Contact
//               </Typography>
//             </Box>
//           </Grid>
//           <Grid item xs={6} md={2}>
//             <Typography 
//               variant="subtitle1" 
//               sx={{ 
//                 fontWeight: 600, 
//                 mb: 2,
//                 color: isDarkMode ? '#fff' : 'inherit'
//               }}
//             >
//               Resources
//             </Typography>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//               <Typography 
//                 variant="body2" 
//                 component="a" 
//                 href="/docs" 
//                 className="footer-link"
//                 sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'inherit' }}
//               >
//                 Documentation
//               </Typography>
//               <Typography 
//                 variant="body2" 
//                 component="a" 
//                 href="/developers" 
//                 className="footer-link"
//                 sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'inherit' }}
//               >
//                 Developer
//               </Typography>
//               <Typography 
//                 variant="body2" 
//                 component="a" 
//                 href="/community" 
//                 className="footer-link"
//                 sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'inherit' }}
//               >
//                 Community
//               </Typography>
//               <Typography 
//                 variant="body2" 
//                 component="a" 
//                 href="/faq" 
//                 className="footer-link"
//                 sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'inherit' }}
//               >
//                 FAQ
//               </Typography>
//             </Box>
//           </Grid>
//           <Grid item xs={12} md={5}>
//             <Typography 
//               variant="subtitle1" 
//               sx={{ 
//                 fontWeight: 600, 
//                 mb: 2,
//                 color: isDarkMode ? '#fff' : 'inherit'
//               }}
//             >
//               Newsletter
//             </Typography>
//             <Typography 
//               variant="body2" 
//               sx={{ 
//                 mb: 2,
//                 color: isDarkMode ? '#e0e0e0' : 'inherit'
//               }}
//             >
//               Stay updated with our latest courses and AI news
//             </Typography>
//             <Box 
//               component="form" 
//               sx={{ display: 'flex' }}
//               role="form"
//               aria-label="Newsletter Subscription"
//             >
//               <TextField 
//                 size="small" 
//                 placeholder="Enter your email" 
//                 fullWidth 
//                 aria-label="Email address"
//                 id="newsletter-email"
//                 sx={{ 
//                   bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'white',
//                   '& .MuiOutlinedInput-root': {
//                     '& fieldset': {
//                       borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0,0,0,0.1)',
//                     },
//                     '&:hover fieldset': {
//                       borderColor: isDarkMode ? '#ffb74d' : 'var(--warning)',
//                     },
//                     '& input': {
//                       color: isDarkMode ? '#fff' : 'inherit',
//                     }
//                   }
//                 }}
//               />
//               <Button 
//                 variant="contained" 
//                 aria-label="Subscribe to newsletter"
//                 sx={{
//                   ml: 1, 
//                   bgcolor: isDarkMode ? '#ffb74d' : 'var(--warning)', 
//                   '&:hover': {
//                     bgcolor: isDarkMode ? '#ffa726' : 'var(--warning-dark)'
//                   },
//                   color: isDarkMode ? '#000' : '#fff'
//                 }}
//               >
//                 <SendIcon aria-hidden="true" />
//               </Button>
//             </Box>
//           </Grid>
//         </Grid>
//         <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2 }}>
//           <IconButton 
//             size="small" 
//             aria-label="Twitter" 
//             href="https://twitter.com" 
//             target="_blank"
//             rel="noopener noreferrer"
//             sx={{ color: isDarkMode ? '#ffb74d' : 'var(--warning)' }}
//           >
//             <TwitterIcon aria-hidden="true" />
//           </IconButton>
//           <IconButton 
//             size="small" 
//             aria-label="LinkedIn" 
//             href="https://linkedin.com" 
//             target="_blank"
//             rel="noopener noreferrer"
//             sx={{ color: isDarkMode ? '#ffb74d' : 'var(--warning)' }}
//           >
//             <LinkedInIcon aria-hidden="true" />
//           </IconButton>
//           <IconButton 
//             size="small" 
//             aria-label="GitHub" 
//             href="https://github.com" 
//             target="_blank"
//             rel="noopener noreferrer"
//             sx={{ color: isDarkMode ? '#ffb74d' : 'var(--warning)' }}
//           >
//             <GitHubIcon aria-hidden="true" />
//           </IconButton>
//           <IconButton 
//             size="small" 
//             aria-label="YouTube" 
//             href="https://youtube.com" 
//             target="_blank"
//             rel="noopener noreferrer"
//             sx={{ color: isDarkMode ? '#ffb74d' : 'var(--warning)' }}
//           >
//             <YouTubeIcon aria-hidden="true" />
//           </IconButton>
//         </Box>
//       </Container>
//     </Box>
//   );
// };

// export default FooterSection;