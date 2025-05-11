import
  { useState, // import useState, this is used to manage the state of the component
    useEffect // import useEffect, this is used to manage the side effects of the component
  }
from 'react';

import {
  Box, // import Box from MUI
  Container, // import Container from MUI
  Typography, // import Typography from MUI
  Grid, // import Grid from MUI
  Paper, // import Paper from MUI
  Alert, // import Alert from MUI
  Divider, // import Divider from MUI
  Button // import Button from MUI
} from '@mui/material';

import HeroSection from '../components/MachineLearning/HeroSection'; // import HeroSection from MachineLearningSection, which is a separate component
import MachineLearningExplanation from '../components/MachineLearning/MachineLearningExplanation'; // import MachineLearningExplanation from MachineLearningSection, which is a separate component
import DatasetSelection from '../components/MachineLearning/DatasetSelection'; // import DatasetSelection from MachineLearningSection, which is a separate component
import ModelConfiguration from '../components/MachineLearning/ModelConfiguration'; // import ModelConfiguration from MachineLearningSection, which is a separate component
import ModelResults from '../components/MachineLearning/ModelResults'; // import ModelResults from MachineLearningSection, which is a separate component
import FileUploader from '../components/MachineLearning/FileUploader'; // import FileUploader from MachineLearningSection, which is a separate component
import ModelTrainer from '../components/MachineLearning/ModelTrainer'; // import ModelTrainer from MachineLearningSection, which is a separate component
import CompleteModuleButton from '../components/ModuleProgress/CompleteModuleButton'; // import CompleteModuleButton from ModuleProgressSection, which is a separate component
import EthicsConsiderations from '../components/MachineLearning/EthicsConsiderations'; // import EthicsConsiderations from MachineLearningSection, which is a separate component

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on dark or light mode
import { useProgress } from '../context/ProgressContext'; // import useProgress, this is used to access the progress context, which is used to track the progress of the user

import useModuleTimer from '../hooks/useModuleTimer'; // import useModuleTimer, this is used to track the time spent on the page
import LaunchIcon from '@mui/icons-material/Launch'; // import LaunchIcon from MUI, this is used to display a launch icon

