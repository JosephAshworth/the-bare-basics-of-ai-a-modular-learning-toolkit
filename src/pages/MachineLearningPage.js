import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Alert,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MLHeroSection from '../components/MachineLearning/MLHeroSection';
import DatasetSelection from '../components/MachineLearning/DatasetSelection';
import ModelConfiguration from '../components/MachineLearning/ModelConfiguration';
import ModelResults from '../components/MachineLearning/ModelResults';
import FileUploader from '../components/MachineLearning/FileUploader';
import ModelTrainer from '../components/MachineLearning/ModelTrainer';
import ProgressTracker from '../components/ModuleProgress/ProgressTracker';
import { useThemeContext } from '../context/ThemeContext';
import useModuleTimer from '../hooks/useModuleTimer';

// Predefined iris dataset features
const IRIS_FEATURES = ['sepal length (cm)', 'sepal width (cm)', 'petal length (cm)', 'petal width (cm)', 'species'];

const MachineLearningPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [dataset, setDataset] = useState('iris');
  const [targetFeature, setTargetFeature] = useState('species');
  const [selectedFeatures, setSelectedFeatures] = useState([
    'sepal length (cm)', 
    'sepal width (cm)', 
    'petal length (cm)', 
    'petal width (cm)'
  ]);
  const [testSize, setTestSize] = useState(0.2);
  const [modelType, setModelType] = useState('decision_tree');
  const [minSamplesSplit, setMinSamplesSplit] = useState(2);
  const [nNeighbors, setNNeighbors] = useState(5);
  const navigate = useNavigate();

  // State that was previously in hooks
  const [customData, setCustomData] = useState(null);
  const [features, setFeatures] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPDP, setLoadingPDP] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [explanations, setExplanations] = useState(null);
  const [visualization, setVisualization] = useState(null);

  // State for columns to discard from dataset
  const [columnsToDiscard, setColumnsToDiscard] = useState([]);
  const [fileUploaderRef, setFileUploaderRef] = useState(null);

  // Track time spent on this module
  useModuleTimer('machine-learning');

  // Update features when dataset changes
  useEffect(() => {
    if (dataset === 'iris') {
      // Set default values for iris dataset
      setTargetFeature('species');
      setSelectedFeatures(['sepal length (cm)', 'sepal width (cm)', 'petal length (cm)', 'petal width (cm)']);
    } else {
      // Reset for custom dataset
      setTargetFeature('');
      setSelectedFeatures([]);
    }
  }, [dataset]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Handle model type change
  const handleModelTypeChange = (event) => {
    const newModelType = typeof event === 'string' ? event : event.target.value;
    setModelType(newModelType);
    
    // If switching from decision tree to knn and visualization tab is selected,
    // switch to the "Performance Metrics" tab
    if (newModelType !== 'decision_tree' && selectedTab === 1) {
      setSelectedTab(0);
    }
  };

  // Handle target feature change
  const handleTargetChange = (event) => {
    const target = event.target.value;
    setTargetFeature(target);
    
    // Remove target feature from selected features
    setSelectedFeatures(prev => prev.filter(f => f !== target));
    
    if (customData) {
    // Check unique values in target feature
    const uniqueValues = new Set(customData.map(row => row[target]));
      console.log(`Target feature "${target}" has ${uniqueValues.size} unique values:`, [...uniqueValues]);
      
      if (uniqueValues.size > 5) {
        setError(`Target feature "${target}" has ${uniqueValues.size} unique values. For classification tasks, it should have 5 or fewer unique values.`);
    } else {
      setError('');
      }
    }
  };

  // Handle feature toggle
  const handleFeatureToggle = (feature) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  // Handle file upload
  const handleFileLoaded = (data, fileFeatures) => {
    console.log('File loaded with data:', data.length, 'rows');
    console.log('File features:', fileFeatures);
    
    setCustomData(data);
    setFeatures(fileFeatures);
    
    // Set default target feature (first feature) and select all other features
    if (fileFeatures && fileFeatures.length > 0) {
      // Try to find a suitable target feature with 5 or fewer unique values
      let bestTarget = null;
      let bestTargetUniqueCount = Infinity;
      
      // Check each feature for unique value counts
      for (const feature of fileFeatures) {
        const uniqueValues = new Set(data.map(row => row[feature]));
        console.log(`Feature "${feature}" has ${uniqueValues.size} unique values`);
        
        // If this feature has 5 or fewer unique values and fewer than our current best, use it
        if (uniqueValues.size <= 5 && uniqueValues.size < bestTargetUniqueCount) {
          bestTarget = feature;
          bestTargetUniqueCount = uniqueValues.size;
        }
      }
      
      // If no suitable target was found, use the last feature but show a warning
      const defaultTarget = bestTarget || fileFeatures[fileFeatures.length - 1];
      setTargetFeature(defaultTarget);
      
      // Check the selected target's unique values
      const uniqueValues = new Set(data.map(row => row[defaultTarget]));
      if (uniqueValues.size > 5) {
        setError(`Target feature "${defaultTarget}" has ${uniqueValues.size} unique values. For classification tasks, it should have 5 or fewer unique values. Please select a different target feature.`);
      }
      
      // Select all features except the target
      const defaultSelectedFeatures = fileFeatures.filter(f => f !== defaultTarget);
      setSelectedFeatures(defaultSelectedFeatures);
      
      console.log('Set default target:', defaultTarget, `(${uniqueValues.size} unique values)`);
      console.log('Set default selected features:', defaultSelectedFeatures);
      } else {
      setError('');
    }
  };

  // Handle file error
  const handleFileError = (errorMessage) => {
    setError(errorMessage);
  };

  // Handle model training completion
  const handleTrainingComplete = (trainingMetrics, trainingExplanations, trainingVisualization) => {
    setMetrics(trainingMetrics);
    setExplanations(trainingExplanations);
    setVisualization(trainingVisualization);
    setLoading(false);
    setLoadingPDP(false);
  };

  // Handle training error
  const handleTrainingError = (errorMessage) => {
    setError(errorMessage);
    setLoading(false);
    setLoadingPDP(false);
  };

  // Handle training start
  const handleTrainingStart = () => {
    setLoading(true);
    setLoadingPDP(true);
    setError('');
    setMetrics(null);
    setExplanations(null);
    setVisualization(null);
  };

  // Prepare training parameters
  const trainingParams = {
    dataset,
    modelType,
    testSize,
    minSamplesSplit,
    nNeighbors,
    customData,
    targetFeature,
    selectedFeatures,
  };

  // Handle dataset change
  const handleDatasetChange = (newDataset) => {
    setDataset(newDataset);
    // Reset model results when dataset changes
    setMetrics(null);
    setExplanations(null);
    setVisualization(null);
    setError('');
  };

  // Handle discarding columns
  const handleReprocessData = () => {
    // Use the exposed reprocessFile method on the window
    if (typeof window !== 'undefined' && window.reprocessCurrentFile) {
      window.reprocessCurrentFile();
    }
  };

  // Reset columns to discard when dataset changes
  useEffect(() => {
    setColumnsToDiscard([]);
  }, [dataset]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <MLHeroSection />

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Controls Panel */}
          <Grid item xs={12}>
            <DatasetSelection 
              dataset={dataset}
              setDataset={handleDatasetChange}
              customData={customData}
              features={features}
              targetFeature={targetFeature}
              handleTargetChange={handleTargetChange}
              selectedFeatures={selectedFeatures}
              handleFeatureToggle={handleFeatureToggle}
              columnsToDiscard={columnsToDiscard}
              setColumnsToDiscard={setColumnsToDiscard}
              handleFileUpload={(
                <FileUploader 
                  onFileLoaded={handleFileLoaded}
                  onError={handleFileError}
                  columnsToDiscard={columnsToDiscard}
                  ref={ref => setFileUploaderRef(ref)}
                />
              )}
              modelType={modelType}
            />
            
            <Paper sx={{ 
              p: 3, 
              mb: 4,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              border: '1px solid rgba(25, 118, 210, 0.1)',
              borderRadius: '16px'
            }}>
              <ModelConfiguration 
                modelType={modelType}
                setModelType={handleModelTypeChange}
                testSize={testSize}
                setTestSize={setTestSize}
                minSamplesSplit={minSamplesSplit}
                setMinSamplesSplit={setMinSamplesSplit}
                nNeighbors={nNeighbors}
                setNNeighbors={setNNeighbors}
                handleTrainModel={(
                  <ModelTrainer 
                    trainingParams={trainingParams}
                    onTrainingComplete={handleTrainingComplete}
                    onTrainingError={handleTrainingError}
                    onTrainingStart={handleTrainingStart}
                  />
                )}
                loading={loading}
              />
            </Paper>
          </Grid>

          {/* Visualization and Metrics Panel */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Model Results
              </Typography>
              
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              
              {metrics && metrics.train && metrics.test && (
                <ModelResults 
                  metrics={metrics}
                  selectedTab={selectedTab}
                  handleTabChange={handleTabChange}
                  modelType={modelType}
                  visualization={visualization}
                  loading={loading}
                  explanations={explanations}
                  loadingPDP={loadingPDP}
                />
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Module completion button */}
        <ProgressTracker 
          moduleId="machine-learning" 
          moduleName="Machine Learning" 
        />
      </Container>
    </div>
  );
};

export default MachineLearningPage; 