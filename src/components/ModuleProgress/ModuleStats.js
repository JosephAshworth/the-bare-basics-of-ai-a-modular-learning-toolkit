import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress
} from '@mui/material';
import axios from 'axios';
import { auth } from '../../firebase';
import { useThemeContext } from '../../context/ThemeContext';

const ModuleStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useThemeContext();
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = await auth.currentUser.getIdToken();
        const response = await axios.get('/api/modules/stats', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching module stats:', err);
        if (err.response?.status === 403) {
          setError('You do not have permission to view this data.');
        } else {
          setError('Failed to load module statistics. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (auth.currentUser) {
      fetchStats();
    }
    
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchStats();
      }
    });
    
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
    );
  }

  if (!stats) {
    return null;
  }

  const { totalUsers, moduleCompletions, completionRates } = stats;

  return (
    <Paper sx={{ 
      p: 3, 
      mb: 3, 
      backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
      borderRadius: 2,
      boxShadow: isDarkMode ? '0 4px 20px rgba(0, 0, 0, 0.4)' : '0 2px 10px rgba(0, 0, 0, 0.05)'
    }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: isDarkMode ? '#fff' : '#333' }}>
        Module Completion Statistics
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 2, color: isDarkMode ? '#e0e0e0' : '#555' }}>
        Total Users: {totalUsers}
      </Typography>
      
      <TableContainer component={Paper} sx={{ 
        mb: 3, 
        backgroundColor: isDarkMode ? '#2d2d2d' : '#fff',
        boxShadow: 'none'
      }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ 
                fontWeight: 600, 
                color: isDarkMode ? '#e0e0e0' : '#333',
                borderBottomColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : undefined
              }}>Module</TableCell>
              <TableCell align="center" sx={{ 
                fontWeight: 600, 
                color: isDarkMode ? '#e0e0e0' : '#333',
                borderBottomColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : undefined
              }}>Completions</TableCell>
              <TableCell align="center" sx={{ 
                fontWeight: 600, 
                color: isDarkMode ? '#e0e0e0' : '#333',
                borderBottomColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : undefined
              }}>Completion Rate</TableCell>
              <TableCell sx={{ 
                fontWeight: 600, 
                color: isDarkMode ? '#e0e0e0' : '#333',
                borderBottomColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : undefined
              }}>Progress</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(moduleCompletions).map(([moduleId, completions]) => (
              <TableRow key={moduleId}>
                <TableCell sx={{ 
                  color: isDarkMode ? '#e0e0e0' : '#555',
                  borderBottomColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : undefined
                }}>
                  {moduleId}
                </TableCell>
                <TableCell align="center" sx={{ 
                  color: isDarkMode ? '#e0e0e0' : '#555',
                  borderBottomColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : undefined
                }}>
                  {completions} / {totalUsers}
                </TableCell>
                <TableCell align="center" sx={{ 
                  color: isDarkMode ? '#e0e0e0' : '#555',
                  borderBottomColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : undefined
                }}>
                  {completionRates[moduleId]}%
                </TableCell>
                <TableCell sx={{ 
                  borderBottomColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : undefined,
                  width: '30%'
                }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={completionRates[moduleId]} 
                    sx={{ 
                      height: 10, 
                      borderRadius: 5,
                      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: isDarkMode ? '#90caf9' : '#1976d2'
                      }
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ModuleStats; 