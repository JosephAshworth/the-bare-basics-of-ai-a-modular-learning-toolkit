import io # for reading and writing files   
import json # for parsing JSON data
import base64 # for encoding and decoding data
import traceback # for error handling
import numpy as np # for numerical operations
import pandas as pd # for data manipulation
import os # for file operations
import uuid # for generating unique identifiers 

import matplotlib # for plotting the decision tree
matplotlib.use('Agg') # ensure that matplotlib is used in the background, so it doesn't block the main thread
import matplotlib.pyplot as plt # for plotting the decision tree

from flask import request, jsonify # for handling HTTP requests and responses

from sklearn.datasets import load_iris # for loading the iris dataset
from sklearn.tree import DecisionTreeClassifier, plot_tree # for training the decision tree classifier
from sklearn.neighbors import KNeighborsClassifier # for training the k-nearest neighbours classifier
from sklearn.model_selection import train_test_split # for splitting the data into training and testing sets
from sklearn.preprocessing import StandardScaler, FunctionTransformer, OneHotEncoder, LabelEncoder # for preprocessing the data
from sklearn.impute import SimpleImputer # for imputing missing values
from sklearn.compose import ColumnTransformer # for transforming the data
from sklearn.pipeline import Pipeline # for creating the pipeline
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, ConfusionMatrixDisplay # for evaluating the model




STATIC_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'static') # for the static folder
VIS_DIR = os.path.join(STATIC_FOLDER, 'visualisations') # for the visualisations directory
os.makedirs(VIS_DIR, exist_ok=True) # create the visualisations directory if it doesn't exist


class ModelError(Exception): # for the model error, this is a custom exception that is used to handle errors in the model training
    pass # do nothing, this is just a placeholder, and the actual error is handled in the other functions


def log_transform_outliers(X): # for the log transform outliers, this is a function that is used to log transform the outliers in the data
    X_df = pd.DataFrame(X) # convert the numpy array to a pandas dataframe
    X_transformed = X_df.copy() # create a copy of the dataframe
    for col in X_df.columns: # for each column in the dataframe
        if pd.api.types.is_numeric_dtype(X_df[col]): # check if the column is numeric
            Q1 = X_df[col].quantile(0.25) # calculate the first quartile
            Q3 = X_df[col].quantile(0.75) # calculate the third quartile
            IQR = Q3 - Q1 # calculate the interquartile range
            if not np.isclose(IQR, 0): # check if the interquartile range is not close to 0
                lower_bound = Q1 - 1.5 * IQR # calculate the lower bound
                upper_bound = Q3 + 1.5 * IQR # calculate the upper bound
                outliers_mask = (X_df[col] < lower_bound) | (X_df[col] > upper_bound) # create a mask for the outliers
                safe_outliers_mask = outliers_mask & (X_df[col] >= 0) # create a mask for the safe outliers
                X_transformed.loc[safe_outliers_mask, col] = np.log1p(X_df.loc[safe_outliers_mask, col]) # log transform the safe outliers
    return X_transformed.values # return the transformed dataframe as a numpy array

log_transformer_step = FunctionTransformer( # for the log transformer step, this is a function that is used to log transform the outliers in the data
    log_transform_outliers, # use the log transform outliers function
    validate=False, # do not validate the data, this is used to ensure that the data is not changed
    feature_names_out='one-to-one' # use the one to one feature names out, this is used to ensure that the feature names are not changed
)

