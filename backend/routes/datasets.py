

import io  # for reading file streams
import pandas as pd  # for data manipulation and analysis
import numpy as np  # for numerical operations
from flask import jsonify, request  # for handling http requests and responses
import chardet  # for detecting file encoding

# processes an uploaded csv file for machine learning
# performs data cleaning, encoding, and feature engineering
# returns processed data and metadata for model training
def process_csv():
    try:
        # validate file upload
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
            
        file = request.files['file']
        
        # check if a file was selected
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
            
        # ensure file is csv format
        if not file.filename.lower().endswith('.csv'):
            return jsonify({'error': 'Only CSV files are supported'}), 400
            
        # get list of columns to remove from the request
        # format should be comma-separated column names
        columns_to_drop = request.form.get('columns_to_drop', '')
        if columns_to_drop:
            try:
                columns_to_drop = columns_to_drop.split(',')
                columns_to_drop = [col.strip() for col in columns_to_drop]
            except Exception as e:
                print(f"Invalid format for columns_to_drop parameter: {str(e)}")
                columns_to_drop = []
        else:
            columns_to_drop = []
            
        try:
            # read file content and handle different encodings
            # tries utf-8 first, then detects encoding, falls back to latin-1
            content = file.stream.read()
            try:
                text = content.decode("utf-8-sig")  # handles files with byte order mark
            except UnicodeDecodeError:
                detected = chardet.detect(content)
                encoding = detected['encoding'] or 'latin-1'
                try:
                    text = content.decode(encoding)
                except Exception:
                    text = content.decode('latin-1')  # final fallback encoding
            stream = io.StringIO(text, newline=None)
            df = pd.read_csv(stream)
            
            # remove specified columns if they exist
            dropped_columns = []
            if columns_to_drop:
                # find which requested columns actually exist in the dataframe
                valid_columns_to_drop = [col for col in columns_to_drop if col in df.columns]
                
                if valid_columns_to_drop:
                    df = df.drop(columns=valid_columns_to_drop)
                    dropped_columns = valid_columns_to_drop
                    print(f"Dropped columns: {', '.join(dropped_columns)}")
                
                # identify columns that were requested but don't exist
                invalid_columns = list(set(columns_to_drop) - set(valid_columns_to_drop))

                if invalid_columns:
                    print(f"Requested to drop non-existent columns: {', '.join(invalid_columns)}")
            
            # validate dataframe is not empty
            if df.empty:
                return jsonify({'error': 'The CSV file is empty'}), 400
                
            # clean data by removing rows with missing values
            original_row_count = len(df)
            df = df.dropna()
            dropped_row_count = original_row_count - len(df)
            
            if dropped_row_count > 0:
                print(f"Dropped {dropped_row_count} rows with missing values")
                
            # remove duplicate rows to ensure data quality
            before_dedup_count = len(df)
            df = df.drop_duplicates()
            dedup_count = before_dedup_count - len(df)
            
            if dedup_count > 0:
                print(f"Dropped {dedup_count} duplicate rows")
            
            # identify columns that might be suitable as target variables
            # columns with 10 or fewer unique values are considered potential targets
            potential_target_columns = [col for col in df.columns if df[col].nunique() <= 10]
                
            # convert potential target columns to categorical type for better processing
            categorical_conversions = {}
            for col in potential_target_columns:
                if not pd.api.types.is_categorical_dtype(df[col]):
                    original_dtype = str(df[col].dtype)
                    df[col] = df[col].astype('category')
                    categorical_conversions[col] = {'from': original_dtype, 'to': 'category'}
                    print(f"Converted column '{col}' from {original_dtype} to categorical type")
            
            # perform one-hot encoding on categorical columns
            # this creates binary columns for each category value
            encoded_columns = {}
            encoded_df = pd.DataFrame()
            
            for col in potential_target_columns:
                encoded = pd.get_dummies(df[col], prefix=col)
                encoded_df = pd.concat([encoded_df, encoded], axis=1)
                encoded_columns[col] = encoded.columns.tolist()
                print(f"Applied one-hot encoding to '{col}', created {len(encoded.columns)} new columns")
            
            # remove rows with negative values in numerical columns
            # this is often necessary for certain types of analysis
            removed_neg_count = 0
            numerical_cols = df.select_dtypes(include=np.number).columns.tolist()
            
            if numerical_cols:
                negative_indices = set()
                for col in numerical_cols:
                    if col in df.columns:
                        negative_indices.update(df[df[col] < 0].index)
                
                if negative_indices:
                    df = df.drop(index=list(negative_indices))
                    removed_neg_count = len(negative_indices)
                    print(f"Removed {removed_neg_count} rows containing negative numerical values")

            # prepare final dataset by combining original and encoded features
            original_features = df.columns.tolist()
            encoded_df = encoded_df.reindex(df.index)
            combined_df = pd.concat([df, encoded_df], axis=1)
            data = combined_df.to_dict(orient='records')
            
            if not original_features:
                return jsonify({'error': 'No features detected in the CSV file'}), 400
                
            print(f"Successfully processed CSV file: {file.filename} with {len(data)} rows and {len(original_features)} original features, {len(encoded_df.columns)} encoded features")
            
            # identify suitable target columns for machine learning
            # columns with 5 or fewer unique values are considered good targets
            unique_counts = {col: df[col].nunique() for col in df.columns if col in df}
            suitable_targets = [col for col, count in unique_counts.items() if count <= 5]
            
            # return processed data and metadata for model training
            return jsonify({
                'data': data,  # the processed dataset
                'features': original_features,  # original column names
                'all_columns': combined_df.columns.tolist(),  # all columns including encoded ones
                'suitable_targets': suitable_targets,  # columns suitable as target variables
                'unique_counts': unique_counts,  # number of unique values in each column
                'categorical_conversions': categorical_conversions,  # columns converted to categorical
                'encoded_columns': encoded_columns,  # one-hot encoded columns
                'dropped_columns': dropped_columns,  # columns that were removed
                'negative_rows_removed': removed_neg_count,  # rows removed due to negative values
            })
            
        except Exception as e:
            print(f"Error processing CSV file: {str(e)}")
            return jsonify({'error': f'Error processing CSV file: {str(e)}'}), 400
    except Exception as e:
        print(f"Unexpected error processing CSV: {str(e)}")
        return jsonify({'error': str(e)}), 500

# register the csv processing route with the flask app
# this endpoint accepts post requests with csv files
def register_dataset_routes(app):
    app.route('/api/process-csv', methods=['POST'])(process_csv)