const MachineLearningPage = () => {
  const [selectedTab, setSelectedTab] = useState(0); // state variable for the selected tab
  const [dataset, setDataset] = useState('iris'); // state variable for the dataset
  const [targetFeature, setTargetFeature] = useState('species'); // state variable for the target feature
  const [targetCorrections, setTargetCorrections] = useState({}); // state variable for the target corrections
  const [selectedFeatures, setSelectedFeatures] = useState([
    'sepal length (cm)', 
    'sepal width (cm)', 
    'petal length (cm)', 
    'petal width (cm)'
  ]); // state variable for the selected features (default is the iris dataset)
  const [testSize, setTestSize] = useState(0.2); // state variable for the test size
  const [modelType, setModelType] = useState('decision_tree'); // state variable for the model type
  const [minSamplesSplit, setMinSamplesSplit] = useState(2); // state variable for the minimum samples split
  const [nNeighbors, setNNeighbors] = useState(5); // state variable for the number of neighbours

  const [customData, setCustomData] = useState(null); // state variable for the custom data
  const [features, setFeatures] = useState([]); // state variable for the features
  const [error, setError] = useState(''); // state variable for the error
  const [metrics, setMetrics] = useState(null); // state variable for the metrics
  const [explanations, setExplanations] = useState(null); // state variable for the explanations
  const [visualisation, setVisualisation] = useState(null); // state variable for the visualisation

  const [columnsToDiscard, setColumnsToDiscard] = useState([]); // state variable for the columns to discard
  const [targetWarning, setTargetWarning] = useState(''); // state variable for the target warning

  const theme = useTheme(); // for getting the MUI theme object

  const { updateTimeSpent } = useProgress(); // for updating the time spent on the page

  const { getTimeChunk } = useModuleTimer('machine-learning'); // for getting the time spent on the page

  useEffect(() => {
    if (dataset === 'iris') { // if the dataset is iris
      setTargetFeature('species'); // set the target feature to species
      setSelectedFeatures(['sepal length (cm)', 'sepal width (cm)', 'petal length (cm)', 'petal width (cm)']); // set the selected features to the iris dataset
    } else {
      setTargetFeature(''); // set the target feature to an empty string
      setSelectedFeatures([]); // set the selected features to an empty array
    }
  }, [dataset]);

  const handleTargetChange = (event) => {
    const target = event.target.value; // get the target from the event
    setTargetFeature(target); // set the target feature to the target
    
    if (customData) { // if the custom data is not null
      const uniqueValues = new Set(customData.map(row => row[target])); // get the unique values from the custom data
      console.log(`Target feature "${target}" has ${uniqueValues.size} unique values:`, [...uniqueValues]); // log the unique values
      
      if (uniqueValues.size > 5) { // if the unique values are greater than 5
        setError(`Target feature "${target}" has ${uniqueValues.size} unique values. For classification tasks, it should have 5 or fewer unique values.`); // set the error to the target feature has more than 5 unique values
      } else { // if the unique values are not greater than 5
        setError(''); // set the error to an empty string
      }
    }
  };

  const handleFileLoaded = (data, fileFeatures) => {
    console.log('File loaded with data:', data.length, 'rows'); // log the file loaded with data
    console.log('File features:', fileFeatures); // log the file features
    
    setCustomData(data); // set the custom data to the data
    setFeatures(fileFeatures); // set the features to the file features
    setColumnsToDiscard([]); // set the columns to discard to an empty array
    
    if (fileFeatures && fileFeatures.length > 0) { // if the file features are not null and the length is greater than 0
      let bestTarget = null; // let the best target be null
      let bestTargetUniqueCount = Infinity; // let the best target unique count be infinity
      
      for (const feature of fileFeatures) { // for each feature in the file features
        const uniqueValues = new Set(data.map(row => row[feature])); // get the unique values from the data
        console.log(`Feature "${feature}" has ${uniqueValues.size} unique values`); // log the feature and the unique values
        
        if (uniqueValues.size <= 5 && uniqueValues.size < bestTargetUniqueCount) { // if the unique values are less than or equal to 5 and the unique values are less than the best target unique count
          bestTarget = feature; // set the best target to the feature
          bestTargetUniqueCount = uniqueValues.size; // set the best target unique count to the unique values
        }
      }
      
      const defaultTarget = bestTarget || fileFeatures[fileFeatures.length - 1]; // set the default target to the best target or the last feature in the file features
      setTargetFeature(defaultTarget); // set the target feature to the default target
      
      const uniqueValues = new Set(data.map(row => row[defaultTarget])); // get the unique values from the data
      if (uniqueValues.size > 5) { // if the unique values are greater than 5
        setError(`Target feature "${defaultTarget}" has ${uniqueValues.size} unique values. For classification tasks, it should have 5 or fewer unique values. Please select a different target feature.`); // set the error to the target feature has more than 5 unique values
      }
      
      console.log('Set default target:', defaultTarget, `(${uniqueValues.size} unique values)`); // log the default target and the unique values
    } else {
      setError(''); // set the error to an empty string
    }
  };

  const handleFileError = (errorMessage) => {
    setError(errorMessage); // set the error to the error message
  };

  const handleTrainingComplete = (trainingMetrics, trainingExplanations, trainingVisualisation) => {
    console.log("handleTrainingComplete received visualisation:", trainingVisualisation); // log the training complete received visualisation
    setMetrics(trainingMetrics); // set the metrics to the training metrics
    setExplanations(trainingExplanations); // set the explanations to the training explanations
    setVisualisation(trainingVisualisation); // set the visualisation to the training visualisation
  };

  const handleTrainingError = (errorMessage) => {
    setError(errorMessage); // set the error to the error message
  };

  const handleTrainingStart = () => {
    setError(''); // set the error to an empty string
    setMetrics(null); // set the metrics to null
    setExplanations(null); // set the explanations to null
    setVisualisation(null); // set the visualisation to null
  };

  const trainingParams = {
    dataset, // set the dataset to the dataset
    modelType, // set the model type to the model type
    testSize, // set the test size to the test size
    minSamplesSplit, // set the min samples split to the min samples split
    nNeighbors, // set the n neighbours to the n neighbours
    customData, // set the custom data to the custom data
    targetFeature, // set the target feature to the target feature
    selectedFeatures, // set the selected features to the selected features
    targetWarning: targetWarning // set the target warning to the target warning
  };

  const handleDatasetChange = (newDataset) => {
    setDataset(newDataset); // set the dataset to the new dataset
    setMetrics(null); // set the metrics to null
    setExplanations(null); // set the explanations to null
    setVisualisation(null); // set the visualisation to null
    setError(''); // set the error to an empty string
  };

  useEffect(() => {
    setColumnsToDiscard([]); // set the columns to discard to an empty array
  }, [dataset]);

  useEffect(() => {
    if (targetWarning) { // if the target warning is set
      setError(targetWarning); // set the error to the target warning
    } else { // if the target warning is not set
      if (error === `Target feature "${targetFeature}" has more than 5 unique values. For classification tasks, it should have 5 or fewer unique values.` || 
          (error && error.startsWith('Target feature') && error.includes('unique values'))) { // if the error is the target feature has more than 5 unique values or the error starts with Target feature and includes unique values
        setError(''); // set the error to an empty string
      }      
    }
  }, [targetWarning, error, targetFeature]); // use the target warning, error and target feature as dependencies

  useEffect(() => {
    return () => {
      const secondsChunk = getTimeChunk ? getTimeChunk() : 0; // for getting the time chunk (the time spent on the module)
      if (secondsChunk > 0) { // if the time chunk is greater than 0
        console.log(`MachineLearningPage unmounting, sending ${secondsChunk}s time chunk.`); // log the time chunk
        updateTimeSpent('machine-learning', secondsChunk); // update the time spent
      } else { // if the time chunk is not greater than 0
        console.log("MachineLearningPage unmounting, no final time chunk to send."); // log the time chunk
      }
    };
  }, [updateTimeSpent, getTimeChunk]); // use the updateTimeSpent and getTimeChunk as dependencies

  useEffect(() => {
    if (dataset === 'iris') { // if the dataset is iris
      setSelectedFeatures(['sepal length (cm)', 'sepal width (cm)', 'petal length (cm)', 'petal width (cm)']); // set the selected features to the iris dataset
    } else if (dataset === 'custom' && features && features.length > 0) { // if the dataset is custom and the features are not null and the length is greater than 0
      const availableForSelection = features.filter(f => 
        f !== targetFeature && 
        !columnsToDiscard.includes(f)
      ); // filter the features to remove the target feature and the columns to discard
      setSelectedFeatures(availableForSelection); // set the selected features to the available for selection
      console.log('Updated selectedFeatures:', availableForSelection); // log the updated selected features
    } else { // if the dataset is not custom or the features are null or the length is not greater than 0
      setSelectedFeatures([]); // set the selected features to an empty array
    }
  }, [dataset, features, targetFeature, columnsToDiscard]); // use the dataset, features, target feature and columns to discard as dependencies

  return (
    <Box sx={{ 
      display: 'flex', // display the box as a flex container
      flexDirection: 'column', // display the box as a column
      minHeight: '100vh', // set the minimum height of the box to full viewport height
      bgcolor: theme.palette.background.default // set the background colour of the box to the default colour, based on the theme
    }}>

      <HeroSection /> {/* display the HeroSection component */}

      <Container maxWidth="lg" sx={{ py: 4 }}> {/* set the maximum width of the container to lg, and the padding top to 4, adding space above the container */}
        <MachineLearningExplanation /> {/* display the MachineLearningExplanation component */}
      </Container>

      <Typography
        variant="h1"
        sx={{ 
          fontWeight: 600, // set the font weight to 600
          color: theme.palette.text.primary, // set the colour to the primary colour
          textAlign: 'center', // set the text alignment to centre
          mb: 2 // set the margin bottom to 2, adding space below the text
        }}>
        Have a go at training your own models below
      </Typography>

      <Container maxWidth="xl"> {/* set the maximum width of the container to xl */}
        <Grid container spacing={3}> {/* sets the container to a grid container with a spacing of 3 */}
          <Grid item xs={12}> {/* sets the grid item to occupy all 12 columns on extra-small screens and up, making it full width */}
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}> {/* sets the paper to have a paper elevation of 3, padding of 3, and a height of 100% */}
              <Typography variant="h6" gutterBottom>Dataset</Typography> {/* set the typography to have a variant of h6, and a gutter bottom */}
              <Paper sx={{ p: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: '16px', backgroundColor: theme.palette.background.paper }}> {/* set the paper to have a padding of 3, a border of 1px solid the divider colour, a border radius of 16px, and a background colour of the paper colour */}
                <DatasetSelection
                  dataset={dataset} // set the dataset to the dataset
                  setDataset={handleDatasetChange} // set the dataset to the handle dataset change
                  customData={customData} // set the custom data to the custom data
                  features={features} // set the features to the features
                  targetFeature={targetFeature} // set the target feature to the target feature
                  handleTargetChange={handleTargetChange} // set the handle target change to the handle target change
                  handleFileUpload={<FileUploader 
                    onFileLoaded={handleFileLoaded} 
                    onError={handleFileError} 
                  />} // set the handle file upload to the file uploader
                  columnsToDiscard={columnsToDiscard} // set the columns to discard to the columns to discard
                  setColumnsToDiscard={setColumnsToDiscard} // set the set columns to discard to the set columns to discard
                  targetWarning={targetWarning} // set the target warning to the target warning
                  setTargetWarning={setTargetWarning} // set the set target warning to the set target warning
                  targetCorrections={targetCorrections} // set the target corrections to the target corrections
                  setTargetCorrections={setTargetCorrections} // set the set target corrections to the set target corrections
                />
              </Paper>
            </Paper>
          </Grid>

          <Grid item xs={12}> {/* sets the grid item to occupy all 12 columns on extra-small screens and up, making it full width */}
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}> {/* sets the paper to have a paper elevation of 3, padding of 3, and a height of 100% */}
              <Typography variant="h6" gutterBottom>Configuration & Training</Typography> {/* sets the typography to have a variant of h6, and a gutter bottom */}  
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>} {/* if the error is set, set the alert to have a severity of error, and a margin bottom of 2 */}
              <ModelConfiguration
                dataset={dataset} // set the dataset to the dataset
                targetFeature={targetFeature} // set the target feature to the target feature
                features={features} // set the features to the features
                modelType={modelType} // set the model type to the model type
                testSize={testSize} // set the test size to the test size
                minSamplesSplit={minSamplesSplit} // set the min samples split to the min samples split
                nNeighbors={nNeighbors} // set the n neighbours to the n neighbours
                onModelTypeChange={(e) => setModelType(e.target.value)} // set the on model type change to the model type
                onTestSizeChange={(e, newValue) => setTestSize(newValue)} // set the on test size change to the test size
                onMinSamplesSplitChange={(e) => setMinSamplesSplit(parseInt(e.target.value, 10) || 0)} // set the on min samples split change to the min samples split
                onNNeighborsChange={(e) => setNNeighbors(parseInt(e.target.value, 10) || 1)} // set the on n neighbours change to the n neighbours
              />
              <Divider sx={{ my: 3 }} /> {/* sets the divider to have a margin top and bottom of 3 */}
              <ModelTrainer
                trainingParams={trainingParams} // set the training params to the training params
                onTrainingComplete={handleTrainingComplete} // set the on training complete to the handle training complete
                onTrainingError={handleTrainingError} // set the on training error to the handle training error
                onTrainingStart={handleTrainingStart} // set the on training start to the handle training start
                targetCorrections={targetCorrections} // set the target corrections to the target corrections
                targetFeature={targetFeature} // set the target feature to the target feature
              />
            </Paper>
          </Grid>

          <Grid item xs={12}> {/* sets the grid item to occupy all 12 columns on extra-small screens and up, making it full width */}
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}> {/* sets the paper to have a paper elevation of 3, padding of 3, and a height of 100% */}
              <ModelResults 
                metrics={metrics} // set the metrics to the metrics
                explanations={explanations} // set the explanations to the explanations
                visualisation={visualisation} // set the visualisation to the visualisation
                selectedTab={selectedTab} // set the selected tab to the selected tab
                handleTabChange={(event, newValue) => setSelectedTab(newValue)} // set the handle tab change to the selected tab
                modelType={modelType} // set the model type to the model type
              />
            </Paper>
          </Grid>

          <Grid item xs={12}> {/* sets the grid item to occupy all 12 columns on extra-small screens and up, making it full width */}
            <EthicsConsiderations /> {/* display the EthicsConsiderations component */}
          </Grid>

        </Grid>

        <Box
          sx={{ 
            display: 'flex', // display the box as a flex container
            justifyContent: 'center', // justify the content to the centre
            mt: 4, // set the margin top to 4, adding space above the box
            mb: 3 // set the margin bottom to 3, adding space below the box
          }}> 
          <Button
            variant="contained" // set the variant to contained, creating a button with a solid background colour
            color="primary" // set the colour to primary
            href="https://docs.google.com/forms/d/e/1FAIpQLSe5X2tTM5V8dzo2ecBQ0HOoWknz2P4PFHkE-srL3gh5GFymGQ/viewform?usp=sharing" // set the href to the form, which opens in a new tab
            target="_blank" // set the target to blank, opening the link in a new tab
            rel="noopener noreferrer" // set the rel to noopener noreferrer, which helps prevent the new page from accessing the window.opener property
            startIcon={<LaunchIcon />} // set the start icon to the launch icon, which is a small icon that appears before the text
            sx={{ 
              textTransform: 'none', // set the text transform to none, which prevents the text from being converted to uppercase
              fontSize: '1rem', // set the font size to 1rem
              py: 1.5, // set the padding top and bottom to 1.5, adding space above and below the button
              px: 3 // set the padding left and right to 3, adding space to the left and right of the button
            }}
          >
            Take End of Module Quiz
          </Button>
        </Box>

        <Box mt={2} mb={4}> {/* sets the margin top to 2, adding space above the box, and the margin bottom to 4, adding space below the box */}
          <CompleteModuleButton 
            moduleId="machine-learning" // set the module id to machine-learning
            moduleName="Machine Learning" // set the module name to Machine Learning
          />
        </Box>

      </Container>
    </Box>
  );
};

export default MachineLearningPage; // export the MachineLearningPage component, allowing it to be used in other files