def validate_input_data(data): # for the validate input data, this is a function that is used to validate the input data
    required_fields = ['dataset', 'modelType', 'testSize'] # for the required fields, this is a list of the required fields
    
    for field in required_fields: # for each field in the required fields
        if field not in data: # check if the field is not in the data
            raise ModelError(f"Missing required field: {field}") # raise an error if the field is not in the data
    
    if data['dataset'] not in ['iris', 'custom']: # check if the dataset is not either iris or custom
        raise ModelError("Dataset must be either 'iris' or 'custom'") # raise an error if the dataset is not either iris or custom
    
    if data['modelType'] not in ['decision_tree', 'knn']: # check if the model type is not either decision tree or knn
        raise ModelError("Model type must be either 'decision_tree' or 'knn'") # raise an error if the model type is not either decision tree or knn
    
    if not 0.1 <= data['testSize'] <= 0.5: # check if the test size is not between 0.1 and 0.5
        raise ModelError("Test size must be between 0.1 and 0.5") # raise an error if the test size is not between 0.1 and 0.5

    if data['modelType'] == 'knn': # if the model type is knn
        n_neighbors = data.get('nNeighbors', 5) # get the n neighbours, or 5 if the n neighbours is not specified
        if n_neighbors < 1: # check if the n neighbours is less than 1
            raise ModelError("Number of neighbors (n_neighbors) must be at least 1.") # raise an error if the n neighbours is less than 1
    if data['modelType'] == 'decision_tree': # if the model type is decision tree
        min_samples_split = data.get('minSamplesSplit', 2) # get the min samples split, or 2 if the min samples split is not specified
        if min_samples_split < 2: # check if the min samples split is less than 2
            raise ModelError("Minimum samples split (minSamplesSplit) must be at least 2.") # raise an error if the min samples split is less than 2

def validate_custom_dataset(data): # for the validate custom dataset, this is a function that is used to validate the custom dataset
    if 'customData' not in data: # check if the custom data is not in the data
        raise ModelError("Custom dataset is required when dataset type is 'custom'") # raise an error if the custom data is not in the data
    
    if not data['customData']: # check if the custom data is not empty
        raise ModelError("Custom dataset cannot be empty") # raise an error if the custom data is empty
    
    if 'targetFeature' not in data: # check if the target feature is not in the data
        raise ModelError("Target feature must be specified for custom dataset") # raise an error if the target feature is not in the data
    
    if 'selectedFeatures' not in data: # check if the selected features are not in the data
        raise ModelError("Selected features must be specified for custom dataset") # raise an error if the selected features are not in the data

def validate_target_feature(y, max_unique_values=10): # for the validate target feature, this is a function that is used to validate the target feature
    unique_values = np.unique(y) # get the unique values in the target feature
    if len(unique_values) > max_unique_values: # check if the number of unique values is greater than the maximum allowed unique values
        raise ModelError( # raise an error if the number of unique values is greater than the maximum allowed unique values
            f"Target feature has {len(unique_values)} unique values." # state the number of unique values in the target feature
            f"Maximum allowed is {max_unique_values} for classification." # state the maximum allowed unique values for classification
        )

def create_visualisation(model_or_pipeline, model_type, feature_names=None, class_names=None): # for the create visualisation, this is a function that is used to create the visualisation
    model_to_plot = model_or_pipeline # set the model to plot to the model or pipeline
    if isinstance(model_or_pipeline, Pipeline): # check if the model or pipeline is a pipeline
        try: # try to set the model to plot to the model in the pipeline
            model_to_plot = model_or_pipeline.named_steps['model'] # set the model to plot to the model in the pipeline
        except KeyError: # if the model is not found in the pipeline
            print("Error: Could not find 'model' step in the pipeline for visualisation.") # print an error message
            return None # return None, so that the visualisation is not created
            
    if model_type == 'decision_tree' and isinstance(model_to_plot, DecisionTreeClassifier): # check if the model type is a decision tree and if the model to plot is a decision tree classifier
        try: # try to create the visualisation
            plt.close('all') # close all the plots
            fig = plt.figure(figsize=(70, 50), facecolor='white') # create a figure for the visualisation
            effective_class_names = class_names if class_names is not None else [] # set the effective class names to the class names if they are not None
            
            plot_tree(model_to_plot, # plot the tree 
                  feature_names=feature_names, # set the feature names
                  class_names=effective_class_names, # set the class names
                  filled=True, # fill the tree with colours
                  rounded=True, # round the tree
                  fontsize=5, # set the font size, this is the size of the font in the tree
                  precision=2) # set the precision, this is the number of decimal places to display
            
            plt.subplots_adjust(left=0.01, right=0.99, top=0.99, bottom=0.01) # adjust the subplots, with 1% padding on the left and right, and 1% padding on the top and bottom
            plt.tight_layout(pad=3.0) # adjust the layout, with 3.0 padding between the subplots
            
            filename = f"tree_{uuid.uuid4()}.pdf" # create a filename for the visualisation
            filepath = os.path.join(VIS_DIR, filename) # create a filepath for the visualisation
            
            plt.savefig(filepath, format='pdf', bbox_inches='tight', facecolor='white', edgecolor='none') # save the visualisation
            plt.close(fig) # close the figure
            
            visualisation_url = f"/static/visualisations/{filename}" # create a url for the visualisation
            print(f"Visualisation saved to: {filepath}") # print a message to the console, that the visualisation has been saved
            print(f"Returning URL: {visualisation_url}") # print a message to the console, that the url for the visualisation is being returned
            return visualisation_url # return the url for the visualisation
             
        except Exception as e: # if an error occurs
            print(f"Error creating visualision: {str(e)}") # print an error message
            traceback.print_exc() # print the traceback, this is used to print the error message and the line of code that caused the error
            plt.close('all') # close all the plots
            return None # return None, so that the visualisation is not created
    return None # return None, so that the visualisation is not created if the model is not a decision tree


