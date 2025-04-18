import React from 'react';
import {
  Typography,
  Box,
  Grid,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Lightbulb as LightbulbIcon,
  AutoAwesome as SparkleIcon
} from '@mui/icons-material';

const DecisionTreeExplanation = () => {
  return (
    <Accordion 
      sx={{ 
        mb: 3, 
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        borderRadius: '8px',
        '&:before': { display: 'none' },
        border: '1px solid rgba(25, 118, 210, 0.2)'
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{ 
          bgcolor: 'rgba(25, 118, 210, 0.05)', 
          borderBottom: '1px solid rgba(25, 118, 210, 0.1)',
          height: '56px',
          minHeight: '56px',
          '&.Mui-expanded': {
            height: '56px',
            minHeight: '56px'
          }
        }}
      >
        <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600, color: '#1976d2' }}>
          <LightbulbIcon fontSize="small" /> Understanding Decision Trees
        </Typography>
      </AccordionSummary>
      
      <AccordionDetails sx={{ p: 3 }}>
        <Grid container spacing={4}>
          {/* Basic Concept */}
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>
                  Understanding Decision Trees for Beginners
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" paragraph>
                  A decision tree is like a flowchart that asks a series of yes/no questions to classify data. 
                  It's similar to how doctors diagnose patients or how you might troubleshoot a problem.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Real-world Analogy */}
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1976d2' }}>
                  Real-world Example
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Paper sx={{ p: 2, bgcolor: '#f8f9ff', borderRadius: '8px' }}>
                  <Typography variant="body2" paragraph>
                    Imagine you're trying to predict if someone likes pizza. You might ask:
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      1. Do they like cheese? (If no → probably doesn't like pizza)
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      2. Do they like tomato sauce? (If no → might like white pizza)
                    </Typography>
                    <Typography variant="body2">
                      3. Do they like bread? (If no → definitely doesn't like pizza)
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    The decision tree takes your data and automatically finds the best questions to ask!
                  </Typography>
                </Paper>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Detailed Node Anatomy */}
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>
                  Node Anatomy: A Detailed Look
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Paper sx={{ p: 3, bgcolor: '#f0f7ff', borderRadius: '8px', border: '1px solid rgba(25, 118, 210, 0.2)' }}>
                  <Typography variant="body1" paragraph>
                    Each box (node) in the decision tree contains several pieces of information. Let's break them down:
                  </Typography>
                  
                  <Grid container spacing={3}>
                    {/* Feature and Threshold */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{ bgcolor: 'white', p: 2, borderRadius: '8px', mb: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#1976d2' }}>
                          Feature and Threshold
                        </Typography>
                        <Typography variant="body2" paragraph>
                          <strong>Example:</strong> "petal length (cm) &gt;= 2.45"
                        </Typography>
                        <Typography variant="body2" paragraph>
                          This is the <strong>decision question</strong> the node is asking:
                        </Typography>
                        <Box sx={{ pl: 2 }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            • <strong>Feature:</strong> What characteristic we're measuring (e.g., petal length)
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            • <strong>Threshold:</strong> The cutoff value for making a decision
                          </Typography>
                          <Typography variant="body2">
                            • <strong>Operator:</strong> Usually &gt;= (greater than or equal to) or &lt;= (less than or equal to)
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                          Think of it like: "Is this flower's petal longer than 2.45 cm?"
                        </Typography>
                      </Box>
                    </Grid>
                    
                    {/* Samples Explanation */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{ bgcolor: 'white', p: 2, borderRadius: '8px', mb: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#1976d2' }}>
                          Samples
                        </Typography>
                        <Typography variant="body2" paragraph>
                          <strong>Example:</strong> "samples = 150"
                        </Typography>
                        <Typography variant="body2" paragraph>
                          This shows <strong>how many data points</strong> reached this node:
                        </Typography>
                        <Box sx={{ pl: 2 }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            • The <strong>root node</strong> (top box) includes all samples in your dataset
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            • Each <strong>split</strong> divides samples between left and right branches
                          </Typography>
                          <Typography variant="body2">
                            • <strong>Leaf nodes</strong> (end nodes) show how many samples got this final classification
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                          Think of it like: "150 flowers were tested at this decision point"
                        </Typography>
                      </Box>
                    </Grid>
                    
                    {/* Values Explanation */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{ bgcolor: 'white', p: 2, borderRadius: '8px', mb: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#1976d2' }}>
                          Values
                        </Typography>
                        <Typography variant="body2" paragraph>
                          <strong>Example:</strong> "value = [50, 0, 0]"
                        </Typography>
                        <Typography variant="body2" paragraph>
                          This shows the <strong>distribution of classes</strong> among samples at this node:
                        </Typography>
                        <Box sx={{ pl: 2 }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            • Each <strong>number</strong> represents a count for one class (category)
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            • For the iris dataset: [50, 0, 0] means 50 samples of class 0, 0 of class 1, and 0 of class 2
                          </Typography>
                          <Typography variant="body2">
                            • The <strong>order</strong> matches the class labels (e.g., [setosa, versicolor, virginica])
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                          Think of it like: "At this point, we have 50 setosa flowers, 0 versicolor, and 0 virginica"
                        </Typography>
                      </Box>
                    </Grid>
                    
                    {/* Class Explanation */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{ bgcolor: 'white', p: 2, borderRadius: '8px', mb: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#1976d2' }}>
                          Class
                        </Typography>
                        <Typography variant="body2" paragraph>
                          <strong>Example:</strong> "class = 0"
                        </Typography>
                        <Typography variant="body2" paragraph>
                          This shows the <strong>predicted class/category</strong> for this node:
                        </Typography>
                        <Box sx={{ pl: 2 }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            • The class is the <strong>majority category</strong> among samples at this node
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            • For the iris dataset: 0 = setosa, 1 = versicolor, 2 = virginica
                          </Typography>
                          <Typography variant="body2">
                            • If a data point ends at this node, this is the <strong>prediction</strong> it receives
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                          Think of it like: "If a flower gets to this point in the decision process, we classify it as a setosa"
                        </Typography>
                      </Box>
                    </Grid>
                    
                    {/* Gini/Impurity Explanation */}
                    <Grid item xs={12}>
                      <Box sx={{ bgcolor: 'white', p: 2, borderRadius: '8px', mb: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#1976d2' }}>
                          Gini/Impurity
                        </Typography>
                        <Typography variant="body2" paragraph>
                          <strong>Example:</strong> "gini = 0.0" or "gini = 0.5"
                        </Typography>
                        <Typography variant="body2" paragraph>
                          This measures how <strong>"mixed" or "pure"</strong> the data is at this node:
                        </Typography>
                        <Box sx={{ pl: 2 }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            • <strong>Gini = 0.0:</strong> Perfect purity (all samples belong to the same class)
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            • <strong>Gini = 0.5:</strong> High impurity (samples are evenly split between classes)
                          </Typography>
                          <Typography variant="body2">
                            • The decision tree tries to <strong>minimize</strong> Gini impurity with each split
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                          Think of it like: "How confident are we in our classification? 0.0 means completely confident"
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  {/* Node Diagram */}
                  <Box sx={{ mt: 3, p: 3, bgcolor: 'white', borderRadius: '8px', border: '1px dashed rgba(25, 118, 210, 0.4)', textAlign: 'center' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                      Putting It All Together: Anatomy of a Node
                    </Typography>
                    <Box sx={{ maxWidth: '500px', margin: '0 auto', textAlign: 'left', bgcolor: '#f0fff4', p: 2, borderRadius: '8px', border: '2px solid #4caf50' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                        petal length (cm) &gt;= 2.45
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        gini = 0.667
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        samples = 150
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        value = [50, 50, 50]
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        class = 0
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2, textAlign: 'left' }}>
                      <Typography variant="body2">
                        <strong>Reading this node:</strong> 
                      </Typography>
                      <Typography variant="body2">
                        1. <strong>Question:</strong> "Is the petal length &gt;= 2.45 cm?"
                      </Typography>
                      <Typography variant="body2">
                        2. <strong>Purity:</strong> The node has a Gini impurity of 0.667 (very mixed)
                      </Typography>
                      <Typography variant="body2">
                        3. <strong>Data:</strong> 150 flower samples reached this decision point
                      </Typography>
                      <Typography variant="body2">
                        4. <strong>Distribution:</strong> 50 setosa, 50 versicolor, and 50 virginica samples
                      </Typography>
                      <Typography variant="body2">
                        5. <strong>Prediction:</strong> If we had to make a guess here, we'd predict class 0 (setosa)
                      </Typography>
                      <Typography variant="body2">
                        6. <strong>Color:</strong> Light green indicates mixed classes with a slight tendency toward class 0
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </AccordionDetails>
            </Accordion>
          </Grid>
          
          {/* How to Read It */}
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1976d2' }}>
                  How to Read the Tree Visualization
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Paper sx={{ p: 2, bgcolor: '#f8f9ff', borderRadius: '8px' }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    <Box sx={{ flex: '1 1 300px' }}>
                      <Typography variant="body2" paragraph>
                        <strong>Start at the top</strong> (root node) and follow the branches down:
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • If the condition is TRUE (e.g., "petal length &gt;= 2.45" is true), go LEFT
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • If the condition is FALSE, go RIGHT
                        </Typography>
                        <Typography variant="body2">
                          • Continue until you reach a leaf node (end node with no further splits)
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ flex: '1 1 300px' }}>
                      <Typography variant="body2" paragraph>
                        <strong>Important features</strong> appear near the top of the tree:
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • The first split (top node) shows the most important feature
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          • Features that appear multiple times have different effects at different values
                        </Typography>
                        <Typography variant="body2">
                          • Features that don't appear in the tree aren't helpful for classification
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Example Prediction */}
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1976d2' }}>
                  Example: Making a Prediction
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Paper sx={{ p: 2, bgcolor: '#f8f9ff', borderRadius: '8px' }}>
                  <Typography variant="body2" paragraph>
                    Let's walk through an example of how the tree makes a prediction:
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      1. Start at the top node (e.g., "Is petal length &gt;= 2.45?")
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      2. If our data point has petal length = 3.5, the answer is YES, so go LEFT
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      3. At the next node, check the next condition (e.g., "Is petal width &gt;= 1.75?")
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      4. If our petal width = 1.0, the answer is NO, so go RIGHT
                    </Typography>
                    <Typography variant="body2">
                      5. Continue until reaching a leaf node, which gives the final prediction!
                    </Typography>
                  </Box>
                </Paper>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Tips for Interpretation */}
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#e65100', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SparkleIcon fontSize="small" /> Pro Tips
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Paper sx={{ p: 2, bgcolor: '#fff9f0', borderRadius: '8px', border: '1px dashed #ffab40' }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    <Box sx={{ flex: '1 1 300px' }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        • <strong>Deeper trees</strong> can be more accurate but might "memorize" the data (overfitting)
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        • <strong>Wide boxes</strong> typically contain more samples (data points)
                      </Typography>
                      <Typography variant="body2">
                        • <strong>Purity</strong> (Gini) shows how well each node separates the data
                      </Typography>
                    </Box>
                    <Box sx={{ flex: '1 1 300px' }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        • <strong>Balanced trees</strong> are easier to interpret than lopsided ones
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        • <strong>Small leaf nodes</strong> might represent rare but important cases
                      </Typography>
                      <Typography variant="body2">
                        • <strong>Test set accuracy</strong> is more important than training accuracy
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