import {
  Box, // import Box from @mui/material
  Tabs, // import Tabs from @mui/material
  Tab, // import Tab from @mui/material
  useTheme, // import useTheme from @mui/material
  useMediaQuery // import useMediaQuery from @mui/material
} from '@mui/material';

import PerformanceMetrics from './PerformanceMetrics'; // import PerformanceMetrics from ./PerformanceMetrics.js, this is a component that displays the performance metrics of the model

import DecisionTreeVisualisation from './DecisionTreeVisualisation'; // import DecisionTreeVisualisation from ./DecisionTreeVisualisation.js, this is a component that displays the decision tree visualisation of the model

import ModelExplanation from './ModelExplanation'; // import ModelExplanation from ./ModelExplanation.js, this is a component that displays the model explanation of the model

import { formatMetric, metricDescriptions } from './MetricsFormatter'; // import formatMetric and metricDescriptions from ./MetricsFormatter.js, this is a component that formats the metrics of the model

const ModelResults = ({ 
  metrics, // the metrics of the model
  selectedTab, // the selected tab of the model
  handleTabChange, // the handle tab change of the model
  modelType, // the model type of the model
  visualisation, // the visualisation of the model
  explanations // the explanations of the model
}) => {
  const getAvailableTabs = () => { // function to get the available tabs
    const availableTabs = [
      { label: "Performance Metrics", id: 0 }, // the performance metrics tab, with the id of 0
      { label: "Model Insights", id: 2 } // the model insights tab, with the id of 2
    ];
    
    if (modelType === 'decision_tree') { // if the model type is decision tree
      availableTabs.splice(1, 0, { label: "Model Visualisation", id: 1 }); // add the model visualisation tab to the available tabs, between the performance metrics and the model insights tabs
    }
    
    return availableTabs; // return the available tabs
  };
  
  const availableTabs = getAvailableTabs(); // get the available tabs
  
  const getTabId = (index) => { // function to get the tab id
    return availableTabs[index]?.id || 0; // return the tab id
  };
  
  const getTabIndex = (id) => { // function to get the tab index
    return availableTabs.findIndex(tab => tab.id === id) || 0; // return the tab index
  };
  
  const handleTabChangeWithMapping = (event, newValue) => { // function to handle the tab change with mapping
    handleTabChange(event, getTabId(newValue)); // handle the tab change with the mapping
  };
  
  const currentTabIndex = getTabIndex(selectedTab); // get the current tab index

  const theme = useTheme(); // for getting the MUI theme object
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // for checking if the screen is mobile

  return (
    <Box sx={{ width: '100%', mb: 4 }}> {/* display the box with a width of 100%, which is the width of the page, and a margin bottom of 4 units, adding space below the box */}
      <Box
        sx={{
          display: 'flex', // display the box as a flex container
          flexDirection: 'column' // set the flex direction of the box to column, so the box items are stacked vertically
        }}
      >
        <Box sx={{
          width: '100%', // set the width of the box to 100%, which is the width of the parent element
          display: isMobile ? 'block' : 'flex', // if the screen is mobile, display the box as a block element, otherwise display the box as a flex container
          justifyContent: isMobile ? 'flex-start' : 'center', // if the screen is mobile, justify the content of the box to the start, otherwise justify the content of the box to the centre
          borderBottom: 1, // add a bottom border to the box
          borderColor: theme.palette.divider, // set the border colour of the box to the divider colour from the theme
          mb: 2 // add a margin bottom to the box
        }}>
        <Tabs 
          value={currentTabIndex} 
          onChange={handleTabChangeWithMapping} 
          aria-label="model results tabs" // set the aria label of the tabs to model results tabs
          orientation={isMobile ? 'vertical' : 'horizontal'} // if the screen is mobile, set the orientation of the tabs to vertical, otherwise set the orientation of the tabs to horizontal
          variant={'scrollable'} // set the variant of the tabs to scrollable
          allowScrollButtonsMobile={false} // allow the scroll buttons to be mobile
            sx={{
              width: isMobile ? '100%' : 'auto', // if the screen is mobile, set the width of the tabs to 100%, otherwise set the width of the tabs to auto
              '.MuiTab-root': {
                alignItems: isMobile ? 'flex-start' : 'center', // if the screen is mobile, align the items of the tabs to the start, otherwise align the items of the tabs to the centre
                minHeight: '48px', // set the minimum height of the tabs to 48 units
                px: isMobile ? 2 : '16px' // if the screen is mobile, set the padding of the tabs to 2 units, otherwise set the padding of the tabs to 16 units
              }
            }}
        >
          {availableTabs.map((tab, index) => ( // map over the available tabs
            <Tab key={tab.id} label={tab.label} /> // display the tab with the label of the tab
          ))}
        </Tabs>
      </Box>

        <Box sx={{
          width: '100%', // set the width of the box to 100%, which is the width of the parent element
          p: 3 // set the padding of the box to 3 units, adding space inside the box
        }}
        >
      {selectedTab === 0 && ( // if the selected tab is the performance metrics tab
        <PerformanceMetrics // display the performance metrics component
          metrics={metrics} // set the metrics of the performance metrics to the metrics of the model
          metricDescriptions={metricDescriptions} // set the metric descriptions of the performance metrics to the metric descriptions of the model
          formatMetric={formatMetric} // set the format metric of the performance metrics to the format metric of the model
        />
      )}

      {selectedTab === 1 && modelType === 'decision_tree' && ( // if the selected tab is the model visualisation tab and the model type is decision tree
           (() => { 
             console.log("ModelResults rendering DecisionTreeVisualisation with prop:", visualisation); // log the visualisation of the model
             return (
           <DecisionTreeVisualisation // display the decision tree visualisation component
             visualisation={visualisation} // set the visualisation of the decision tree visualisation to the visualisation of the model
           />
             );
           })()
      )}

      {selectedTab === 2 && ( // if the selected tab is the model insights tab
            <>
          {explanations && ( // if the explanations are available
            <ModelExplanation explanations={explanations} /> // display the model explanation component
          )}
            </>
      )}
        </Box>
      </Box>
    </Box>
  );
};

export default ModelResults; // export the ModelResults component, so it can be used in other components
