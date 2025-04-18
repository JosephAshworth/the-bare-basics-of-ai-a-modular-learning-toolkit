import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ToggleButtonGroup,
  ToggleButton,
  Tabs,
  Tab
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ViewList as ViewListIcon,
  GridView as GridViewIcon
} from '@mui/icons-material';

const ModelExplanation = ({ explanations, loading }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [activeConfusionMatrix, setActiveConfusionMatrix] = useState('test');

  if (!explanations || !explanations.partial_dependence_plots) {
    return null;
  }

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Generating partial dependence plots...
        </Typography>
      </Box>
    );
  }

  const plots = explanations.partial_dependence_plots;
  const plotKeys = Object.keys(plots);

  if (plotKeys.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        No partial dependence plots available for this model.
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      {/* Partial Dependence Plots Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, border: '1px solid rgba(103, 58, 183, 0.2)', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h3" sx={{ color: 'rgb(103, 58, 183)', fontWeight: 500 }}>
            Partial Dependence Plots
          </Typography>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="view mode"
            size="small"
          >
            <ToggleButton value="grid" aria-label="grid view">
              <GridViewIcon />
            </ToggleButton>
            <ToggleButton value="list" aria-label="list view">
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {viewMode === 'grid' ? (
          <Grid container spacing={3}>
            {plotKeys.map((feature) => (
              <Grid item xs={12} md={6} key={feature}>
                <Paper elevation={2} sx={{ p: 2, border: '1px solid rgba(103, 58, 183, 0.1)' }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {feature}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                    <img
                      src={`data:image/png;base64,${plots[feature]}`}
                      alt={`Partial dependence plot for ${feature}`}
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  </Box>
                  {explanations.pdp_explanations && explanations.pdp_explanations[feature] && (
                    <Accordion 
                      sx={{ 
                        mt: 2,
                        '& .MuiAccordionSummary-root': {
                          minHeight: '48px',
                          '&.Mui-expanded': {
                            minHeight: '48px',
                          }
                        },
                        backgroundColor: 'rgba(103, 58, 183, 0.08)',
                        '&:before': {
                          display: 'none',
                        }
                      }}
                    >
                      <AccordionSummary 
                        expandIcon={<ExpandMoreIcon sx={{ color: 'rgb(103, 58, 183)' }} />}
                        sx={{
                          '& .MuiAccordionSummary-content': {
                            margin: '12px 0',
                            '&.Mui-expanded': {
                              margin: '12px 0',
                            }
                          },
                          backgroundColor: 'rgba(103, 58, 183, 0.08)',
                          '&:hover': {
                            backgroundColor: 'rgba(103, 58, 183, 0.12)',
                          }
                        }}
                      >
                        <Typography sx={{ fontWeight: 500, color: 'rgb(103, 58, 183)' }}>Feature Impact Analysis</Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ backgroundColor: 'white' }}>
                        {Object.entries(explanations.pdp_explanations[feature]).map(([classKey, explanation]) => (
                          <Typography key={classKey} paragraph>
                            {explanation}
                          </Typography>
                        ))}
                      </AccordionDetails>
                    </Accordion>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {plotKeys.map((feature) => (
              <Paper elevation={2} sx={{ p: 2, border: '1px solid rgba(103, 58, 183, 0.1)' }} key={feature}>
                <Typography variant="h6" gutterBottom>
                  {feature}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  <img
                    src={`data:image/png;base64,${plots[feature]}`}
                    alt={`Partial dependence plot for ${feature}`}
                    style={{ maxWidth: '100%', height: 'auto', maxHeight: '400px' }}
                  />
                </Box>
                {explanations.pdp_explanations && explanations.pdp_explanations[feature] && (
                  <Accordion 
                    sx={{ 
                      mt: 2,
                      '& .MuiAccordionSummary-root': {
                        minHeight: '48px',
                        '&.Mui-expanded': {
                          minHeight: '48px',
                        }
                      },
                      backgroundColor: 'rgba(103, 58, 183, 0.08)',
                      '&:before': {
                        display: 'none',
                      }
                    }}
                  >
                    <AccordionSummary 
                      expandIcon={<ExpandMoreIcon sx={{ color: 'rgb(103, 58, 183)' }} />}
                      sx={{
                        '& .MuiAccordionSummary-content': {
                          margin: '12px 0',
                          '&.Mui-expanded': {
                            margin: '12px 0',
                          }
                        },
                        backgroundColor: 'rgba(103, 58, 183, 0.08)',
                        '&:hover': {
                          backgroundColor: 'rgba(103, 58, 183, 0.12)',
                        }
                      }}
                    >
                      <Typography sx={{ fontWeight: 500, color: 'rgb(103, 58, 183)' }}>Feature Impact Analysis</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ backgroundColor: 'white' }}>
                      {Object.entries(explanations.pdp_explanations[feature]).map(([classKey, explanation]) => (
                        <Typography key={classKey} paragraph>
                          {explanation}
                        </Typography>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                )}
              </Paper>
            ))}
          </Box>
        )}

        {/* How to Read These Plots Section - Now inside PDP section */}
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ mb: 4 }} />
          <Accordion 
            sx={{ 
              '& .MuiAccordionSummary-root': {
                minHeight: '48px',
                '&.Mui-expanded': {
                  minHeight: '48px',
                }
              },
              backgroundColor: 'rgba(103, 58, 183, 0.08)',
              '&:before': {
                display: 'none',
              },
              '& .MuiAccordionDetails-root': {
                backgroundColor: 'white',
                borderTop: '1px solid rgba(103, 58, 183, 0.1)'
              }
            }}
          >
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon sx={{ color: 'rgb(103, 58, 183)' }} />}
              sx={{
                '& .MuiAccordionSummary-content': {
                  margin: '12px 0',
                  '&.Mui-expanded': {
                    margin: '12px 0',
                  }
                },
                backgroundColor: 'rgba(103, 58, 183, 0.08)',
                '&:hover': {
                  backgroundColor: 'rgba(103, 58, 183, 0.12)',
                }
              }}
            >
              <Typography sx={{ fontWeight: 500, color: 'rgb(103, 58, 183)' }}>How to Read These Plots</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: 'white' }}>
              <Typography paragraph>
                Partial Dependence Plots (PDPs) show how each feature affects the model's predictions while accounting for the average effect of all other features. Here's how to interpret them:
              </Typography>
              <Typography paragraph sx={{ pl: 2 }}>
                • The <strong>x-axis</strong> shows the values of the feature being analyzed
              </Typography>
              <Typography paragraph sx={{ pl: 2 }}>
                • The <strong>y-axis</strong> shows the predicted probability (between 0 and 1) for each class
              </Typography>
              <Typography paragraph sx={{ pl: 2 }}>
                • Each <strong>colored line</strong> represents a different class in the dataset
              </Typography>
              <Typography paragraph sx={{ pl: 2 }}>
                • <strong>Steeper lines</strong> indicate that changes in the feature have a stronger effect on predictions
              </Typography>
              <Typography paragraph sx={{ pl: 2 }}>
                • <strong>Flat lines</strong> suggest that the feature has little impact on predictions for that class
              </Typography>
              <Typography paragraph>
                For example, if a line shows a sharp increase, it means that higher values of that feature strongly increase the probability of predicting that particular class. Conversely, a downward slope indicates that higher feature values decrease the probability of that class prediction.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Paper>

      {/* Feature Importance Section */}
      <Paper elevation={3} sx={{ p: 3, border: '1px solid rgba(103, 58, 183, 0.2)', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'rgb(103, 58, 183)', fontWeight: 500 }}>
          Feature Importance Analysis
        </Typography>
        <Box sx={{ mt: 2 }}>
          {explanations.key_features ? Object.entries(explanations.key_features)
            .sort(([, a], [, b]) => b.importance - a.importance)
            .map(([feature, { importance }]) => (
              <Box key={feature} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {feature}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {importance.toFixed(1)}%
                  </Typography>
                </Box>
                <Box sx={{ width: '100%', bgcolor: 'rgba(103, 58, 183, 0.08)', borderRadius: 1 }}>
                  <Box
                    sx={{
                      width: `${importance}%`,
                      height: 8,
                      bgcolor: 'rgb(103, 58, 183)',
                      borderRadius: 1,
                      transition: 'width 1s ease-in-out'
                    }}
                  />
                </Box>
              </Box>
            )) : (
              <Alert severity="info" sx={{ mt: 1 }}>
                Feature importance is not available for KNN models. KNN makes predictions based on similarity between data points rather than learning feature weights.
              </Alert>
            )}
        </Box>
        
        {/* How to Interpret Feature Importance - Beginner Friendly Explanation */}
        {explanations.key_features && (
          <Box sx={{ mt: 4 }}>
            <Divider sx={{ mb: 3 }} />
            <Accordion 
              sx={{ 
                '& .MuiAccordionSummary-root': {
                  minHeight: '48px',
                  '&.Mui-expanded': {
                    minHeight: '48px',
                  }
                },
                backgroundColor: 'rgba(103, 58, 183, 0.08)',
                '&:before': {
                  display: 'none',
                },
                '& .MuiAccordionDetails-root': {
                  backgroundColor: 'white',
                  borderTop: '1px solid rgba(103, 58, 183, 0.1)'
                }
              }}
            >
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon sx={{ color: 'rgb(103, 58, 183)' }} />}
                sx={{
                  '& .MuiAccordionSummary-content': {
                    margin: '12px 0',
                    '&.Mui-expanded': {
                      margin: '12px 0',
                    }
                  },
                  backgroundColor: 'rgba(103, 58, 183, 0.08)',
                  '&:hover': {
                    backgroundColor: 'rgba(103, 58, 183, 0.12)',
                  }
                }}
              >
                <Typography sx={{ fontWeight: 500, color: 'rgb(103, 58, 183)' }}>How to Interpret Feature Importance</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: 'white' }}>
                <Typography paragraph>
                  Feature importance shows how much each variable (feature) contributes to the model's predictions. Think of it like a recipe - some ingredients have a bigger impact on the final dish than others.
                </Typography>
                <Typography paragraph sx={{ pl: 2 }}>
                  • <strong>Longer bars</strong> mean the feature has a stronger influence on the model's decisions
                </Typography>
                <Typography paragraph sx={{ pl: 2 }}>
                  • <strong>Shorter bars</strong> indicate features that have less impact on predictions
                </Typography>
                <Typography paragraph sx={{ pl: 2 }}>
                  • The <strong>percentage</strong> shows exactly how much each feature contributes (out of 100%)
                </Typography>
                <Typography paragraph sx={{ pl: 2 }}>
                  • Features are <strong>sorted</strong> from most important (top) to least important (bottom)
                </Typography>
                <Typography paragraph>
                  For example, if "petal length" has 40% importance, it means this feature alone influences 40% of the model's decisions. This helps you understand which aspects of your data are most valuable for making accurate predictions.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        )}
      </Paper>

      {/* Confusion Matrix Section */}
      {explanations.confusion_matrices && (
        <Paper elevation={3} sx={{ p: 3, mt: 4, border: '1px solid rgba(103, 58, 183, 0.2)', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ color: 'rgb(103, 58, 183)', fontWeight: 500 }}>
            Confusion Matrix
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <Tabs value={activeConfusionMatrix || 'test'} onChange={(e, newValue) => setActiveConfusionMatrix(newValue)}>
              <Tab value="train" label="Training Data" />
              <Tab value="test" label="Test Data" />
            </Tabs>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              {explanations.confusion_matrices[activeConfusionMatrix || 'test'] ? (
                <img
                  src={`data:image/png;base64,${explanations.confusion_matrices[activeConfusionMatrix || 'test']}`}
                  alt={`Confusion matrix for ${activeConfusionMatrix || 'test'} data`}
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              ) : (
                <Alert severity="info" sx={{ mt: 1 }}>
                  Confusion matrix is not available for this dataset.
                </Alert>
              )}
            </Box>
            
            <Box sx={{ mt: 4 }}>
              <Divider sx={{ mb: 3 }} />
              <Accordion 
                sx={{ 
                  '& .MuiAccordionSummary-root': {
                    minHeight: '48px',
                    '&.Mui-expanded': {
                      minHeight: '48px',
                    }
                  },
                  backgroundColor: 'rgba(103, 58, 183, 0.08)',
                  '&:before': {
                    display: 'none',
                  },
                  '& .MuiAccordionDetails-root': {
                    backgroundColor: 'white',
                    borderTop: '1px solid rgba(103, 58, 183, 0.1)'
                  }
                }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandMoreIcon sx={{ color: 'rgb(103, 58, 183)' }} />}
                  sx={{
                    '& .MuiAccordionSummary-content': {
                      margin: '12px 0',
                      '&.Mui-expanded': {
                        margin: '12px 0',
                      }
                    },
                    backgroundColor: 'rgba(103, 58, 183, 0.08)',
                    '&:hover': {
                      backgroundColor: 'rgba(103, 58, 183, 0.12)',
                    }
                  }}
                >
                  <Typography sx={{ fontWeight: 500, color: 'rgb(103, 58, 183)' }}>How to Interpret Confusion Matrix</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ backgroundColor: 'white' }}>
                  <Typography paragraph>
                    A confusion matrix shows how well your model is classifying each class. Here's how to read it:
                  </Typography>
                  <Typography paragraph sx={{ pl: 2 }}>
                    • <strong>Rows</strong> represent the actual (true) class
                  </Typography>
                  <Typography paragraph sx={{ pl: 2 }}>
                    • <strong>Columns</strong> represent the predicted class
                  </Typography>
                  <Typography paragraph sx={{ pl: 2 }}>
                    • <strong>Diagonal cells</strong> (top-left to bottom-right) show correct predictions
                  </Typography>
                  <Typography paragraph sx={{ pl: 2 }}>
                    • <strong>Off-diagonal cells</strong> show incorrect predictions (confusion)
                  </Typography>
                  <Typography paragraph>
                    For example, if the cell at the intersection of "row A" and "column B" has a value of 5, it means that 5 instances that are actually class A were incorrectly predicted as class B. The higher the values on the diagonal, the better your model is performing.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default ModelExplanation; 