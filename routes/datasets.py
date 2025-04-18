import logging
import io
import pandas as pd
from flask import jsonify, request
from difflib import get_close_matches

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
            
        # Get columns to drop from request (if provided)
        columns_to_drop = request.form.get('columns_to_drop', '')
        if columns_to_drop:
            try:
                columns_to_drop = columns_to_drop.split(',')
                columns_to_drop = [col.strip() for col in columns_to_drop]
            except Exception as e:
                logger.warning(f"Invalid format for columns_to_drop parameter: {str(e)}")
                columns_to_drop = []
        else:
            columns_to_drop = []
            
        # Read CSV file
        try:
            # Use StringIO to handle the file content
            stream = io.StringIO(file.stream.read().decode("utf-8"), newline=None)
            df = pd.read_csv(stream)
            
            # Drop requested columns
            dropped_columns = []
            if columns_to_drop:
                # Filter out column names that don't exist in the dataframe
                valid_columns_to_drop = [col for col in columns_to_drop if col in df.columns]
                
                if valid_columns_to_drop:
                    # Drop columns
                    df = df.drop(columns=valid_columns_to_drop)
                    dropped_columns = valid_columns_to_drop
                    logger.info(f"Dropped columns: {', '.join(dropped_columns)}")
                
                # Log warning for invalid column names
                invalid_columns = list(set(columns_to_drop) - set(valid_columns_to_drop))
                if invalid_columns:
                    logger.warning(f"Requested to drop non-existent columns: {', '.join(invalid_columns)}")
            
            # Check if dataframe is empty
            if df.empty:
                return jsonify({'error': 'The CSV file is empty'}), 400
                
            # Drop rows with missing values
            original_row_count = len(df)
            df = df.dropna()
            dropped_row_count = original_row_count - len(df)
            
            if dropped_row_count > 0:
                logger.info(f"Dropped {dropped_row_count} rows with missing values")
                
            # Drop duplicate rows
            before_dedup_count = len(df)
            df = df.drop_duplicates()
            dedup_count = before_dedup_count - len(df)
            
            if dedup_count > 0:
                logger.info(f"Dropped {dedup_count} duplicate rows")
            
            # Fix typos in potential target columns (those with few unique values)
            potential_target_columns = [col for col in df.columns if df[col].nunique() <= 10]
            typo_fixes = {}
            
            for col in potential_target_columns:
                if df[col].dtype == object:  # Only attempt to fix string columns
                    unique_values = df[col].dropna().unique().tolist()
                    
                    # Skip if too few values to do meaningful correction
                    if len(unique_values) <= 1:
                        continue
                    
                    # Dictionary to track corrections
                    corrections = {}
                    
                    # Find similar strings and correct them
                    for val in unique_values:
                        close_matches = get_close_matches(val, unique_values, n=3, cutoff=0.8)
                        # Skip self-matches or if no matches found
                        if len(close_matches) <= 1:
                            continue
                            
                        # Get most frequent value among matches to use as the correction
                        match_counts = df[df[col].isin(close_matches)][col].value_counts()
                        if len(match_counts) > 0:
                            most_common = match_counts.index[0]
                            # Only correct if the value isn't already the most common
                            if val != most_common:
                                corrections[val] = most_common
                    
                    # Apply corrections
                    if corrections:
                        orig_values = df[col].copy()
                        df[col] = df[col].replace(corrections)
                        changed_count = (orig_values != df[col]).sum()
                        if changed_count > 0:
                            logger.info(f"Fixed {changed_count} typos in column '{col}'")
                            typo_fixes[col] = corrections
                
            # Ensure potential target columns are categorical
            categorical_conversions = {}
            for col in potential_target_columns:
                # Convert to categorical if it's not already
                if not pd.api.types.is_categorical_dtype(df[col]):
                    # Save original dtype for reporting
                    original_dtype = str(df[col].dtype)
                    # Convert to categorical
                    df[col] = df[col].astype('category')
                    categorical_conversions[col] = {'from': original_dtype, 'to': 'category'}
                    logger.info(f"Converted column '{col}' from {original_dtype} to categorical type")
            
            # Apply one-hot encoding to potential target variables
            encoded_columns = {}
            encoded_df = pd.DataFrame()  # Create separate dataframe for encoded columns
            
            for col in potential_target_columns:
                # Create one-hot encoded columns
                encoded = pd.get_dummies(df[col], prefix=col)
                
                # Add encoded columns to the encoded dataframe, not the original
                encoded_df = pd.concat([encoded_df, encoded], axis=1)
                
                # Track the encoded column names
                encoded_columns[col] = encoded.columns.tolist()
                
                logger.info(f"Applied one-hot encoding to '{col}', created {len(encoded.columns)} new columns")
            
            # Remove outliers in numerical columns using IQR method
            outlier_info = {}
            original_count = len(df)
            
            # Get numerical columns (exclude one-hot encoded as they're binary)
            numerical_cols = df.select_dtypes(include=['int64', 'float64']).columns.tolist()
            
            if numerical_cols:
                # Calculate IQR for each numerical column
                outlier_indices = set()
                
                for col in numerical_cols:
                    # Skip columns with all identical values
                    if df[col].nunique() <= 1:
                        continue
                        
                    Q1 = df[col].quantile(0.25)
                    Q3 = df[col].quantile(0.75)
                    IQR = Q3 - Q1
                    
                    # Define bounds for outliers (1.5 * IQR)
                    lower_bound = Q1 - 1.5 * IQR
                    upper_bound = Q3 + 1.5 * IQR
                    
                    # Find outliers
                    col_outliers = df[(df[col] < lower_bound) | (df[col] > upper_bound)].index
                    
                    if len(col_outliers) > 0:
                        outlier_info[col] = {
                            'lower_bound': float(lower_bound),
                            'upper_bound': float(upper_bound),
                            'count': len(col_outliers)
                        }
                        # Add these indices to our set of outlier indices
                        outlier_indices.update(col_outliers)
                
                if outlier_indices:
                    # Remove outliers
                    df = df.drop(index=list(outlier_indices))
                    removed_count = original_count - len(df)
                    logger.info(f"Removed {removed_count} outliers from dataset")
            
            # Extract original column names (features) - these are what will show in the dropdown
            original_features = df.columns.tolist()
            
            # Create combined dataframe with original and encoded data for machine learning
            combined_df = pd.concat([df, encoded_df], axis=1)
            
            # Convert combined dataframe to list of dictionaries for the response
            data = combined_df.to_dict(orient='records')
            
            # Basic validation - ensure all features have values
            if not original_features:
                return jsonify({'error': 'No features detected in the CSV file'}), 400
                
            # Log success
            logger.info(f"Successfully processed CSV file: {file.filename} with {len(data)} rows and {len(original_features)} original features, {len(encoded_df.columns)} encoded features")
            
            # Check for unique values in each column to suggest target features
            unique_counts = {col: df[col].nunique() for col in df.columns}
            suitable_targets = [col for col, count in unique_counts.items() if count <= 5]
            
            return jsonify({
                'data': data,
                'features': original_features,  # Only return original features for UI
                'all_columns': combined_df.columns.tolist(),  # All columns including encoded ones
                'suitable_targets': suitable_targets,
                'unique_counts': unique_counts,
                'typo_fixes': typo_fixes,
                'categorical_conversions': categorical_conversions,
                'encoded_columns': encoded_columns,
                'dropped_columns': dropped_columns,
                'outliers_removed': {
                    'total_count': original_count - len(df),
                    'details': outlier_info
                }
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