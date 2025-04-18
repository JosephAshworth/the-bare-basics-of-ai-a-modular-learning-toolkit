import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab
} from '@mui/material';
import PerformanceMetrics from './PerformanceMetrics';
import DecisionTreeVisualization from './DecisionTreeVisualization';
import ModelExplanation from './ModelExplanation';
import { formatMetric, metricDescriptions } from './MetricsFormatter';

const ModelResults = ({ 
  metrics, 
  selectedTab, 
  handleTabChange, 
  modelType, 
  visualization, 
  loading, 
  explanations, 
  loadingPDP 
}) => {
  // Get available tabs based on model type
  const getAvailableTabs = () => {
    const availableTabs = [
      { label: "Performance Metrics", id: 0 },
      { label: "Model Insights", id: 2 }
    ];
    
    // Only add visualization tab for decision trees
    if (modelType === 'decision_tree') {
      availableTabs.splice(1, 0, { label: "Model Visualization", id: 1 });
    }
    
    return availableTabs;
  };
  
  const availableTabs = getAvailableTabs();
  
  // Map the selected tab index to the actual tab ID
  const getTabId = (index) => {
    return availableTabs[index]?.id || 0;
  };
  
  // Find the index of a tab by its ID
  const getTabIndex = (id) => {
    return availableTabs.findIndex(tab => tab.id === id) || 0;
  };
  
  // Handle tab change with mapping
  const handleTabChangeWithMapping = (event, newValue) => {
    handleTabChange(event, getTabId(newValue));
  };
  
  // Current tab index based on selected tab ID
  const currentTabIndex = getTabIndex(selectedTab);

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={currentTabIndex} 
          onChange={handleTabChangeWithMapping} 
          aria-label="model results tabs"
        >
          {availableTabs.map((tab, index) => (
            <Tab key={tab.id} label={tab.label} />
          ))}
        </Tabs>
      </Box>

      {/* Performance Metrics Tab */}
      {selectedTab === 0 && (
        <PerformanceMetrics 
          metrics={metrics} 
          metricDescriptions={metricDescriptions} 
          formatMetric={formatMetric} 
        />
      )}

      {/* Model Visualization Tab - Only for Decision Trees */}
      {selectedTab === 1 && modelType === 'decision_tree' && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Model Visualization</Typography>
          <DecisionTreeVisualization 
            visualization={visualization} 
            loading={loading} 
          />
        </Paper>
      )}

      {/* Model Insights Tab */}
      {selectedTab === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Model Insights</Typography>
          {explanations && (
            <ModelExplanation explanations={explanations} loading={loadingPDP} />
          )}
        </Paper>
      )}
    </Box>
  );
};

export default ModelResults; 