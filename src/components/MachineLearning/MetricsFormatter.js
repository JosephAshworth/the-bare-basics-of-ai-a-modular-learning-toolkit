import React from 'react';
import { Typography, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

/**
 * Formats a metric value as a percentage with 2 decimal places
 * 
 * @param {number} value - The metric value (between 0 and 1)
 * @returns {string} Formatted percentage string
 */
export const formatMetric = (value) => {
  if (value === undefined || value === null) {
    console.log('Invalid metric value:', value);
    return 'N/A';
  }
  return (value * 100).toFixed(2) + '%';
};

/**
 * Descriptions of common machine learning metrics for beginner-friendly explanations
 */
export const metricDescriptions = {
  accuracy: "Question: How often is my model correct overall?\n\nAccuracy measures how often the model gets it right. If the model predicts 90 out of 100 samples correctly, the accuracy is 90%. Think of it like a student's overall test score.",
  precision: "Question: When my model predicts a positive result, how often is it actually correct?\n\nPrecision tells you when the model says 'yes', how often it's actually right. High precision means fewer false alarms. Like a spam filter that rarely puts real emails in the spam folder.",
  recall: "Question: How good is my model at finding all the positive cases?\n\nRecall measures how well the model catches all the positive cases. High recall means it doesn't miss many. Like a fishing net that catches almost all the fish you're looking for.",
  f1: "Question: How well does my model balance finding positives and avoiding false alarms?\n\nF1 Score combines precision and recall into a single number. It's useful when you need the model to be good at both not giving false alarms AND not missing positive cases. Like a student who's good at both math and language arts."
};

/**
 * Component for displaying a metric with its value and a tooltip explanation
 */
const MetricsFormatter = ({ metricName, value }) => {
  const formattedValue = formatMetric(value);
  const description = metricDescriptions[metricName.toLowerCase()] || '';

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Typography variant="body1">{metricName}: {formattedValue}</Typography>
      {description && (
        <Tooltip title={description} arrow placement="top">
          <InfoIcon fontSize="small" color="primary" style={{ marginLeft: 8 }} />
        </Tooltip>
      )}
    </div>
  );
};

export default MetricsFormatter; 