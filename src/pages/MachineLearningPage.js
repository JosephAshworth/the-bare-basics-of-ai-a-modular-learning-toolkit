// machine learning page itself, with the components imported

import { 
  useState, 
  useEffect 
} from 'react';

// material ui components
import {
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Alert, 
  Divider, 
  Button 
} from '@mui/material';

// components from the machine learning folder
import HeroSection from '../components/MachineLearning/HeroSection';
import MachineLearningExplanation from '../components/MachineLearning/MachineLearningExplanation';
import DatasetSelection from '../components/MachineLearning/DatasetSelection';
import ModelConfiguration from '../components/MachineLearning/ModelConfiguration';
import ModelResults from '../components/MachineLearning/ModelResults';
import FileUploader from '../components/MachineLearning/FileUploader';
import ModelTrainer from '../components/MachineLearning/ModelTrainer';
import EthicsConsiderations from '../components/MachineLearning/EthicsConsiderations';

// component to complete the module
import CompleteModuleButton from '../components/CommonComponents/CompleteModuleButton';

// hook to track the time spent on the module page
import { useTheme } from '@mui/material/styles';

// context for the progress
import { useProgress } from '../context/ProgressContext';

// hook to track the time spent on the module page
import ModuleTimer from '../hooks/ModuleTimer';

// icon for the launch button
import LaunchIcon from '@mui/icons-material/Launch';

const MachineLearningPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [dataset, setDataset] = useState('iris');
  const [targetFeature, setTargetFeature] = useState('species'); // initialise the target feature to the species feature
  const [targetCorrections, setTargetCorrections] = useState({}); // initialise the target corrections to an empty object, the user updates this as they disregard custom features
  const [selectedFeatures, setSelectedFeatures] = useState([ // initialise the selected features to the iris dataset features
    'sepal length (cm)', 
    'sepal width (cm)', 
    'petal length (cm)', 
    'petal width (cm)'
  ]);
  const [testSize, setTestSize] = useState(0.2);
  const [modelType, setModelType] = useState('decision_tree');
  const [minSamplesSplit, setMinSamplesSplit] = useState(2);
  const [nNeighbors, setNNeighbors] = useState(5);

  const [customData, setCustomData] = useState(null);
  const [features, setFeatures] = useState([]);
  const [error, setError] = useState('');
  const [metrics, setMetrics] = useState(null);
  const [explanations, setExplanations] = useState(null);
  const [visualisation, setVisualisation] = useState(null);

  const [columnsToDiscard, setColumnsToDiscard] = useState([]);
  const [targetWarning, setTargetWarning] = useState('');

  const theme = useTheme();

  const { updateTimeSpent } = useProgress(); // update the time spent on the module page

  const { getTimeChunk } = ModuleTimer('machine-learning'); // retrieve the time spent on the module page

  // when the dataset changes, set the target feature and selected features to the iris dataset features
  useEffect(() => {
    if (dataset === 'iris') {
      setTargetFeature('species');
      setSelectedFeatures(['sepal length (cm)', 'sepal width (cm)', 'petal length (cm)', 'petal width (cm)']);
    } else {
      setTargetFeature('');
      setSelectedFeatures([]);
    }
  }, [dataset]);

  // when the target feature changes, set the target feature and selected features to the iris dataset features
  const handleTargetChange = (event) => {
    const target = event.target.value;
    setTargetFeature(target);
    
    if (customData) {
      const uniqueValues = new Set(customData.map(row => row[target]));
      console.log(`Target feature "${target}" has ${uniqueValues.size} unique values:`, [...uniqueValues]);
      
      if (uniqueValues.size > 5) {
        setError(`Target feature "${target}" has ${uniqueValues.size} unique values. For classification tasks, it should have 5 or fewer unique values.`);
      } else {
        setError('');
      }
    }
  };

  // when the file is loaded, set the custom data and features
  const handleFileLoaded = (data, fileFeatures) => {
    console.log('File loaded with data:', data.length, 'rows');
    console.log('File features:', fileFeatures);
    
    setCustomData(data);
    setFeatures(fileFeatures);
    setColumnsToDiscard([]);
    
    if (fileFeatures && fileFeatures.length > 0) {
      let bestTarget = null; // initialise the best target to null
      let bestTargetUniqueCount = Infinity; // initialise the best target unique count to infinity, so that any feature will be better for prediction
      
      for (const feature of fileFeatures) {
        const uniqueValues = new Set(data.map(row => row[feature])); // get the unique values of the feature
        console.log(`Feature "${feature}" has ${uniqueValues.size} unique values`);
        
        if (uniqueValues.size <= 5 && uniqueValues.size < bestTargetUniqueCount) { // if the feature has 5 or fewer unique values and is less than the best target unique count
          bestTarget = feature;
          bestTargetUniqueCount = uniqueValues.size;
        }
      }
      
      const defaultTarget = bestTarget || fileFeatures[fileFeatures.length - 1]; // if the best target is not found, set the default target to the last feature
      setTargetFeature(defaultTarget);
      
      const uniqueValues = new Set(data.map(row => row[defaultTarget])); // get the unique values of the default target
      if (uniqueValues.size > 5) { // if the default target has more than 5 unique values, set an error
        setError(`Target feature "${defaultTarget}" has ${uniqueValues.size} unique values. For classification tasks, it should have 5 or fewer unique values. Please select a different target feature.`);
      }
      
      console.log('Set default target:', defaultTarget, `(${uniqueValues.size} unique values)`); // log the default target and the number of unique values
    } else {
      setError('');
    }
  };

  // when the file error occurs, set the error
  const handleFileError = (errorMessage) => {
    setError(errorMessage);
  };

  // when the training is complete, set the metrics, explanations and visualisation
  const handleTrainingComplete = (trainingMetrics, trainingExplanations, trainingVisualisation) => {
    console.log("handleTrainingComplete received visualisation:", trainingVisualisation);
    setMetrics(trainingMetrics);
    setExplanations(trainingExplanations);
    setVisualisation(trainingVisualisation);
  };


  // set the training parameters
  const trainingParams = {
    dataset,
    modelType,
    testSize,
    minSamplesSplit,
    nNeighbors,
    customData,
    targetFeature,
    selectedFeatures,
    targetWarning
  };

  // when the dataset changes, set the dataset, metrics, explanations and visualisation to null
  const handleDatasetChange = (newDataset) => {
    setDataset(newDataset);
    setMetrics(null);
    setExplanations(null);
    setVisualisation(null);
    setError('');
  };

  // when the dataset changes, set the columns to discard to an empty array
  useEffect(() => {
    setColumnsToDiscard([]);
  }, [dataset]);

  // when the target warning occurs, set the error
  useEffect(() => {
    if (targetWarning) {
      setError(targetWarning);
    } else {
      if (error === `Target feature "${targetFeature}" has more than 5 unique values. For classification tasks, it should have 5 or fewer unique values.` || 
          (error && error.startsWith('Target feature') && error.includes('unique values'))) {
        setError('');
      }      
    }
  }, [targetWarning, error, targetFeature]);

  // when the component unmounts, send the time spent on the module page to the backend
  useEffect(() => {
    return () => {
      const secondsChunk = getTimeChunk ? getTimeChunk() : 0;
      if (secondsChunk > 0) {
        console.log(`MachineLearningPage unmounting, sending ${secondsChunk}s time chunk.`);
        updateTimeSpent('machine-learning', secondsChunk);
      } else {
        console.log("MachineLearningPage unmounting, no final time chunk to send.");
      }
    };
  }, [updateTimeSpent, getTimeChunk]);

  // when the dataset changes, set the selected features
  useEffect(() => {
    if (dataset === 'iris') {
      setSelectedFeatures(['sepal length (cm)', 'sepal width (cm)', 'petal length (cm)', 'petal width (cm)']);
    } else if (dataset === 'custom' && features && features.length > 0) {
      const availableForSelection = features.filter(f =>  // filter the features
        f !== targetFeature && // only include features that are not the target feature
        !columnsToDiscard.includes(f) // and not in the columns to discard
      );
      setSelectedFeatures(availableForSelection); // set the selected features to the available features
      console.log('Updated selectedFeatures:', availableForSelection); // log the updated selected features
    } else {
      setSelectedFeatures([]); // set the selected features to an empty array
    }
  }, [dataset, features, targetFeature, columnsToDiscard]);

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      bgcolor: theme.palette.background.default
    }}>

      <HeroSection />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <MachineLearningExplanation />
      </Container>

      <Typography
        variant="h1"
        sx={{ 
          fontWeight: 600,
          color: theme.palette.text.primary,
          textAlign: 'center',
          mb: 2
        }}>
        Have a go at training your own models below
      </Typography>

      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>Dataset</Typography>
              <Paper sx={{ p: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: '16px', backgroundColor: theme.palette.background.paper }}>
                
                {/* the dataset selection component, with the values and functions passed in as props */}
                <DatasetSelection
                  dataset={dataset}
                  setDataset={handleDatasetChange}
                  customData={customData}
                  features={features}
                  targetFeature={targetFeature}
                  handleTargetChange={handleTargetChange}
                  handleFileUpload={<FileUploader 
                    onFileLoaded={handleFileLoaded} 
                    onError={handleFileError} 
                  />}
                  columnsToDiscard={columnsToDiscard}
                  setColumnsToDiscard={setColumnsToDiscard}
                  targetWarning={targetWarning}
                  setTargetWarning={setTargetWarning}
                  targetCorrections={targetCorrections}
                  setTargetCorrections={setTargetCorrections}
                />
              </Paper>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>Configuration & Training</Typography>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              {/* the model configuration component, with the values and functions passed in as props */}
              <ModelConfiguration
                dataset={dataset}
                targetFeature={targetFeature}
                features={features}
                modelType={modelType}
                testSize={testSize}
                minSamplesSplit={minSamplesSplit}
                nNeighbors={nNeighbors}
                onModelTypeChange={(e) => setModelType(e.target.value)}
                onTestSizeChange={(e, newValue) => setTestSize(newValue)}
                onMinSamplesSplitChange={(e) => setMinSamplesSplit(parseInt(e.target.value, 10) || 0)}
                onNNeighborsChange={(e) => setNNeighbors(parseInt(e.target.value, 10) || 1)}
              />
              <Divider sx={{ my: 3 }} />

              {/* the model trainer component, with the values and functions passed in as props */}
              <ModelTrainer
                trainingParams={trainingParams}
                onTrainingComplete={handleTrainingComplete}
                targetCorrections={targetCorrections}
                targetFeature={targetFeature}
              />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              {/* the model results component, with the values and functions passed in as props */}
              <ModelResults 
                metrics={metrics}
                explanations={explanations}
                visualisation={visualisation}
                selectedTab={selectedTab}
                handleTabChange={(event, newValue) => setSelectedTab(newValue)}
                modelType={modelType}
              />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <EthicsConsiderations />
          </Grid>

        </Grid>

        <Box
          sx={{ 
            display: 'flex',
            justifyContent: 'center',
            mt: 4,
            mb: 3
          }}> 
          <Button
            variant="contained"
            color="primary"
            href="https://docs.google.com/forms/d/e/1FAIpQLSe5X2tTM5V8dzo2ecBQ0HOoWknz2P4PFHkE-srL3gh5GFymGQ/viewform?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<LaunchIcon />}
            sx={{ 
              textTransform: 'none',
              fontSize: '1rem',
              py: 1.5,
              px: 3
            }}
          >
            Take End of Module Quiz
          </Button>
        </Box>

        <Box mt={2} mb={4}>
          <CompleteModuleButton 
            moduleId="machine-learning"
            moduleName="Machine Learning"
          />
        </Box>

      </Container>
    </Box>
  );
};

export default MachineLearningPage;