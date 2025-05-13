# this script handles model training for both the Iris dataset and custom datasets
# it includes data preprocessing, model training, evaluation, and visualisation

import io
import json
import base64
import traceback
import numpy as np
import pandas as pd
import os
import uuid

# configure matplotlib to use the 'Agg' backend for server-side plotting without a display
import matplotlib 
matplotlib.use('Agg')
import matplotlib.pyplot as plt

from flask import request, jsonify


from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, FunctionTransformer, OneHotEncoder, LabelEncoder # for preprocessing
from sklearn.impute import SimpleImputer # for imputing missing values
from sklearn.compose import ColumnTransformer # for column transformations
from sklearn.pipeline import Pipeline # for pipelines
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, ConfusionMatrixDisplay # for metrics

STATIC_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'static')
VIS_DIR = os.path.join(STATIC_FOLDER, 'visualisations')
os.makedirs(VIS_DIR, exist_ok=True)

# define a model error, initially nothing
class ModelError(Exception):
    pass

# log transform outliers to avoid skewness, making the data more suitable for modeling.
# does this for values extremely above the upper quartile or below the lower quartile
def log_transform_outliers(X):
    X_df = pd.DataFrame(X)
    X_transformed = X_df.copy()
    for col in X_df.columns:
        if pd.api.types.is_numeric_dtype(X_df[col]):
            Q1 = X_df[col].quantile(0.25)
            Q3 = X_df[col].quantile(0.75)
            IQR = Q3 - Q1
            if not np.isclose(IQR, 0):
                lower_bound = Q1 - 1.5 * IQR
                upper_bound = Q3 + 1.5 * IQR
                outliers_mask = (X_df[col] < lower_bound) | (X_df[col] > upper_bound)
                safe_outliers_mask = outliers_mask & (X_df[col] >= 0)
                X_transformed.loc[safe_outliers_mask, col] = np.log1p(X_df.loc[safe_outliers_mask, col])
    return X_transformed.values

# create a transformer step to apply log transformation to outliers in the data
log_transformer_step = FunctionTransformer(
    log_transform_outliers,
    validate=False,
    feature_names_out='one-to-one'
)

# function to ensure the input data contains all required fields and valid values
def validate_input_data(data):
    required_fields = ['dataset', 'modelType', 'testSize']
    
    for field in required_fields:
        if field not in data:
            raise ModelError(f"Missing required field: {field}")
    
    if data['dataset'] not in ['iris', 'custom']:
        raise ModelError("Dataset must be either 'iris' or 'custom'")
    
    if data['modelType'] not in ['decision_tree', 'knn']:
        raise ModelError("Model type must be either 'decision_tree' or 'knn'")
    
    if not 0.1 <= data['testSize'] <= 0.5:
        raise ModelError("Test size must be between 0.1 and 0.5")

    if data['modelType'] == 'knn':
        n_neighbors = data.get('nNeighbors', 5) # specifies the number of nearest data points (neighbors) that the algorithm will consider when making a prediction for a new data point.
        if n_neighbors < 1:
            raise ModelError("Number of neighbors (n_neighbors) must be at least 1.")
    if data['modelType'] == 'decision_tree':
        min_samples_split = data.get('minSamplesSplit', 2) # minimum number of samples required to split an internal node
        if min_samples_split < 2:
            raise ModelError("Minimum samples split (minSamplesSplit) must be at least 2.")

# validate custom datasets
def validate_custom_dataset(data):
    if 'customData' not in data:
        raise ModelError("Custom dataset is required when dataset type is 'custom'")
    
    if not data['customData']:
        raise ModelError("Custom dataset cannot be empty")
    
    if 'targetFeature' not in data:
        raise ModelError("Target feature must be specified for custom dataset")
    
    if 'selectedFeatures' not in data:
        raise ModelError("Selected features must be specified for custom dataset")

