import {
  Typography, // import Typography from @mui/material
  Box, // import Box from @mui/material
  Grid, // import Grid from @mui/material
  Paper, // import Paper from @mui/material
  Accordion, // import Accordion from @mui/material
  AccordionSummary, // import AccordionSummary from @mui/material
  AccordionDetails // import AccordionDetails from @mui/material
} from '@mui/material'; // import all the components from @mui/material

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on dark or light mode

import {
  ExpandMore as ExpandMoreIcon, // import ExpandMoreIcon from @mui/icons-material
  Lightbulb as LightbulbIcon, // import LightbulbIcon from @mui/icons-material
} from '@mui/icons-material'; // import all the icons from @mui/icons-material

const DecisionTreeExplanation = () => { // define a functional component named DecisionTreeExplanation
  const theme = useTheme(); // for getting the MUI theme object

  return (
    <Accordion 
      sx={{ 
        mb: 3, // margin bottom of 3 units for spacing
        boxShadow: theme.shadows[1], // use theme shadow
        borderRadius: '8px', // rounded corners for the accordion
        '&:before': { display: 'none' }, // remove the default before pseudo-element
        border: `1px solid ${theme.palette.divider}` // use theme divider colour
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />} // icon to indicate the accordion can be expanded
        sx={{ 
          bgcolor: `${theme.palette.primary.main}0D`, // use primary colour with low alpha for background
          borderBottom: `1px solid ${theme.palette.divider}`, // use theme divider colour
          height: '56px', // fixed height for the summary
          minHeight: '56px', // minimum height to ensure consistency
          '&.Mui-expanded': {
            height: '56px', // maintain height when expanded
            minHeight: '56px' // maintain minimum height when expanded
          }
        }}
      >
        <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600, color: theme.palette.primary.main }}>
          <LightbulbIcon fontSize="small" /> Understanding Decision Trees {/*  title with an icon for visual interest */}
        </Typography>
      </AccordionSummary>
      
      <AccordionDetails sx={{ p: 3, bgcolor: theme.palette.background.default }}> {/* use theme default background */}
        <Grid container spacing={4}> {/* use a grid layout with spacing between items */}
          <Grid item xs={12}> {/* full-width grid item */}
            <Typography variant="body1" paragraph color="text.primary">
              A decision tree is similar to asking yes/no questions to classify data. 
              It's similar to how you might troubleshoot a problem. {/* explanation of decision trees */}
            </Typography>
          </Grid>

          <Grid item xs={12}> {/* full-width grid item for the real-world example */}
            <Accordion>
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />} // icon to expand the accordion
                sx={{ 
                  color: theme.palette.warning.main, // use theme warning colour
                  bgcolor: `${theme.palette.warning.main}0D`, // use warning colour with low alpha for background
                  borderBottom: `1px solid ${theme.palette.divider}` // use theme divider colour
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'inherit' }}> 
                  Real-world Example {/* subtitle for the section */}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: `${theme.palette.warning.main}0D`, p: 2 }}> {/* use warning colour with low alpha */}
                <Paper sx={{ p: 2, borderRadius: '8px', bgcolor: theme.palette.action.hover, boxShadow: 'none' }}> {/* use theme background */}
                  <Typography variant="body2" paragraph color="text.primary">
                    If you are trying to predict if someone likes pizza. You might ask: {/* introduction to the example */}
                  </Typography>
                  <Box sx={{ pl: 2 }}> {/* indentation for the list */}
                    <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                      1. Do they like cheese? (If no, probably doesn't like pizza) {/* first question in the example */}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                      2. Do they like tomato sauce? (If no, might like white pizza) {/* second question in the example */}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      3. Do they like bread? (If no, definitely doesn't like pizza) {/* third question in the example */}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2 }} color="text.primary">
                    The decision tree takes your data and finds the best questions to ask. {/* conclusion of the example */}
                  </Typography>
                </Paper>
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid item xs={12}> {/* full-width grid item for node anatomy */}
            <Accordion>
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />} // icon to expand the accordion
                sx={{ 
                  color: theme.palette.success.main, // use theme success colour
                  bgcolor: `${theme.palette.success.main}0D`, // use success colour with low alpha for background
                  borderBottom: `1px solid ${theme.palette.divider}` // use theme divider colour
                }}
              >
                <Typography variant="h6" sx={{ color: 'inherit', fontWeight: 600 }}> 
                  Node Anatomy {/* subtitle for the section */}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: `${theme.palette.success.main}0D`, p: 2 }}> {/* use success colour with low alpha */}
                <Typography variant="body1" paragraph color="text.primary">
                  Each box (node) in the decision tree contains several pieces of information. {/* introduction to node anatomy */}
                </Typography>
                
                <Grid container spacing={3}> {/* grid layout for node details */}
                  <Grid item xs={12} md={6}> {/* half-width grid item for feature and threshold */}
                    <Box sx={{ bgcolor: theme.palette.action.hover, p: 2, borderRadius: '8px', mb: 2, boxShadow: theme.shadows[1] }}> {/* use theme background and shadow */}
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                        Feature and Threshold {/* title for the feature and threshold section */}
                      </Typography>
                      <Typography variant="body2" paragraph color="text.secondary">
                        Example: "petal length (cm) &gt;= 2.45" {/* example of a decision question */}
                      </Typography>
                      <Typography variant="body2" paragraph color="text.primary">
                        This is the decision question the node is asking. {/* explanation of the decision question */}
                      </Typography>
                      <Box sx={{ pl: 2 }}> {/* indentation for the list */}
                        <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                          • Feature: The characteristic we are measuring (such as petal length) {/* explanation of feature */}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                          • Threshold: The cutoff value for making a decision {/* explanation of threshold */}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • Operator: Mostly &gt;= (greater than or equal to) or &lt;= (less than or equal to) {/* explanation of operator */}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }} color="text.secondary">
                        This is similar to asking "Is this flower's petal longer than 2.45 cm?" {/* analogy for understanding */}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}> {/* define a grid item that takes full width on extra-small screens and half width on medium screens */}
                    <Box sx={{ bgcolor: theme.palette.action.hover, p: 2, borderRadius: '8px', mb: 2, boxShadow: theme.shadows[1] }}> {/* use theme background and shadow */}
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                        Samples {/* title for the samples section */}
                      </Typography>
                      <Typography variant="body2" paragraph color="text.secondary">
                        Example: "samples = 150" {/* example showing the number of samples at a node */}
                      </Typography>
                      <Typography variant="body2" paragraph color="text.primary">
                        This shows how many data points reached this node. {/* explanation of what the sample count represents */}
                      </Typography>
                      <Box sx={{ pl: 2 }}> {/* indentation for the list */}
                        <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                          • The root node (top box) includes all samples in your dataset {/* explanation of the root node */}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                          • Each split divides samples between left and right branches {/* explanation of how samples are divided */}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • Leaf nodes (end nodes) show how many samples got this final classification {/* explanation of leaf nodes */}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }} color="text.secondary">
                        This is similar to saying "150 flowers were tested at this decision point" {/* analogy for understanding */}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}> {/* define a grid item that takes full width on extra-small screens and half width on medium screens */}
                    <Box sx={{ bgcolor: theme.palette.action.hover, p: 2, borderRadius: '8px', mb: 2, boxShadow: theme.shadows[1] }}> {/* use theme background and shadow */}
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                        Values {/* title for the values section */}
                      </Typography>
                      <Typography variant="body2" paragraph color="text.secondary">
                        Example: "value = [50, 0, 0]" {/* example showing the distribution of classes at a node */}
                      </Typography>
                      <Typography variant="body2" paragraph color="text.primary">
                        This shows the distribution of classes among samples at this node. {/* explanation of what the values represent */}
                      </Typography>
                      <Box sx={{ pl: 2 }}> {/* indentation for the list */}
                        <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                          • Each number represents a count for one class (category) {/* explanation of the numbers in the values */}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                          • For the iris dataset: [50, 0, 0] means 50 samples of class 0 (setosa), 0 of class 1 (versicolor), and 0 of class 2 (virginica) {/* explanation of the example values */}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • The order matches the class labels (so for Iris, it is always [setosa, versicolor, virginica]) {/* explanation of the order of values */}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }} color="text.secondary">
                        This is similar to saying "At this point, we have 50 setosa flowers, 0 versicolor, and 0 virginica" {/* analogy for understanding */}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}> {/* define a grid item that takes full width on extra-small screens and half width on medium screens */}
                    <Box sx={{ bgcolor: theme.palette.action.hover, p: 2, borderRadius: '8px', mb: 2, boxShadow: theme.shadows[1] }}> {/* use theme background and shadow */}
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                        Class {/* title for the class section */}
                      </Typography>
                      <Typography variant="body2" paragraph color="text.secondary">
                        Example: "class = 0" {/* example showing the predicted class at a node */}
                      </Typography>
                      <Typography variant="body2" paragraph color="text.primary">
                        This shows the predicted class/category for this node. {/* explanation of what the class represents */}
                      </Typography>
                      <Box sx={{ pl: 2 }}> {/* indentation for the list */}
                        <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                          • The class is the majority category among samples at this node {/* explanation of how the class is determined */}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                          • For the iris dataset: 0 = setosa, 1 = versicolor, 2 = virginica {/* explanation of the class labels */}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • If a data point ends at this node, this is the prediction it receives {/* explanation of the prediction process */}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }} color="text.secondary">
                        This is similar to saying "If a flower gets to this point in the decision process, we classify it as a setosa" {/* analogy for understanding */}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}> {/* define a grid item that takes full width on all screen sizes */}
                    <Box sx={{ bgcolor: theme.palette.action.hover, p: 2, borderRadius: '8px', mb: 2, boxShadow: theme.shadows[1] }}> {/* use theme background and shadow */}
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                        Gini/Impurity {/* title for the Gini/impurity section */}
                      </Typography>
                      <Typography variant="body2" paragraph color="text.secondary">
                        Example: "gini = 0.0" or "gini = 0.5" {/* example showing the Gini impurity at a node */}
                      </Typography>
                      <Typography variant="body2" paragraph color="text.primary">
                        This measures how "mixed" or "pure" the data is at this node. {/* explanation of what Gini/impurity represents */}
                      </Typography>
                      <Box sx={{ pl: 2 }}> {/* indentation for the list */}
                        <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                          • Gini = 0.0: Perfect purity (all samples belong to the same class) {/* explanation of Gini value 0.0 */}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                          • Gini = 0.5: High impurity (samples are evenly split between classes) {/* explanation of Gini value 0.5 */}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • The decision tree tries to minimise Gini impurity with each split {/* explanation of the decision tree's goal */}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }} color="text.secondary">
                        This is similar to saying "How confident are we in our classification? 0.0 means completely confident" {/* analogy for understanding */}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Box sx={{ mb: 2, p: 2, bgcolor: theme.palette.action.hover, borderRadius: '8px' }}> {/* use slightly different background for emphasis, dashed border with primary alpha */}
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                    Complete Example {/* title for the complete example section */}
                  </Typography>
                  <Box sx={{ maxWidth: '500px', margin: '0 auto', textAlign: 'left', bgcolor: `${theme.palette.success.main}1A`, p: 2, borderRadius: '8px', border: `2px solid ${theme.palette.success.main}` }}> {/* use success color for border and light background for this example box */}
                    <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                      petal length (cm) &gt;= 2.45 {/* example decision question */}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      gini = 0.667 {/* example Gini impurity value */}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      samples = 150 {/* example number of samples at this node */}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      value = [50, 50, 50] {/* example distribution of classes */}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      class = 0 {/* example predicted class */}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2, textAlign: 'left' }}> {/* box for listing the explanation points */}
                    <Typography variant="body2" color="text.primary">
                      Reading this node: {/* introduction to the explanation */}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      1. Question: "Is the petal length &gt;= 2.45 cm?" {/* explanation of the decision question */}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      2. Purity: The node has a Gini impurity of 0.667 (very mixed) {/* explanation of the Gini impurity */}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      3. Data: 150 flower samples reached this decision point {/* explanation of the sample count */}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      4. Distribution: 50 setosa, 50 versicolor, and 50 virginica samples {/* explanation of the class distribution */}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      5. Prediction: If we had to make a guess here, we'd predict class 0 (setosa) {/* explanation of the predicted class */}
                    </Typography>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Grid>
          
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />} // icon to indicate the accordion can be expanded
                sx={{ 
                  color: theme.palette.secondary.main, // use theme secondary colour
                  bgcolor: `${theme.palette.secondary.main}0D`, // use secondary colour with low alpha for background
                  borderBottom: `1px solid ${theme.palette.divider}` // use theme divider colour
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'inherit' }}> 
                  How to Read the Tree Visualisation {/* subtitle for the section */}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: `${theme.palette.secondary.main}0D`, p: 2 }}> {/* use secondary colour with low alpha */}
                <Paper sx={{ p: 2, bgcolor: theme.palette.action.hover, borderRadius: '8px' }}> {/* use action hover background */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}> {/* box for layout with flexbox and gap between items */}
                    <Box sx={{ flex: '1 1 300px' }}> {/* box with flexible width */}
                      <Typography variant="body2" paragraph color="text.primary">
                        Start at the top (root node) and follow the branches down. {/* explanation of how to read the tree */}
                      </Typography>
                      <Box sx={{ pl: 2 }}> {/* indentation for the list */}
                        <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                          • If the condition is true (such as "petal length &gt;= 2.45" is true), go left {/* explanation of the decision path */}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                          • If the condition is false, go right {/* explanation of the decision path */}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • Continue until you reach a leaf node (end node with no further splits) {/* explanation of reaching a leaf node */}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ flex: '1 1 300px' }}> {/* box with flexible width */}
                      <Typography variant="body2" paragraph color="text.primary">
                        Important features appear near the top of the tree: {/* explanation of feature importance */}
                      </Typography>
                      <Box sx={{ pl: 2 }}> {/* indentation for the list */}
                        <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                          • The first split (top node) shows the most important feature {/* explanation of the first split */}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                          • Features that appear multiple times have different effects at different values {/* explanation of feature repetition */}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • Features that don't appear in the tree aren't helpful for classification {/* explanation of feature absence */}
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
                expandIcon={<ExpandMoreIcon />} // icon to indicate the accordion can be expanded
                sx={{ 
                  color: theme.palette.info.main, // use theme info colour
                  bgcolor: `${theme.palette.info.main}0D`, // use info colour with low alpha for background
                  borderBottom: `1px solid ${theme.palette.divider}` // use theme divider colour
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'inherit' }}> 
                  Example: Making a Prediction {/* subtitle for the section */}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: `${theme.palette.info.main}0D`, p: 2 }}> {/* use info colour with low alpha */}
                <Paper sx={{ p: 2, bgcolor: theme.palette.action.hover, borderRadius: '8px' }}> {/* use action hover background */}
                  <Typography variant="body2" paragraph color="text.primary">
                    Let's walk through an example of how the tree makes a prediction. {/* introduction to the example */}
                  </Typography>
                  <Box sx={{ pl: 2 }}> {/* indentation for the list */}
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      1. Start at the top node (such as "Is petal length &gt;= 2.45?") {/* explanation of starting point */}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                      2. If our data point has petal length = 3.5, the answer is yes, so go left {/* explanation of decision path */}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                      3. At the next node, check the next condition (such as "Is petal width &gt;= 1.75?") {/* explanation of next decision */}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                      4. If our petal width = 1.0, the answer is no, so go right {/* explanation of decision path */}
                    </Typography>
                    <Typography variant="body2">
                      5. Continue until reaching a leaf node, which gives the final prediction. {/* explanation of reaching a leaf node */}
                    </Typography>
                  </Box>
                </Paper>
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ 
                color: '#e65100', // orange text colour for distinction
                bgcolor: 'rgba(230, 81, 0, 0.05)', // light orange background for the summary
                borderBottom: '1px solid rgba(230, 81, 0, 0.1)' // light border at the bottom
              }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#e65100', }}> 
                  Pro Tips {/* subtitle for the section */}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: 'rgba(230, 81, 0, 0.05)' }}> {/* background for details */}
                <Paper sx={{ p: 2, bgcolor: theme.palette.action.hover, borderRadius: '8px' }}> {/* paper component for content with padding and rounded corners */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}> {/* box for layout with flexbox and gap between items */}
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        • Deeper trees can be more accurate but might "memorise" the data (overfitting) {/* explanation of deeper trees */}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        • Purity (Gini) shows how well each node separates the data {/* explanation of purity */}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        • Small leaf nodes might represent rare but important cases {/* explanation of small leaf nodes */}
                      </Typography>
                      <Typography variant="body2">
                        • Test set accuracy is more important than training accuracy {/* explanation of test set accuracy */}
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

export default DecisionTreeExplanation; // export the DecisionTreeExplanation component as the default export, this allows it to be used in other files