def create_model_insights(model_or_pipeline, feature_names, model_type): # for the create model insights, this is a function that is used to create the model insights
    model = model_or_pipeline # set the model to the model or pipeline
    if isinstance(model_or_pipeline, Pipeline): # check if the model or pipeline is a pipeline
        try: # try to set the model to the model in the pipeline
            model = model_or_pipeline.named_steps['model'] # set the model to the model in the pipeline
        except KeyError: # if the model is not found in the pipeline
            print("Error: Could not find 'model' step in the pipeline for insights.") # print an error message
            return {'model_statistics': {}, 'key_features': {}} # return an empty dictionary, so that the model insights are not created

    insights = {} # create an empty dictionary to hold the model insights
    if model_type == 'decision_tree' and isinstance(model, DecisionTreeClassifier): # check if the model type is a decision tree and if the model is a decision tree classifier
        insights['model_statistics'] = { # create a dictionary to hold the model statistics
            'total_nodes': model.tree_.node_count, # set the total nodes to the number of nodes in the tree
            'leaf_nodes': model.tree_.n_leaves, # set the leaf nodes to the number of leaf nodes in the tree
            'max_depth': model.get_depth() # set the max depth to the depth of the tree
        }
        if hasattr(model, 'feature_importances_') and feature_names is not None: # check if the model has feature importances and if the feature names are not None
            if len(feature_names) == len(model.feature_importances_): # check if the length of the feature names is equal to the length of the feature importances
                feature_importance = dict(zip(feature_names, model.feature_importances_)) # create a dictionary to hold the feature importance
                insights['key_features'] = { f: {'importance': imp * 100} for f, imp in feature_importance.items() } # set the key features to the feature importance
            else: # if the length of the feature names is not equal to the length of the feature importances
                print(f"Warning: Mismatch feature_names ({len(feature_names)}) vs importances ({len(model.feature_importances_)}).") # print a warning message
                insights['key_features'] = {} # set the key features to an empty dictionary
        else: # if the model does not have feature importances or the feature names are None
            insights['key_features'] = {} # set the key features to an empty dictionary

    elif model_type == 'knn' and isinstance(model, KNeighborsClassifier): # check if the model type is a knn and if the model is a knn classifier
        insights['model_statistics'] = { 'n_neighbors': model.n_neighbors } # set the model statistics to the number of neighbors
        insights['key_features'] = {} # set the key features to an empty dictionary

    return insights # return the model insights

