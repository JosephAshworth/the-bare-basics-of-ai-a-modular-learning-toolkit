// the combination of the performance metrics, model insights and model visualisation

// material ui components
import {
  Box,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery
} from '@mui/material';

// import the necesary components from the other files
import PerformanceMetrics from './PerformanceMetrics';
import DecisionTreeVisualisation from './DecisionTreeVisualisation';
import ModelExplanation from './ModelExplanation';

const ModelResults = ({ 
  metrics,
  selectedTab,
  handleTabChange,
  modelType,
  visualisation,
  explanations
}) => {
  const getAvailableTabs = () => {
    const availableTabs = [
      { label: "Performance Metrics", id: 0 },
      { label: "Model Insights", id: 2 }
    ];
    
    // if the model type is a decision tree, add the model visualisation tab in the second position
    if (modelType === 'decision_tree') {
      availableTabs.splice(1, 0, { label: "Model Visualisation", id: 1 });
    }
    
    return availableTabs;
  };
  
  const availableTabs = getAvailableTabs();
  
  const getTabId = (index) => {
    return availableTabs[index]?.id || 0;
  };
  
  const getTabIndex = (id) => {
    return availableTabs.findIndex(tab => tab.id === id) || 0;
  };
  
  const handleTabChangeWithMapping = (event, newValue) => {
    handleTabChange(event, getTabId(newValue));
  };
  
  const currentTabIndex = getTabIndex(selectedTab);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box sx={{
          width: '100%',

          // if on mobile, display the tabs as a block element, stacking the children vertically
          // otherwise, display the tabs as a flex container
          display: isMobile ? 'block' : 'flex',

          // if on mobile, justify the children to the left
          // otherwise justify to the center
          justifyContent: isMobile ? 'flex-start' : 'center',
          borderBottom: 1,
          borderColor: theme.palette.divider,
          mb: 2
        }}>
        <Tabs 
          value={currentTabIndex} 
          onChange={handleTabChangeWithMapping} 
          aria-label="model results tabs"
          orientation={isMobile ? 'vertical' : 'horizontal'} // if on mobile, display the tabs vertically, otherwise display them horizontally
          variant={'scrollable'}
          allowScrollButtonsMobile={false}
          sx={{
            width: isMobile ? '100%' : 'auto',
            '.MuiTab-root': {
              alignItems: isMobile ? 'flex-start' : 'center',
              minHeight: '48px',
              px: isMobile ? 2 : '16px'
            }
          }}
        >
          {/* loop through the available tabs and display them */}
          {availableTabs.map((tab) => (
            <Tab key={tab.id} label={tab.label} />
          ))}
        </Tabs>
      </Box>

        <Box sx={{
          width: '100%',
          p: 3
        }}
        >

      
      {selectedTab === 0 && (
        <PerformanceMetrics
          metrics={metrics}
        />
      )}

      {selectedTab === 1 && modelType === 'decision_tree' && (
           <DecisionTreeVisualisation
             visualisation={visualisation}
           />
      )}

      {selectedTab === 2 && (
            <>
          {explanations && (
            <ModelExplanation explanations={explanations} />
          )}
            </>
      )}
        </Box>
      </Box>
    </Box>
  );
};

export default ModelResults;