# create a visualisation for the decision tree
def create_visualisation(model_or_pipeline, model_type, feature_names=None, class_names=None):
    model_to_plot = model_or_pipeline
    if isinstance(model_or_pipeline, Pipeline):
        try:
            model_to_plot = model_or_pipeline.named_steps['model']
        except KeyError:
            print("Error: Could not find 'model' step in the pipeline for visualisation.")
            return None
            
    # if the model is a decision tree
    if model_type == 'decision_tree' and isinstance(model_to_plot, DecisionTreeClassifier):
        try:
            plt.close('all') # close all existing plots
            fig = plt.figure(figsize=(70, 50), facecolor='white') # create a new figure
            effective_class_names = class_names if class_names is not None else [] # if the class names are not none, use them, otherwise use an empty list
            
            # plot the tree
            plot_tree(model_to_plot,
                  feature_names=feature_names,
                  class_names=effective_class_names,
                  filled=True,
                  rounded=True,
                  fontsize=5,
                  precision=2)
            
            plt.subplots_adjust(left=0.01, right=0.99, top=0.99, bottom=0.01)
            plt.tight_layout(pad=3.0)
            
            # save the plot to a file for viewing
            filename = f"tree_{uuid.uuid4()}.pdf"
            filepath = os.path.join(VIS_DIR, filename)
            
            plt.savefig(filepath, format='pdf', bbox_inches='tight', facecolor='white', edgecolor='none')
            plt.close(fig)
            
            # return the url of the visualisation, so it can be displayed
            visualisation_url = f"/static/visualisations/{filename}"
            print(f"Visualisation saved to: {filepath}")
            print(f"Returning URL: {visualisation_url}")
            return visualisation_url
             
        except Exception as e:
            print(f"Error creating visualision: {str(e)}")
            traceback.print_exc()
            plt.close('all')
            return None
    return None

# create insights for the model, including the statistics and key features
def create_model_insights(model_or_pipeline, feature_names, model_type):
    model = model_or_pipeline
    if isinstance(model_or_pipeline, Pipeline):
        try:
            model = model_or_pipeline.named_steps['model']
        except KeyError:
            print("Error: Could not find 'model' step in the pipeline for insights.")
            return {'model_statistics': {}, 'key_features': {}}

    # store the total nodes, leaf nodes and maximum depth of the model
    insights = {}
    if model_type == 'decision_tree' and isinstance(model, DecisionTreeClassifier):
        insights['model_statistics'] = {
            'total_nodes': model.tree_.node_count,
            'leaf_nodes': model.tree_.n_leaves,
            'max_depth': model.get_depth()
        }
        # if the model has feature importances, store the key features
        if hasattr(model, 'feature_importances_') and feature_names is not None:
            if len(feature_names) == len(model.feature_importances_):
                feature_importance = dict(zip(feature_names, model.feature_importances_))
                insights['key_features'] = { f: {'importance': imp * 100} for f, imp in feature_importance.items() }
            else:
                print(f"Warning: Mismatch feature_names ({len(feature_names)}) vs importances ({len(model.feature_importances_)}).")
                insights['key_features'] = {}
        else:
            insights['key_features'] = {}

    # if the model is a knn, store the number of neighbors
    elif model_type == 'knn' and isinstance(model, KNeighborsClassifier):
        insights['model_statistics'] = { 'n_neighbors': model.n_neighbors }
        insights['key_features'] = {}

    return insights

# create a confusion matrix for the model
def create_confusion_matrix(model_or_pipeline, X, y, class_names=None):
    try:
        y_pred = model_or_pipeline.predict(X) # predict the values
        
        # create the confusion matrix
        cm = confusion_matrix(y, y_pred)
        fig, ax = plt.subplots(figsize=(10, 8))
        display_labels = [str(cn) for cn in class_names] if class_names is not None else None
        disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=display_labels)
        disp.plot(cmap=plt.cm.Blues, ax=ax)
        plt.title('Confusion Matrix')
        plt.grid(False)
        
        # save the plot to a buffer and encode it as a base64 string
        buf = io.BytesIO()
        plt.savefig(buf, format='png', bbox_inches='tight')
        plt.close(fig)
        buf.seek(0)
        encoded_img = base64.b64encode(buf.read()).decode('utf-8')
        return encoded_img
        
    except Exception as e:
        print(f"ERROR creating confusion matrix: {str(e)}")
        traceback.print_exc()
        plt.close('all')
        return None

