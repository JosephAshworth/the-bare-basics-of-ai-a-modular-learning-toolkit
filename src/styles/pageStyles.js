// Page-specific styles
// This file organizes styles for different pages to make them more maintainable

// Home Page Styles
export const homePageStyles = {
  container: {
    padding: { xs: 2, sm: 4, md: 6 },
    maxWidth: '1200px',
    margin: '0 auto',
  },
  hero: {
    textAlign: 'center',
    marginBottom: 6,
  },
  heroTitle: {
    marginBottom: 2,
  },
  section: {
    marginBottom: 6,
  },
  sectionTitle: {
    marginBottom: 3,
  },
};

// Machine Learning Page Styles
export const machineLearningPageStyles = {
  container: {
    padding: { xs: 2, sm: 4, md: 6 },
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    marginBottom: 4,
  },
  section: {
    marginBottom: 5,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardContent: {
    flexGrow: 1,
  },
};

// Emotion Detection Page Styles
export const emotionDetectionPageStyles = {
  container: {
    padding: { xs: 2, sm: 4, md: 6 },
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    marginBottom: 4,
  },
  webcamContainer: {
    marginBottom: 4,
    border: '1px solid #ddd',
    borderRadius: 2,
    overflow: 'hidden',
  },
  resultsContainer: {
    marginTop: 4,
  },
};

// Fuzzy Logic Page Styles
export const fuzzyLogicPageStyles = {
  container: {
    padding: { xs: 2, sm: 4, md: 6 },
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    marginBottom: 4,
  },
  demoContainer: {
    marginTop: 4,
    marginBottom: 4,
  },
};

// Welcome Page Styles
export const welcomePageStyles = {
  container: {
    padding: { xs: 2, sm: 4, md: 6 },
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    marginBottom: 4,
    textAlign: 'center',
  },
  section: {
    marginBottom: 5,
  },
};

// Common page layout styles that can be reused
export const commonPageStyles = {
  pageContainer: {
    padding: { xs: 2, sm: 4, md: 6 },
    maxWidth: '1200px',
    margin: '0 auto',
  },
  pageHeader: {
    marginBottom: 4,
  },
  section: {
    marginBottom: 4,
  },
  sectionTitle: {
    marginBottom: 2,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
    },
  },
}; 