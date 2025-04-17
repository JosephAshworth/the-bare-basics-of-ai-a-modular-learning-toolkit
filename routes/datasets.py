import logging
import io
import pandas as pd
from flask import jsonify, request
from sklearn.datasets import load_iris

# Get logger
logger = logging.getLogger("emotion_detector")



def process_csv():
    """Process uploaded CSV file and return structured data"""
    try:
        # Check if file is present in request
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
            
        file = request.files['file']
        
        # Check if filename is empty
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
            
        # Check file extension
        if not file.filename.lower().endswith('.csv'):
            return jsonify({'error': 'Only CSV files are supported'}), 400
            
        # Read CSV file
        try:
            # Use StringIO to handle the file content
            stream = io.StringIO(file.stream.read().decode("utf-8"), newline=None)
            df = pd.read_csv(stream)
            
            # Check if dataframe is empty
            if df.empty:
                return jsonify({'error': 'The CSV file is empty'}), 400
                
            # Extract column names (features)
            features = df.columns.tolist()
            
            # Convert dataframe to list of dictionaries
            data = df.to_dict(orient='records')
            
            # Basic validation - ensure all features have values
            if not features:
                return jsonify({'error': 'No features detected in the CSV file'}), 400
                
            # Log success
            logger.info(f"Successfully processed CSV file: {file.filename} with {len(data)} rows and {len(features)} features")
            
            # Check for unique values in each column to suggest target features
            unique_counts = {col: df[col].nunique() for col in df.columns}
            suitable_targets = [col for col, count in unique_counts.items() if count <= 5]
            
            return jsonify({
                'data': data,
                'features': features,
                'suitable_targets': suitable_targets,
                'unique_counts': unique_counts
            })
            
        except Exception as e:
            logger.error(f"Error processing CSV file: {str(e)}")
            return jsonify({'error': f'Error processing CSV file: {str(e)}'}), 400
            
    except Exception as e:
        logger.error(f"Unexpected error processing CSV: {str(e)}")
        return jsonify({'error': str(e)}), 500

def register_dataset_routes(app):
    """Register all dataset routes with the app"""

    app.route('/api/process-csv', methods=['POST'])(process_csv) 