# train the model
def train_model(data):
    try:
        print("\nStarting Model Training")
        validate_input_data(data)

        # initialise variables
        model_to_evaluate = None
        X_train_final = None
        X_test_final = None
        y_train_actual = None
        y_test_actual = None
        feature_names_for_vis = None
        class_names_for_vis = None
        
        # if the dataset is iris
        if data['dataset'] == 'iris':
            print("Processing Iris dataset...")
            iris = load_iris()
            selected_features = data['selectedFeatures']
            if not selected_features: raise ModelError("Iris: At least one feature must be selected")
            
            # get indices of selected features
            feature_indices = [i for i, name in enumerate(iris.feature_names) if name in selected_features]
            if not feature_indices: raise ModelError("Iris: None of the selected features exist")
            
            # extract features and target
            X = iris.data[:, feature_indices]
            y = iris.target
            feature_names_for_vis = [iris.feature_names[i] for i in feature_indices]
            class_names_for_vis = iris.target_names.tolist()

            # split data into training and testing sets
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=data['testSize'], random_state=99, shuffle=True, stratify=y
            )
            
            y_train_actual = y_train
            y_test_actual = y_test
            
            # set up the model pipeline for reducing data leakage
            scaler_step = ('scaler', StandardScaler()) # standardise the features
            if data['modelType'] == 'decision_tree':
                model_step = ('model', DecisionTreeClassifier(
                    min_samples_split=data.get('minSamplesSplit', 2),
                    random_state=99
                ))
            elif data['modelType'] == 'knn':
                model_step = ('model', KNeighborsClassifier(
                    n_neighbors=data.get('nNeighbors', 5)
                ))
            else:
                 raise ModelError("Invalid modelType specified for Iris.")

            # create the pipeline
            model_to_evaluate = Pipeline([scaler_step, model_step])
            print(f"Iris: Created pipeline: {model_to_evaluate.steps}")
            print(f"Fitting {data['modelType']} pipeline on Iris data...")

            # fit the pipeline
            model_to_evaluate.fit(X_train, y_train_actual)
            print("Iris: Pipeline fitting complete.")
            print("Iris model fitting complete.")

            X_train_final = X_train
            X_test_final = X_test

        # if the dataset is custom
        elif data['dataset'] == 'custom':
            print("Processing Custom dataset...")
            validate_custom_dataset(data)
            df = pd.DataFrame(data['customData'])
            
            target_feature_name = data['targetFeature']

            # if there are target corrections set by the user, apply them
            corrections = data.get('targetCorrections', {})
            if corrections and target_feature_name in df.columns:
                df[target_feature_name] = df[target_feature_name].replace(corrections)

            if target_feature_name not in df.columns: raise ModelError(f"Target '{target_feature_name}' not found.")
            y = df[target_feature_name]
            
            selected_features = data['selectedFeatures']
            if not selected_features: raise ModelError("Custom: At least one feature must be selected")
            valid_selected_features = [f for f in selected_features if f in df.columns and f != target_feature_name]
            if not valid_selected_features: raise ModelError("Custom: No valid features selected.")
            X = df[valid_selected_features]

            # if the target is categorical, encode it
            if pd.api.types.is_object_dtype(y) or pd.api.types.is_categorical_dtype(y) or pd.api.types.is_bool_dtype(y):
                 label_encoder = LabelEncoder()
                 y = label_encoder.fit_transform(y)
                 class_names_for_vis = label_encoder.classes_.astype(str).tolist()
            else:
                 class_names_for_vis = [str(c) for c in np.unique(y)]


            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=data['testSize'], random_state=99, shuffle=True, stratify=y
            )
            y_train_actual = y_train
            y_test_actual = y_test

            numerical_features = X_train.select_dtypes(include=np.number).columns.tolist()
            categorical_features = X_train.select_dtypes(include=['object', 'category', 'bool']).columns.tolist()
            print(f"Custom: Numerical features identified: {numerical_features}")
            print(f"Custom: Categorical features identified: {categorical_features}")

            # define numerical and categortical pipelines
            # including imputation, log transformation and standardisation, as well as one-hot encoding for categorical features
            numerical_pipeline = Pipeline([
                ('imputer', SimpleImputer(strategy='mean')),
                ('log_transformer', log_transformer_step),
                ('scaler', StandardScaler())
            ])
            categorical_pipeline = Pipeline([
                ('imputer', SimpleImputer(strategy='most_frequent')),
                ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
            ])
            
            # set up transformers for numerical and categorical features
            transformers = []
            if numerical_features: transformers.append(('num', numerical_pipeline, numerical_features))
            if categorical_features: transformers.append(('cat', categorical_pipeline, categorical_features))
            if not transformers: raise ModelError("Custom: No numerical or categorical features identified.")

            # create a preprocessor to apply transformations to the features
            preprocessor = ColumnTransformer(transformers=transformers, remainder='passthrough')

            # initialise the model based on the specified type
            if data['modelType'] == 'decision_tree':
                model = DecisionTreeClassifier(
                    min_samples_split=data.get('minSamplesSplit', 2),
                    random_state=99
                )
            elif data['modelType'] == 'knn':
                model = KNeighborsClassifier(n_neighbors=data.get('nNeighbors', 5))
            else:
                 raise ModelError("Invalid modelType specified for Custom pipeline.")

            # create the full pipeline with the model included
            model_to_evaluate = Pipeline([('preprocessor', preprocessor), ('model', model)])
            print(f"Custom: Created pipeline: {model_to_evaluate.steps}")

            print(f"Fitting {data['modelType']} pipeline on custom data...")
            model_to_evaluate.fit(X_train, y_train_actual)
            print("Custom: Pipeline fitting complete.")
            
            X_train_final = X_train
            X_test_final = X_test


            try:
                # get feature names from the fitted preprocessor
                preprocessor_fitted = model_to_evaluate.named_steps['preprocessor']
                feature_names_for_vis = preprocessor_fitted.get_feature_names_out()
                feature_names_for_vis = [str(name) for name in feature_names_for_vis]
                print(f"Custom: Transformed names ({len(feature_names_for_vis)}): {list(feature_names_for_vis)[:15]}...")
            except Exception as name_err:
                print(f"Could not get transformed feature names for custom data: {name_err}")
                final_estimator = model_to_evaluate.named_steps['model']
                if hasattr(final_estimator, 'n_features_in_'):
                     feature_names_for_vis = [f'feature_{i}' for i in range(final_estimator.n_features_in_)]

        else:
            raise ModelError("Invalid dataset type specified")

        if model_to_evaluate is None or X_train_final is None or X_test_final is None:
             raise ModelError("Model or processed data is missing before evaluation.")
             
        # calculate the metrics for the training and testing sets
        print("Calculating metrics...")
        print(f"Evaluation: Using model/pipeline object of type: {type(model_to_evaluate)}")
        y_train_pred = model_to_evaluate.predict(X_train_final)
        y_test_pred = model_to_evaluate.predict(X_test_final)

        # average is weighted to account for class imbalance by averaging
        # zero division avoid errors when dealing with classes that are not predicted at all (which would cause a division by zero)
        metrics = {
            'train': {
                'accuracy': float(accuracy_score(y_train_actual, y_train_pred)),
                'precision': float(precision_score(y_train_actual, y_train_pred, average='weighted', zero_division=0)),
                'recall': float(recall_score(y_train_actual, y_train_pred, average='weighted', zero_division=0)),
                'f1': float(f1_score(y_train_actual, y_train_pred, average='weighted', zero_division=0))
            },
            'test': {
                'accuracy': float(accuracy_score(y_test_actual, y_test_pred)),
                'precision': float(precision_score(y_test_actual, y_test_pred, average='weighted', zero_division=0)),
                'recall': float(recall_score(y_test_actual, y_test_pred, average='weighted', zero_division=0)),
                'f1': float(f1_score(y_test_actual, y_test_pred, average='weighted', zero_division=0))
            }
        }
        
        # create the visualisation and insights
        print("Generating visualisations and insights...")
        visualisation_result = create_visualisation(
            model_to_evaluate, data['modelType'],
            feature_names=feature_names_for_vis,
            class_names=class_names_for_vis
        )
        
        insights = create_model_insights(
            model_to_evaluate,
            feature_names=feature_names_for_vis,
            model_type=data['modelType']
        )
        
        train_cm = create_confusion_matrix(model_to_evaluate, X_train_final, y_train_actual, class_names_for_vis)
        test_cm = create_confusion_matrix(model_to_evaluate, X_test_final, y_test_actual, class_names_for_vis)
        
        insights['confusion_matrices'] = {'train': train_cm, 'test': test_cm}

        print("\nModel Training Complete")
        
        results = { 'metrics': metrics, 'visualisation_url': visualisation_result, 'insights': insights }
        
        # encode the results as a json object
        try:
            results = json.loads(json.dumps(results, default=str))
        except Exception as e:
            print(f"Error encoding response data: {str(e)}")
            traceback.print_exc()
            return jsonify({'error': 'Error encoding response data'}), 500
        
        print(f"Response includes visualisation: {'visualisation_url' in results and results['visualisation_url'] is not None}")
        return results
        
    except ModelError as e:
         print(f"Model training error: {str(e)}")
         traceback.print_exc()
         return jsonify({'error': str(e)}), 400
    except Exception as e:
        print(f"Error in train_model: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': 'An unexpected server error occurred during model training.'}), 500

# register the model training routes
def register_model_training_routes(app):
    @app.route('/api/train-model', methods=['POST'])
    def handle_train_model_route():
        try:
            data = request.get_json()
            result = train_model(data)
            return jsonify(result), 200
        except ModelError as me:
             return jsonify({"error": str(me)}), 400
        except Exception as e:
            print(f"Unhandled exception in /api/train-model: {str(e)}")
            traceback.print_exc()
            return jsonify({"error": "An unexpected server error occurred"}), 500