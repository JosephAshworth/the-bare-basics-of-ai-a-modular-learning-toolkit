import io # for reading the file
import pandas as pd # for reading the dataset 
import numpy as np # for numerical operations
from flask import jsonify, request # for returning the response
import chardet # for encoding detection



def process_csv(): # process the uploaded CSV file and return structured data
    try: # try to process the file
        if 'file' not in request.files: # check if the file is present
            return jsonify({'error': 'No file uploaded'}), 400 # return an error if the file is not present
            
        file = request.files['file'] # get the file from the request
        
        if file.filename == '': # check if the file is empty
            return jsonify({'error': 'No file selected'}), 400 # return an error if the file is empty
            
        if not file.filename.lower().endswith('.csv'): # check if the file is a CSV file
            return jsonify({'error': 'Only CSV files are supported'}), 400 # return an error if the file is not a CSV file
            
        columns_to_drop = request.form.get('columns_to_drop', '') # get the columns to drop from the request
        if columns_to_drop: # check if the columns to drop are provided
            try: # try to split the columns to drop
                columns_to_drop = columns_to_drop.split(',') # split the columns to drop by comma
                columns_to_drop = [col.strip() for col in columns_to_drop] # strip the columns to drop
            except Exception as e:
                print(f"Invalid format for columns_to_drop parameter: {str(e)}") # return an error if the columns to drop are not in the correct format
                columns_to_drop = [] # return an empty list if the columns to drop are not in the correct format
        else:
            columns_to_drop = [] # return an empty list if the columns to drop are not provided
            
        try: # try to read the CSV file
            content = file.stream.read() # read the raw file content (bytes)
            try: # try to decode with UTF-8 with BOM support
                text = content.decode("utf-8-sig") # decode the file with utf-8-sig to correctly handle files with a BOM (Byte Order Mark), which helps identify the encoding of the file. This ensures the BOM does not interfere with header names or data values when processing CSV files
            except UnicodeDecodeError: # if UTF-8 decoding fails, detect encoding using chardet
                detected = chardet.detect(content) # detect the encoding
                encoding = detected['encoding'] or 'latin-1' # use detected encoding, fallback to Latin-1 if unavailable
                try: # try to decode the file
                    text = content.decode(encoding) # decode the file with the detected encoding
                except Exception: # if the file is not encoded in the detected encoding, use latin-1 as a fallback
                    text = content.decode('latin-1') # final fallback to Latin-1 in case of error
            stream = io.StringIO(text, newline=None) # convert decoded text to in-memory string buffer, for efficient processing
            df = pd.read_csv(stream) # read the CSV file
            
            dropped_columns = [] # return an empty list if the columns to drop are not provided
            if columns_to_drop: # if the columns to drop are provided
                
                valid_columns_to_drop = [col for col in columns_to_drop if col in df.columns] # get the valid columns to drop, which are the ones are present in the CSV file
                
                if valid_columns_to_drop: # if the columns to drop are valid
                    df = df.drop(columns=valid_columns_to_drop) # drop the columns
                    dropped_columns = valid_columns_to_drop # return the dropped columns
                    print(f"Dropped columns: {', '.join(dropped_columns)}") # print the dropped columns
                
                invalid_columns = list(set(columns_to_drop) - set(valid_columns_to_drop)) # return the invalid columns, which are gotten by subtracting the valid columns from the columns to drop

                if invalid_columns: # if the invalid columns are present
                    print(f"Requested to drop non-existent columns: {', '.join(invalid_columns)}") # print the invalid columns
            

            if df.empty: # if the CSV file is empty
                return jsonify({'error': 'The CSV file is empty'}), 400 # return an error if the CSV file is empty
                
            original_row_count = len(df) # get the original row count
            df = df.dropna() # drop the rows with missing values
            dropped_row_count = original_row_count - len(df) # get the dropped row count
            
            if dropped_row_count > 0: # if the rows with missing values are dropped
                print(f"Dropped {dropped_row_count} rows with missing values") # print the dropped rows
                
            before_dedup_count = len(df) # get the original row count
            df = df.drop_duplicates() # drop the duplicate rows
            dedup_count = before_dedup_count - len(df) # get the dropped row count
            
            if dedup_count > 0: # if the duplicate rows are dropped
                print(f"Dropped {dedup_count} duplicate rows") # print the dropped rows
            
            potential_target_columns = [col for col in df.columns if df[col].nunique() <= 10] # get the potential target columns, these are the columns with less than 10 unique values
                
            categorical_conversions = {} # return an empty dictionary if the potential target columns are not provided  
            for col in potential_target_columns: # for each potential target column
                if not pd.api.types.is_categorical_dtype(df[col]): # if the column is not already categorical
                    original_dtype = str(df[col].dtype) # get the original dtype
                    df[col] = df[col].astype('category') # convert the column to categorical
                    categorical_conversions[col] = {'from': original_dtype, 'to': 'category'} # return the original dtype and the new dtype
                    print(f"Converted column '{col}' from {original_dtype} to categorical type") # print the converted column
            
            encoded_columns = {} # create an empty dictionary if the encoded columns are not provided
            encoded_df = pd.DataFrame()  # create separate dataframe for encoded columns
            
            for col in potential_target_columns: # for each potential target column
                encoded = pd.get_dummies(df[col], prefix=col) # create one-hot encoded columns
                
                encoded_df = pd.concat([encoded_df, encoded], axis=1) # add the encoded columns to the encoded dataframe, not the original
                
                encoded_columns[col] = encoded.columns.tolist() # return the encoded column names
                
                print(f"Applied one-hot encoding to '{col}', created {len(encoded.columns)} new columns") # print the encoded column names
            

            removed_neg_count = 0 # return 0 if the negative rows are not removed
            
            numerical_cols = df.select_dtypes(include=np.number).columns.tolist() # get the numerical columns, which are the columns with numeric values
            
            if numerical_cols: # if the numerical columns are present
                negative_indices = set() # return an empty set if the negative indices are not provided
                for col in numerical_cols: # for each numerical column
                    if col in df.columns: # if the column exists
                        negative_indices.update(df[df[col] < 0].index) # update the negative indices
                
                if negative_indices: # if the negative indices are present
                    df = df.drop(index=list(negative_indices)) # drop the negative indices
                    removed_neg_count = len(negative_indices) # get the removed negative count
                    print(f"Removed {removed_neg_count} rows containing negative numerical values") # print the removed negative count

            original_features = df.columns.tolist() # get the original column names
            
            encoded_df = encoded_df.reindex(df.index) # ensure encoded_df is aligned with the potentially modified df index
            combined_df = pd.concat([df, encoded_df], axis=1) # create a combined dataframe with the original and encoded data for machine learning
            
            data = combined_df.to_dict(orient='records') # convert the combined dataframe to a list of dictionaries for the response
            
            if not original_features: # if the original column names are not present
                return jsonify({'error': 'No features detected in the CSV file'}), 400 # return an error if the original column names are not present
                
            print(f"Successfully processed CSV file: {file.filename} with {len(data)} rows and {len(original_features)} original features, {len(encoded_df.columns)} encoded features") # print the success, with the number of rows, original features, and encoded features
            
            unique_counts = {col: df[col].nunique() for col in df.columns if col in df} # get the unique counts of each column
            suitable_targets = [col for col, count in unique_counts.items() if count <= 5] # get the suitable target columns, these are the columns with less than 5 unique values
            
            return jsonify({
                'data': data, # return the data
                'features': original_features,  # Only return original features for UI
                'all_columns': combined_df.columns.tolist(),  # All columns including encoded ones
                'suitable_targets': suitable_targets, # return the suitable target columns
                'unique_counts': unique_counts, # return the unique counts of each column
                'categorical_conversions': categorical_conversions, # return the categorical conversions
                'encoded_columns': encoded_columns, # return the encoded column names
                'dropped_columns': dropped_columns, # return the dropped columns    
                'negative_rows_removed': removed_neg_count, # return the removed negative count
            })
            
        except Exception as e: # if an error occurs
            print(f"Error processing CSV file: {str(e)}") # print the error
            return jsonify({'error': f'Error processing CSV file: {str(e)}'}), 400 # return an error
    except Exception as e: # if an error occurs
        print(f"Unexpected error processing CSV: {str(e)}") # print the error
        return jsonify({'error': str(e)}), 500 # return an error

def register_dataset_routes(app): # register the dataset routes with the app
    app.route('/api/process-csv', methods=['POST'])(process_csv) # register the process_csv route with the app, allowing the user to upload a CSV file and process it
