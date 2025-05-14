// the drop-down that explains what the decision tree is and how it works

// material ui components
import {
  Typography,
  Box,
  Grid,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';

import { useTheme } from '@mui/material/styles';

import {
  ExpandMore as ExpandMoreIcon,
  Lightbulb as LightbulbIcon,
} from '@mui/icons-material';

const DecisionTreeExplanation = () => {
  const theme = useTheme();

  return (
    <Accordion 
      sx={{ 
        mb: 3,
        boxShadow: theme.shadows[1],
        borderRadius: '8px',
        '&:before': { display: 'none' },
        border: `1px solid ${theme.palette.divider}`
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{ 
          bgcolor: `${theme.palette.primary.main}0D`,
          borderBottom: `1px solid ${theme.palette.divider}`,
          height: '56px',
          minHeight: '56px',
          '&.Mui-expanded': {
            height: '56px',
            minHeight: '56px'
          }
        }}
      >
        <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600, color: theme.palette.primary.main }}>
          <LightbulbIcon fontSize="small" /> Understanding Decision Trees
        </Typography>
      </AccordionSummary>
      
      <AccordionDetails sx={{ p: 3, bgcolor: theme.palette.background.default }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="body1" paragraph color="text.primary">
              A decision tree is similar to asking yes/no questions to classify data. 
              It's similar to how you might troubleshoot a problem.
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />}
                sx={{ 
                  color: theme.palette.warning.main,
                  bgcolor: `${theme.palette.warning.main}0D`, // add a small amount of opacity to the background color
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'inherit' }}> 
                  Real-world Example
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: `${theme.palette.warning.main}0D`, p: 2 }}>
                <Paper sx={{ p: 2, borderRadius: '8px', bgcolor: theme.palette.action.hover, boxShadow: 'none' }}>
                  <Typography variant="body2" paragraph color="text.primary">
                    If you are trying to predict if someone likes pizza. You might ask:
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                      1. Do they like cheese? (If no, probably doesn't like pizza)
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                      2. Do they like tomato sauce? (If no, might like white pizza)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      3. Do they like bread? (If no, definitely doesn't like pizza)
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2 }} color="text.primary">
                    The decision tree takes your data and finds the best questions to ask.
                  </Typography>
                </Paper>
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />}
                sx={{ 
                  color: theme.palette.success.main,
                  bgcolor: `${theme.palette.success.main}0D`,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}
              >
                <Typography variant="h6" sx={{ color: 'inherit', fontWeight: 600 }}> 
                  Node Anatomy
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: `${theme.palette.success.main}0D`, p: 2 }}>
                <Typography variant="body1" paragraph color="text.primary">
                  Each box (node) in the decision tree contains several pieces of information.
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ bgcolor: theme.palette.action.hover, p: 2, borderRadius: '8px', mb: 2, boxShadow: theme.shadows[1] }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                        Feature and Threshold
                      </Typography>
                      <Typography variant="body2" paragraph color="text.secondary">
                        Example: "petal length (cm) &gt;= 2.45"
                      </Typography>
                      <Typography variant="body2" paragraph color="text.primary">
                        This is the decision question the node is asking.
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                          • Feature: The characteristic we are measuring (such as petal length)
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                          • Threshold: The cutoff value for making a decision
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • Operator: Mostly &gt;= (greater than or equal to) or &lt;= (less than or equal to)
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }} color="text.secondary">
                        This is similar to asking "Is this flower's petal longer than 2.45 cm?"
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box sx={{ bgcolor: theme.palette.action.hover, p: 2, borderRadius: '8px', mb: 2, boxShadow: theme.shadows[1] }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                        Samples
                      </Typography>
                      <Typography variant="body2" paragraph color="text.secondary">
                        Example: "samples = 150"
                      </Typography>
                      <Typography variant="body2" paragraph color="text.primary">
                        This shows how many data points reached this node.
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                          • The root node (top box) includes all samples in your dataset
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                          • Each split divides samples between left and right branches
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • Leaf nodes (end nodes) show how many samples got this final classification
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }} color="text.secondary">
                        This is similar to saying "150 flowers were tested at this decision point"
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box sx={{ bgcolor: theme.palette.action.hover, p: 2, borderRadius: '8px', mb: 2, boxShadow: theme.shadows[1] }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                        Values
                      </Typography>
                      <Typography variant="body2" paragraph color="text.secondary">
                        Example: "value = [50, 0, 0]"
                      </Typography>
                      <Typography variant="body2" paragraph color="text.primary">
                        This shows the distribution of classes among samples at this node.
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                          • Each number represents a count for one class (category)
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                          • For the iris dataset: [50, 0, 0] means 50 samples of class 0 (setosa), 0 of class 1 (versicolor), and 0 of class 2 (virginica)
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • The order matches the class labels (so for Iris, it is always [setosa, versicolor, virginica])
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }} color="text.secondary">
                        This is similar to saying "At this point, we have 50 setosa flowers, 0 versicolor, and 0 virginica"
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box sx={{ bgcolor: theme.palette.action.hover, p: 2, borderRadius: '8px', mb: 2, boxShadow: theme.shadows[1] }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                        Class
                      </Typography>
                      <Typography variant="body2" paragraph color="text.secondary">
                        Example: "class = 0"
                      </Typography>
                      <Typography variant="body2" paragraph color="text.primary">
                        This shows the predicted class/category for this node.
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                          • The class is the majority category among samples at this node
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                          • For the iris dataset: 0 = setosa, 1 = versicolor, 2 = virginica
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • If a data point ends at this node, this is the prediction it receives
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }} color="text.secondary">
                        This is similar to saying "If a flower gets to this point in the decision process, we classify it as a setosa"
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ bgcolor: theme.palette.action.hover, p: 2, borderRadius: '8px', mb: 2, boxShadow: theme.shadows[1] }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                        Gini/Impurity
                      </Typography>
                      <Typography variant="body2" paragraph color="text.secondary">
                        Example: "gini = 0.0" or "gini = 0.5"
                      </Typography>
                      <Typography variant="body2" paragraph color="text.primary">
                        This measures how "mixed" or "pure" the data is at this node.
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                          • Gini = 0.0: Perfect purity (all samples belong to the same class)
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                          • Gini = 0.5: High impurity (samples are evenly split between classes)
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • The decision tree tries to minimise Gini impurity with each split
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }} color="text.secondary">
                        This is similar to saying "How confident are we in our classification? 0.0 means completely confident"
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Box sx={{ mb: 2, p: 2, bgcolor: theme.palette.action.hover, borderRadius: '8px' }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                    Complete Example
                  </Typography>
                  <Box sx={{ maxWidth: '500px', margin: '0 auto', textAlign: 'left', bgcolor: `${theme.palette.success.main}1A`, p: 2, borderRadius: '8px', border: `2px solid ${theme.palette.success.main}` }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                      petal length (cm) &gt;= 2.45
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      gini = 0.667
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      samples = 150
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      value = [50, 50, 50]
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      class = 0
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2, textAlign: 'left' }}>
                    <Typography variant="body2" color="text.primary">
                      Reading this node:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      1. Question: "Is the petal length &gt;= 2.45 cm?"
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      2. Purity: The node has a Gini impurity of 0.667 (very mixed)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      3. Data: 150 flower samples reached this decision point
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      4. Distribution: 50 setosa, 50 versicolor, and 50 virginica samples
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      5. Prediction: If we had to make a guess here, we'd predict class 0 (setosa)
                    </Typography>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Grid>
          
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />}
                sx={{ 
                  color: theme.palette.secondary.main,
                  bgcolor: `${theme.palette.secondary.main}0D`,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'inherit' }}> 
                  How to Read the Tree Visualisation
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: `${theme.palette.secondary.main}0D`, p: 2 }}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.action.hover, borderRadius: '8px' }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    <Box sx={{ flex: '1 1 300px' }}>
                      <Typography variant="body2" paragraph color="text.primary">
                        Start at the top (root node) and follow the branches down.
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                          • If the condition is true (such as "petal length &gt;= 2.45" is true), go left
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                          • If the condition is false, go right
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • Continue until you reach a leaf node (end node with no further splits)
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ flex: '1 1 300px' }}>
                      <Typography variant="body2" paragraph color="text.primary">
                        Important features appear near the top of the tree:
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                          • The first split (top node) shows the most important feature
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                          • Features that appear multiple times have different effects at different values
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • Features that don't appear in the tree aren't helpful for classification
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />}
                sx={{ 
                  color: theme.palette.info.main,
                  bgcolor: `${theme.palette.info.main}0D`,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'inherit' }}> 
                  Example: Making a Prediction
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: `${theme.palette.info.main}0D`, p: 2 }}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.action.hover, borderRadius: '8px' }}>
                  <Typography variant="body2" paragraph color="text.primary">
                    Let's walk through an example of how the tree makes a prediction.
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      1. Start at the top node (such as "Is petal length &gt;= 2.45?")
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                      2. If our data point has petal length = 3.5, the answer is yes, so go left
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                      3. At the next node, check the next condition (such as "Is petal width &gt;= 1.75?")
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                      4. If our petal width = 1.0, the answer is no, so go right
                    </Typography>
                    <Typography variant="body2">
                      5. Continue until reaching a leaf node, which gives the final prediction.
                    </Typography>
                  </Box>
                </Paper>
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ 
                color: '#e65100',
                bgcolor: 'rgba(230, 81, 0, 0.05)',
                borderBottom: '1px solid rgba(230, 81, 0, 0.1)'
              }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#e65100' }}> 
                  Pro Tips
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: 'rgba(230, 81, 0, 0.05)' }}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.action.hover, borderRadius: '8px' }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        • Deeper trees can be more accurate but might "memorise" the data (overfitting)
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        • Purity (Gini) shows how well each node separates the data
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        • Small leaf nodes might represent rare but important cases
                      </Typography>
                      <Typography variant="body2">
                        • Test set accuracy is more important than training accuracy
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default DecisionTreeExplanation;