def create_confusion_matrix(model_or_pipeline, X, y, class_names=None): # for the create confusion matrix, this is a function that is used to create the confusion matrix
    try: # try to create the confusion matrix
        y_pred = model_or_pipeline.predict(X) # predict the y values
        
        cm = confusion_matrix(y, y_pred) # create the confusion matrix
        fig, ax = plt.subplots(figsize=(10, 8)) # create a figure for the confusion matrix
        display_labels = [str(cn) for cn in class_names] if class_names is not None else None # set the display labels to the class names if they are not None
        disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=display_labels) # create the confusion matrix display
        disp.plot(cmap=plt.cm.Blues, ax=ax) # plot the confusion matrix
        plt.title('Confusion Matrix') # set the title of the confusion matrix
        plt.grid(False) # disable the grid
        
        buf = io.BytesIO() # create a buffer to hold the image
        plt.savefig(buf, format='png', bbox_inches='tight') # save the image to the buffer
        plt.close(fig) # close the figure
        buf.seek(0) # seek to the start of the buffer
        encoded_img = base64.b64encode(buf.read()).decode('utf-8') # encode the image to a base64 string
        return encoded_img # return the encoded image
        
    except Exception as e: # if an error occurs
        print(f"ERROR creating confusion matrix: {str(e)}") # print an error message
        traceback.print_exc() # print the traceback, this is used to print the error message and the line of code that caused the error
        plt.close('all') # close all the plots
        return None # return None, so that the confusion matrix is not created

