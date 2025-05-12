import { Typography, Tooltip } from '@mui/material'; // import Typography and Tooltip from @mui/material

import InfoIcon from '@mui/icons-material/Info'; // import InfoIcon from @mui/icons-material


export const formatMetric = (value) => { // function to format a metric value as a percentage with 2 decimal places
  if (value === undefined || value === null) { // if the value is undefined or null, log the invalid metric value and return 'N/A'
    console.log('Invalid metric value:', value);
    return 'N/A';
  }
  return (value * 100).toFixed(2) + '%'; // return the value as a percentage with 2 decimal places
};


export const metricDescriptions = { // object to store the descriptions of the metrics
  accuracy: "Question: How often is my model correct overall?\n\nAccuracy measures how often the model gets it right. If the model predicts 90 out of 100 samples correctly, the accuracy is 90%. Note that accuracy can be misleading if the classes are imbalanced.",
  precision: "Question: When my model predicts a positive result, how often is it actually correct?\n\nPrecision tells you when the model says 'yes', how often it's actually right. High precision means fewer false alarms.",
  recall: "Question: How good is my model at finding all the positive cases?\n\nRecall measures how well the model catches all the positive cases. High recall means it doesn't miss many.",
  f1: "Question: How well does my model balance finding positives and avoiding false alarms?\n\nF1 Score combines precision and recall into a single number. It's useful when you need the model to be good at both not giving false alarms AND not missing positive cases."
};


const MetricsFormatter = ({ metricName, value }) => { // function to display a metric with its value and a tooltip explanation
  const formattedValue = formatMetric(value); // format the value
  const description = metricDescriptions[metricName.toLowerCase()] || ''; // get the description of the metric

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}> {/* display the metric name and value in a flex container */}
      <Typography variant="body1">{metricName}: {formattedValue}</Typography> {/* display the metric name and value */}
      {description && (
        <Tooltip title={description} arrow placement="top"> {/* display the tooltip explanation */}
          <InfoIcon fontSize="small" color="primary" style={{ marginLeft: 8 }} /> {/* display the info icon */}
        </Tooltip>
      )}
    </div>
  );
};

export default MetricsFormatter; // export the MetricsFormatter component as the default export, this allows the component to be used in other files
