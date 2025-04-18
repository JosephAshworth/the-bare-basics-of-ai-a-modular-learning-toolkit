import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  School as SchoolIcon,
  Code as CodeIcon,
  Psychology as PsychologyIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import { useThemeContext } from '../../context/ThemeContext';

function Footer() {
  const { theme } = useThemeContext();
  const isDarkMode = theme === 'dark';

  const footerLinks = [
    {
      title: 'Learning',
      links: [
        { text: 'Modules', path: '/modules', icon: <SchoolIcon /> },
        { text: 'Resources', path: '/resources', icon: <CodeIcon /> },
        { text: 'Practice', path: '/practice', icon: <PsychologyIcon /> }
      ]
    },
    {
      title: 'Support',
      links: [
        { text: 'FAQ', path: '/faq', icon: <SpeedIcon /> },
        { text: 'Contact', path: '/contact', icon: <SchoolIcon /> },
        { text: 'About Us', path: '/about', icon: <CodeIcon /> }
      ]
    }
  ];

  return (
    <Box 
      component="footer" 
      sx={{ 
        mt: 'auto',
        backgroundColor: isDarkMode ? '#121212' : '#f8f9fa',
        backgroundImage: isDarkMode ? 
          'linear-gradient(to top, #0a0a0a 0%, #121212 100%)' : 
          'linear-gradient(to top, #e6e9f0 0%, #f8f9fa 100%)',
        py: 8,
        borderTop: isDarkMode ? '1px solid #333' : '1px solid #e0e0e0',
        transition: 'all 0.3s ease'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Links Section */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={4}>
              {footerLinks.map((section, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: isDarkMode ? '#fff' : '#333',
                      mb: 3
                    }}
                  >
                    {section.title}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {section.links.map((link, linkIndex) => (
                      <Link
                        key={linkIndex}
                        to={link.path}
                        style={{ 
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Box 
                          sx={{ 
                            mr: 1.5,
                            color: isDarkMode ? '#66ccff' : '#1976d2',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          {link.icon}
                        </Box>
                        <Typography 
                          variant="body2"
                          sx={{
                            color: isDarkMode ? '#e0e0e0' : '#666',
                            transition: 'color 0.2s ease',
                            '&:hover': {
                              color: isDarkMode ? '#66ccff' : '#1976d2',
                            }
                          }}
                        >
                          {link.text}
                        </Typography>
                      </Link>
                    ))}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Contact & Social Section */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: isDarkMode ? '#fff' : '#333',
                mb: 3
              }}
            >
              Connect With Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography 
                variant="body2" 
                sx={{
                  color: isDarkMode ? '#e0e0e0' : '#666'
                }}
              >
                Follow us on social media for updates and learning resources.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <IconButton 
                  href="https://github.com" 
                  target="_blank"
                  sx={{
                    color: isDarkMode ? '#e0e0e0' : '#666',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: isDarkMode ? '#66ccff' : '#1976d2',
                      backgroundColor: isDarkMode ? 'rgba(102, 204, 255, 0.08)' : 'rgba(25, 118, 210, 0.04)'
                    }
                  }}
                >
                  <GitHubIcon />
                </IconButton>
                <IconButton 
                  href="https://linkedin.com" 
                  target="_blank"
                  sx={{
                    color: isDarkMode ? '#e0e0e0' : '#666',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: isDarkMode ? '#66ccff' : '#1976d2',
                      backgroundColor: isDarkMode ? 'rgba(102, 204, 255, 0.08)' : 'rgba(25, 118, 210, 0.04)'
                    }
                  }}
                >
                  <LinkedInIcon />
                </IconButton>
                <IconButton 
                  href="https://twitter.com" 
                  target="_blank"
                  sx={{
                    color: isDarkMode ? '#e0e0e0' : '#666',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: isDarkMode ? '#66ccff' : '#1976d2',
                      backgroundColor: isDarkMode ? 'rgba(102, 204, 255, 0.08)' : 'rgba(25, 118, 210, 0.04)'
                    }
                  }}
                >
                  <TwitterIcon />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider 
          sx={{ 
            my: 5,
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          }} 
        />

        {/* Copyright Section */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography 
            variant="body2" 
            sx={{
              color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
            }}
          >
            © {new Date().getFullYear()} The Bare Basics of AI. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer; 