def train_model(data): # for the train model, this is a function that is used to train the model    
    try: # try to train the model
        print("\nStarting Model Training") # print a message to the console, that the model training has started
        validate_input_data(data) # validate the input data

        model_to_evaluate = None # set the model to evaluate to None, this will be updated to the model or pipeline later
        X_train_final = None # set the X train final to None, this will be updated to the X train values later
        X_test_final = None # set the X test final to None, this will be updated to the X test values later
        y_train_actual = None # set the y train actual to None, this will be updated to the y train values later
        y_test_actual = None # set the y test actual to None, this will be updated to the y test values later
        feature_names_for_vis = None # set the feature names for vis to None, this will be updated to the feature names later
        class_names_for_vis = None # set the class names for vis to None, this will be updated to the class names later
        
        if data['dataset'] == 'iris': # check if the dataset is iris
            print("Processing Iris dataset...") # print a message to the console, that the iris dataset is being processed
            iris = load_iris() # load the iris dataset
            selected_features = data['selectedFeatures'] # get the selected features
            if not selected_features: raise ModelError("Iris: At least one feature must be selected") # check if the selected features are not empty
            
            feature_indices = [i for i, name in enumerate(iris.feature_names) if name in selected_features] # get the feature indices
            if not feature_indices: raise ModelError("Iris: None of the selected features exist") # check if the feature indices are not empty
            
            X = iris.data[:, feature_indices] # get the X values
            y = iris.target # get the y values
            feature_names_for_vis = [iris.feature_names[i] for i in feature_indices] # get the feature names for vis
            class_names_for_vis = iris.target_names.tolist() # get the class names for vis

            X_train, X_test, y_train, y_test = train_test_split( # split the data into training and testing sets
                X, y, test_size=data['testSize'], random_state=99, shuffle=True, stratify=y # split the data into training and testing sets, using a random state of 99 (ensures the same split every time the model is trained), shuffling the data (ensures the data is shuffled), and stratifying the data (ensures the same proportion of each class in the training and testing sets)
            )
            
            y_train_actual = y_train # set the y train actual to the y train values
            y_test_actual = y_test # set the y test actual to the y test values
            
            scaler_step = ('scaler', StandardScaler()) # set the scaler step to the standard scaler
            if data['modelType'] == 'decision_tree': # check if the model type is a decision tree   
                model_step = ('model', DecisionTreeClassifier( # set the model step to the decision tree classifier
                    min_samples_split=data.get('minSamplesSplit', 2), # set the min samples split to the min samples split value, or 2 if the min samples split value is not specified
                    random_state=99 # set the random state to 99 (ensures the same split every time the model is trained)
                ))
            elif data['modelType'] == 'knn': # check if the model type is a knn
                model_step = ('model', KNeighborsClassifier( # set the model step to the knn classifier
                    n_neighbors=data.get('nNeighbors', 5) # set the n neighbours to the n neighbours value, or 5 if the n neighbours value is not specified
                ))
            else: # if the model type is not a decision tree or knn
                 raise ModelError("Invalid modelType specified for Iris.") # raise an error if the model type is not a decision tree or knn

            model_to_evaluate = Pipeline([scaler_step, model_step]) # create the model to evaluate
            print(f"Iris: Created pipeline: {model_to_evaluate.steps}") # print a message to the console, that the iris pipeline has been created
            print(f"Fitting {data['modelType']} pipeline on Iris data...") # print a message to the console, that the iris pipeline is being fitted
            model_to_evaluate.fit(X_train, y_train_actual) # fit the model to the training data
            print("Iris: Pipeline fitting complete.") # print a message to the console, that the iris pipeline has been fitted
            print("Iris model fitting complete.") # print a message to the console, that the iris model has been fitted

            X_train_final = X_train # set the X train final to the X train values
            X_test_final = X_test # set the X test final to the X test values

        elif data['dataset'] == 'custom': # check if the dataset is custom
            print("Processing Custom dataset...") # print a message to the console, that the custom dataset is being processed
            validate_custom_dataset(data) # validate the custom dataset
            df = pd.DataFrame(data['customData']) # create a dataframe from the custom data
            
            target_feature_name = data['targetFeature'] # get the target feature name

            corrections = data.get('targetCorrections', {}) # get the target corrections, this is a dictionary that maps old values to new values, particularly for typos in target feature class names
            if corrections and target_feature_name in df.columns: # check if the target feature name is in the dataframe
                df[target_feature_name] = df[target_feature_name].replace(corrections) # replace the target feature name with the corrections

            if target_feature_name not in df.columns: raise ModelError(f"Target '{target_feature_name}' not found.") # check if the target feature name is not in the dataframe, and if it is not, raise an error
            y = df[target_feature_name] # get the y values
            
            selected_features = data['selectedFeatures'] # get the selected features
            if not selected_features: raise ModelError("Custom: At least one feature must be selected") # check if the selected features are not empty, if they are not, raise an error
            valid_selected_features = [f for f in selected_features if f in df.columns and f != target_feature_name] # check if the selected features are valid, if they are not, raise an error
            if not valid_selected_features: raise ModelError("Custom: No valid features selected.") # check if the selected features are valid, if they are not, raise an error
            X = df[valid_selected_features] # get the X values

            if pd.api.types.is_object_dtype(y) or pd.api.types.is_categorical_dtype(y) or pd.api.types.is_bool_dtype(y): # check if the y values are object, categorical or boolean
                 label_encoder = LabelEncoder() # create a label encoder
                 y = label_encoder.fit_transform(y) # fit the label encoder to the y values
                 class_names_for_vis = label_encoder.classes_.astype(str).tolist() # get the class names for vis, which is the classes of the label encoder
            else: # if the y values are not object, categorical or boolean
                 class_names_for_vis = [str(c) for c in np.unique(y)] # get the class names for vis, which is the unique values in the y values
            validate_target_feature(y) # validate the target feature

            X_train, X_test, y_train, y_test = train_test_split( # split the data into training and testing sets
                X, y, test_size=data['testSize'], random_state=99, shuffle=True, stratify=y # split the data into training and testing sets, using a random state of 99 (ensures the same split every time the model is trained), shuffling the data (ensures the data is shuffled), and stratifying the data (ensures the same proportion of each class in the training and testing sets)
            )
            y_train_actual = y_train # set the y train actual to the y train values
            y_test_actual = y_test # set the y test actual to the y test values

            numerical_features = X_train.select_dtypes(include=np.number).columns.tolist() # get the numerical features
            categorical_features = X_train.select_dtypes(include=['object', 'category', 'bool']).columns.tolist() # get the categorical features
            print(f"Custom: Numerical features identified: {numerical_features}") # print a message to the console, that the numerical features have been identified
            print(f"Custom: Categorical features identified: {categorical_features}") # print a message to the console, that the categorical features have been identified

            numerical_pipeline = Pipeline([
                ('imputer', SimpleImputer(strategy='mean')), # impute the missing values with the mean
                ('log_transformer', log_transformer_step), # log transform the outliers
                ('scaler', StandardScaler()) # scale the data
            ])
            categorical_pipeline = Pipeline([
                ('imputer', SimpleImputer(strategy='most_frequent')), # impute the missing values with the most frequent value
                ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False)) # one hot encode the data
            ])
            
            transformers = [] # create a list to hold the transformers
            if numerical_features: transformers.append(('num', numerical_pipeline, numerical_features)) # add the numerical pipeline to the transformers
            if categorical_features: transformers.append(('cat', categorical_pipeline, categorical_features)) # add the categorical pipeline to the transformers
            if not transformers: raise ModelError("Custom: No numerical or categorical features identified.") # check if the transformers are not empty, if they are not, raise an error

            preprocessor = ColumnTransformer(transformers=transformers, remainder='passthrough') # create the preprocessor

            if data['modelType'] == 'decision_tree': # check if the model type is a decision tree
                model = DecisionTreeClassifier( # create the model
                    min_samples_split=data.get('minSamplesSplit', 2), # set the min samples split to the min samples split value, or 2 if the min samples split value is not specified
                    random_state=99 # set the random state to 99 (ensures the same split every time the model is trained)
                )
            elif data['modelType'] == 'knn': # check if the model type is a knn
                model = KNeighborsClassifier(n_neighbors=data.get('nNeighbors', 5)) # create the model
            else: # if the model type is not a decision tree or knn
                 raise ModelError("Invalid modelType specified for Custom pipeline.") # raise an error if the model type is not a decision tree or knn

            model_to_evaluate = Pipeline([('preprocessor', preprocessor), ('model', model)]) # create the model to evaluate
            print(f"Custom: Created pipeline: {model_to_evaluate.steps}") # print a message to the console, that the custom pipeline has been created

            print(f"Fitting {data['modelType']} pipeline on custom data...") # print a message to the console, that the custom pipeline is being fitted
            model_to_evaluate.fit(X_train, y_train_actual) # fit the model to the training data
            print("Custom: Pipeline fitting complete.") # print a message to the console, that the custom pipeline has been fitted
            
            X_train_final = X_train # set the X train final to the X train values
            X_test_final = X_test # set the X test final to the X test values
            try: # try to get the feature names for viz
                preprocessor_fitted = model_to_evaluate.named_steps['preprocessor'] # get the preprocessor fitted
                feature_names_for_vis = preprocessor_fitted.get_feature_names_out() # get the feature names for vis
                feature_names_for_vis = [str(name) for name in feature_names_for_vis] # convert the feature names for vis to a list of strings
                print(f"Custom: Transformed names ({len(feature_names_for_vis)}): {list(feature_names_for_vis)[:15]}...") # print a message to the console, that the transformed feature names have been identified
            except Exception as name_err: # if an error occurs
                print(f"Could not get transformed feature names for custom data: {name_err}") # print an error message to the console, that the transformed feature names could not be identified
                final_estimator = model_to_evaluate.named_steps['model'] # get the final estimator
                if hasattr(final_estimator, 'n_features_in_'): # check if the final estimator has n features in
                     feature_names_for_vis = [f'feature_{i}' for i in range(final_estimator.n_features_in_)] # set the feature names for vis to the feature names in the final estimator

        else: # if the dataset is not custom
            raise ModelError("Invalid dataset type specified") # raise an error if the dataset type is not custom

        if model_to_evaluate is None or X_train_final is None or X_test_final is None: # check if the model to evaluate, X train final or X test final is None
             raise ModelError("Model or processed data is missing before evaluation.") # raise an error if the model to evaluate, X train final or X test final is None
             
        print("Calculating metrics...") # print a message to the console, that the metrics are being calculated
        print(f"Evaluation: Using model/pipeline object of type: {type(model_to_evaluate)}") # print a message to the console, that the model/pipeline object is of the type
        y_train_pred = model_to_evaluate.predict(X_train_final) # predict the y values for the training data
        y_test_pred = model_to_evaluate.predict(X_test_final) # predict the y values for the testing data

        metrics = { # create a dictionary to hold the metrics
            'train': { # create a dictionary to hold the training metrics
                'accuracy': float(accuracy_score(y_train_actual, y_train_pred)), # calculate the accuracy for the training data
                'precision': float(precision_score(y_train_actual, y_train_pred, average='weighted', zero_division=0)), # calculate the precision for the training data
                'recall': float(recall_score(y_train_actual, y_train_pred, average='weighted', zero_division=0)), # calculate the recall for the training data  
                'f1': float(f1_score(y_train_actual, y_train_pred, average='weighted', zero_division=0)) # calculate the f1 score for the training data 
            },
            'test': { # create a dictionary to hold the testing metrics
                'accuracy': float(accuracy_score(y_test_actual, y_test_pred)), # calculate the accuracy for the testing data
                'precision': float(precision_score(y_test_actual, y_test_pred, average='weighted', zero_division=0)), # calculate the precision for the testing data
                'recall': float(recall_score(y_test_actual, y_test_pred, average='weighted', zero_division=0)), # calculate the recall for the testing data
                'f1': float(f1_score(y_test_actual, y_test_pred, average='weighted', zero_division=0)) # calculate the f1 score for the testing data
            }
        }
        
        print("Generating visualisations and insights...") # print a message to the console, that the visualisations and insights are being generated
        visualisation_result = create_visualisation( # create the visualisation
            model_to_evaluate, data['modelType'], # set the model to evaluate and the model type
            feature_names=feature_names_for_vis, # set the feature names for vis
            class_names=class_names_for_vis # set the class names for vis
        )
        
        insights = create_model_insights( # create the insights
            model_to_evaluate, # set the model to evaluate
            feature_names=feature_names_for_vis, # set the feature names for vis
            model_type=data['modelType'] # set the model type
        )
        
        train_cm = create_confusion_matrix(model_to_evaluate, X_train_final, y_train_actual, class_names_for_vis) # create the confusion matrix for the training data
        test_cm = create_confusion_matrix(model_to_evaluate, X_test_final, y_test_actual, class_names_for_vis) # create the confusion matrix for the testing data   
        
        insights['confusion_matrices'] = {'train': train_cm, 'test': test_cm} # set the confusion matrices to the confusion matrices

        print("\nModel Training Complete") # print a message to the console, that the model training has been completed
        
        results = { 'metrics': metrics, 'visualisation_url': visualisation_result, 'insights': insights } # set the results to the metrics, visualisation url and insights
        
        try: # try to encode the results to a json string
            results = json.loads(json.dumps(results, default=str)) # encode the results to a json string
        except Exception as e: # if an error occurs
            print(f"Error encoding response data: {str(e)}") # print an error message to the console, that the response data could not be encoded
            traceback.print_exc() # print the traceback, this is used to print the error message and the line of code that caused the error
            return jsonify({'error': 'Error encoding response data'}), 500 # return an error message to the console, that the response data could not be encoded
        
        print(f"Response includes visualisation: {'visualisation_url' in results and results['visualisation_url'] is not None}") # print a message to the console, that the response includes a visualisation
        return results # return the results
        
    except ModelError as e: # if a model error occurs
         print(f"Model training error: {str(e)}") # print an error message to the console, that the model training error has occurred
         traceback.print_exc() # print the traceback, this is used to print the error message and the line of code that caused the error
         return jsonify({'error': str(e)}), 400 # return an error message to the console, that the model training error has occurred
    except Exception as e: # if an exception occurs
        print(f"Error in train_model: {str(e)}") # print an error message to the console, that the train model error has occurred
        traceback.print_exc() # print the traceback, this is used to print the error message and the line of code that caused the error
        return jsonify({'error': 'An unexpected server error occurred during model training.'}), 500 # return an error message to the console, that the server error has occurred during model training


def register_model_training_routes(app): # this is a function that is used to register the model training routes
    @app.route('/api/train-model', methods=['POST']) # this is a function that is used to handle the train model route
    def handle_train_model_route(): # handler function for the train model API endpoint
        try: # try to get the data
            data = request.get_json() # get the data
            result = train_model(data) # train the model
            return jsonify(result), 200 # return the result
        except ModelError as me: # if a model error occurs
             return jsonify({"error": str(me)}), 400 # return an error message to the console
        except Exception as e: # if an exception occurs
            print(f"Unhandled exception in /api/train-model: {str(e)}") # print an error message to the console, that the unhandled exception has occurred
            traceback.print_exc() # print the traceback, this is used to print the error message and the line of code that caused the error
            return jsonify({"error": "An unexpected server error occurred"}), 500 # return an error message to the console, that the server error has occurred
