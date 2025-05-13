// the drop-downs for the theory explanation at the top

// material ui components
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
} from '@mui/material';

import { useTheme } from '@mui/material/styles';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const MachineLearningExplanation = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: '16px',
        width: '100%',
        margin: '0 auto 40px auto',
        backgroundColor: theme.palette.background.paper,
        overflow: 'hidden',
      }}
    >
      <Accordion 
        sx={{ 
          backgroundColor: isDarkMode ? theme.palette.primary.dark + '30' : theme.palette.primary.light + '40',
          border: `1px solid ${theme.palette.primary.main}`,
          borderRadius: '16px',
          boxShadow: 'none',
          '&.MuiAccordion-root:before': {
            display: 'none',
          },
          mb: 2
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="what-is-ml-content"
          id="what-is-ml-header"
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary
            }}
          >
            What is Machine Learning?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • Machine Learning is a field of AI that makes computers learn from data and make decisions or predictions without being programmed.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • It learns from data (such as historical events or past decisions) and improves with time without any human operation.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • It is especially useful in recommendation systems, speech recognition and self-driving cars. Machine Learning is applied extensively within these fields.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • Machine Learning can further be classified into Supervised (where the model is trained on a labeled data set), Unsupervised (where the model is trained on an unlabeled data set) and Reinforcement Learning (where the model is trained to make decisions on the basis of feedback). Here, we will be performing Supervised Learning.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • While there are many machine learning models, this example will focus on Decision Trees and K-Nearest Neighbours, as these are often the easiest for beginners to understand.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion 
        sx={{ 
          backgroundColor: isDarkMode ? theme.palette.success.dark + '30' : theme.palette.success.light + '40',
          border: `1px solid ${theme.palette.success.main}`,
          borderRadius: '16px',
          boxShadow: 'none',
          '&.MuiAccordion-root:before': {
            display: 'none',
          },
          mb: 2,
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="data-cleaning-content"
          id="data-cleaning-header"
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary
            }}
          >
            Data Cleaning and Preprocessing
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • Preprocessing and data cleaning is an essential process within machine learning. It is used to clean the data by eliminating inconsistencies and errors, and preprocessing the data to prepare it for use with the machine learning model.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • This involves removing missing values, removing duplicate observations, ensuring the target feature is categorical, converting the target variable to a number (where a number represents a category), removing unnecessary columns, capping outliers to reduce their impact on predictions (commonly through logarithmic transformations), and scaling data to ensure it is on the same scale.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • One of the most crucial steps is one-hot encoding, which is used to convert categorical variables into a numerical format. It is done by creating new columns for every possible value of a categorical feature and marking whether or not that feature holds the value. When you load a custom dataset, you can observe that new columns are created with the feature name, an underscore, and then the target feature value.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • Data cleaning is preprocessing is an essential step in machine learning. It reduces noise (irrelevant information that can distort the data) and errors and improves model performance and reliability.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • Pipelines are used to streamline the data preprocessing steps to ensure no data leakage (where information from the training set accidentally influences the testing dataset).
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion 
        sx={{ 
          backgroundColor: isDarkMode ? theme.palette.secondary.dark + '30' : theme.palette.secondary.light + '40',
          border: `1px solid ${theme.palette.secondary.main}`,
          borderRadius: '16px',
          boxShadow: 'none',
          '&.MuiAccordion-root:before': {
            display: 'none',
          },
          mb: 2,
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="metrics-eval-content"
          id="metrics-eval-header"
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary
            }}
          >
            Metrics and Evaluation
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • When training machine learning models, we need to check how well it does on unseen data (which is better known by the name of 'test' data).
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • In doing this, there are certain metrics that we can use to see how well the model arrived at its overall predictions. The most commonly used metrics are Accuracy, Precision, Recall and F1-Score. All of these are explained in greater detail below.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • Accuracy is the ratio of correct predictions made by the model. It is calculated by dividing the number of correct predictions with the total number of predictions. This is similar to scoring an exam out of 100.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • Precision is the percentage of actual correct predictions made by the model, over the number of positive predictions. This is helpful in spam filters, where false positives (where a non-spam email is labeled as spam) are costly.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • Recall is the proportion of accurate positive cases made by a model, from total positive actual cases. It is used in disease diagnosis, with missed positives (when the patient is ill but not identified) being costly.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • F1-Score is the harmonic mean of precision and recall, and attempts to balance both of them. This is especially helpful if the dataset is imbalanced (when one of the classes contains significantly fewer or more examples than other classes).
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • Depending on the application, it can be necessary to optimise one or more of the metrics at the expense of others. For example, in fraud detection, it would be important to achieve high recall to detect as many fraudulent cases as possible even at the expense of precision. In the case of email spam filters, precision could become more important not to block important emails as spam.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion 
        sx={{ 
          backgroundColor: isDarkMode ? theme.palette.warning.dark + '30' : theme.palette.warning.light + '40',
          border: `1px solid ${theme.palette.warning.main}`,
          borderRadius: '16px',
          boxShadow: 'none',
          '&.MuiAccordion-root:before': {
            display: 'none',
          },
          mb: 2,
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="problems-content"
          id="problems-header"
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary
            }}
          >
            Problems
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • However, model training can be the source of many problems such as overfitting, underfitting, biased data and imbalanced classes, all of which can affect the performance of the model on new data.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • Overfitting occurs when the model is attempting to memorise the training data, rather than learning from it. It learns noise and errors, which can be present in the training data, and hence becomes unfit to make predictions on test data.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • Underfitting is the reverse of overfitting and occurs when the model doesn't learn the patterns in the data, and it performs badly on the training and test data.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • Data bias occurs when certain groups in the data are unevenly represented (either over or underrepresented) and the resulting models give unfair and inaccurate predictions which target one class more than another.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • Imbalanced data happens when a single class (target feature value) contains considerably more or less instances than other classes, which causes the model to over-treat or overlook that class in the final predictions.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • Models can also become less accurate as time passes if the data upon which they were trained changes or has new observations.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • To minimise such potential issues, techniques such as data preprocessing and cleaning, and cross-validation (a method of splitting the data into more than one training and testing sets for improving the predictability on unseen new data) can be utilised.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: theme.palette.text.primary
            }}
          >
            • One of the significant steps is stratified sampling, which is employed to make sure that the training and testing sets are also representative of the overall set. This is particularly crucial if the set is imbalanced (when one class contains substantially fewer or more samples than other classes).
          </Typography>
        </AccordionDetails>
      </Accordion>
      
    </Paper>
  );
};

export default MachineLearningExplanation;