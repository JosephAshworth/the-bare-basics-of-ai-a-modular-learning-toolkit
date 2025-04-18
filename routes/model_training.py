import io
import json
import base64
import traceback
import logging
import numpy as np
import pandas as pd

# Fix matplotlib threading issues by using the Agg backend (non-interactive)
import matplotlib
matplotlib.use('Agg')  # Must be before any matplotlib.pyplot import
import matplotlib.pyplot as plt

from flask import request, jsonify
import joblib

from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, ConfusionMatrixDisplay

from utils import NumpyEncoder

# Get logger
logger = logging.getLogger("emotion_detector")

class ModelError(Exception):
    """Custom exception for model-related errors"""
    pass

def validate_input_data(data):
    """Validate input data structure and required fields"""
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

def validate_custom_dataset(data):
    """Validate custom dataset structure and content"""
    if 'customData' not in data:
        raise ModelError("Custom dataset is required when dataset type is 'custom'")
    
    if not data['customData']:
        raise ModelError("Custom dataset cannot be empty")
    
    if 'targetFeature' not in data:
        raise ModelError("Target feature must be specified for custom dataset")
    
    if 'selectedFeatures' not in data:
        raise ModelError("Selected features must be specified for custom dataset")

def validate_target_feature(y, max_unique_values=10):
    """Validate that the target feature has appropriate number of unique values."""
    unique_values = np.unique(y)
    if len(unique_values) > max_unique_values:
        raise ModelError(
            f"Target feature has {len(unique_values)} unique values. "
            f"Maximum allowed is {max_unique_values} for classification."
        )

def create_visualisation(model, X, y, model_type, feature_names=None):
    """Create visualisation for decision tree model."""
    try:
        if model_type == 'decision_tree':
            # Make sure to close any existing figures to avoid memory leaks
            plt.close('all')
            
            # Create figure with white background
            fig = plt.figure(figsize=(20, 10), facecolor='white')
            
            plot_tree(model, 
                     feature_names=feature_names,
                     class_names=[str(c) for c in np.unique(y)],
                     filled=True,
                     rounded=True,
                     fontsize=10,
                     precision=2)
            
            plt.tight_layout(pad=1.0)
            
            buf = io.BytesIO()
            plt.savefig(buf, format='png', 
                       bbox_inches='tight',
                       dpi=300,
                       facecolor='white',
                       edgecolor='none')
            plt.close(fig)
            buf.seek(0)
            
            img_str = base64.b64encode(buf.getvalue()).decode('utf-8')
            buf.close()
            
            return img_str
        
        return None
        
    except Exception as e:
        print(f"Error creating visualization: {str(e)}")
        traceback.print_exc()
        plt.close('all')  # Make sure to close all figures in case of error
        return None

def get_model_statistics(model, model_type):
    """Get model-specific statistics."""
    stats = {}
    if model_type == 'decision_tree':
        stats['total_nodes'] = model.tree_.node_count
        stats['leaf_nodes'] = model.tree_.n_leaves
        stats['max_depth'] = model.get_depth()
    return stats

def get_decision_paths(model, feature_names, X):
    """Get human-readable decision paths for decision tree."""
    if not isinstance(model, DecisionTreeClassifier):
        return []
    
    paths = []
    for i in range(len(X)):
        path = []
        # Get decision path for single sample
        node_indicator = model.decision_path(X[i:i+1])
        leaf_id = model.apply(X[i:i+1])[0]
        
        # For a single sample, we only need the first row of the sparse matrix
        node_index = node_indicator.indices[node_indicator.indptr[0]:node_indicator.indptr[1]]
        
        for node_id in node_index:
            if node_id == leaf_id:
                continue
                
            # Get the feature and threshold for this node
            feature_idx = model.tree_.feature[node_id]
            
            # Skip if this is a leaf node (feature_idx will be -2)
            if feature_idx < 0:
                continue
                
            threshold = model.tree_.threshold[node_id]
            
            # Ensure feature_idx is within bounds of feature_names
            if feature_idx < len(feature_names):
                feature_name = feature_names[feature_idx]
            else:
                feature_name = f"feature_{feature_idx}"
            
            # Determine if this is a left or right child
            if X[i, feature_idx] <= threshold:
                path.append(f"If {feature_name} ≤ {threshold:.2f}")
            else:
                path.append(f"If {feature_name} > {threshold:.2f}")
        
        paths.append(path)
    return paths

def create_partial_dependence_plot_display(model, X, feature_names, feature_idx, unique_classes):
    """Create partial dependence plots using manual calculation."""
    try:
        print(f"DEBUG: Creating PDP for feature {feature_idx}: {feature_names[feature_idx]} using manual calculation")
        
        # Get class names from iris dataset if using iris
        class_names = None
        try:
            from sklearn.datasets import load_iris
            iris = load_iris()
            if len(unique_classes) == len(iris.target_names):
                class_names = iris.target_names
                print(f"Using iris class names: {class_names}")
        except:
            print("Not using iris dataset or couldn't load iris class names")
        
        # Make sure to close any existing figures
        plt.close('all')
        
        # Create new figure with white background
        fig = plt.figure(figsize=(10, 6), facecolor='white')
        
        # Make sure X is a numpy array for indexing
        if not isinstance(X, np.ndarray):
            X = X.to_numpy()
        
        # Create a grid of feature values to evaluate - use more points for smoother curves
        feature_min = np.nanmin(X[:, feature_idx])
        feature_max = np.nanmax(X[:, feature_idx])
        
        # If the range is too small, expand it slightly to avoid issues
        if np.isclose(feature_min, feature_max):
            feature_min = feature_min - 0.1
            feature_max = feature_max + 0.1
            print(f"Warning: Feature {feature_names[feature_idx]} has very small range. Expanded to [{feature_min}, {feature_max}]")
        
        # Expand the range slightly beyond min and max for better visualization
        padding = (feature_max - feature_min) * 0.05
        feature_min = max(0, feature_min - padding)  # Don't go below 0 for physical measurements
        feature_max = feature_max + padding
        
        # Create more points for smoother curves
        feature_grid = np.linspace(feature_min, feature_max, num=100)
        
        # Colors for different classes
        colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', 
                 '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']
        
        # Create sample batches to avoid memory issues with large datasets
        n_samples = min(1000, len(X))
        sample_indices = np.random.choice(len(X), n_samples, replace=False if len(X) >= n_samples else True)
        X_sample = X[sample_indices]
        
        # For each class, calculate and plot PDP
        for i, target_class in enumerate(unique_classes):
            # Get the class position
            class_position = np.where(model.classes_ == target_class)[0][0]
            
            # Get appropriate label for the class
            if class_names is not None and i < len(class_names):
                class_label = class_names[i]
            else:
                class_label = f"Class {target_class}"
            
            # Calculate PDP values manually using sampling approach
            pdp_values = []
            for grid_value in feature_grid:
                # Create multiple copies with the feature value set
                X_modified = X_sample.copy()
                X_modified[:, feature_idx] = grid_value
                
                # Get probabilities for all samples
                y_pred_proba = model.predict_proba(X_modified)
                
                # Average probability across samples
                avg_proba = np.mean(y_pred_proba[:, class_position])
                pdp_values.append(avg_proba)
            
            # Apply slight smoothing for better visualization - 3-point moving average
            if len(pdp_values) > 3:
                smoothed_values = np.convolve(pdp_values, np.ones(3)/3, mode='same')
                # Keep endpoints unchanged
                smoothed_values[0] = pdp_values[0]
                smoothed_values[-1] = pdp_values[-1]
                pdp_values = smoothed_values
            
            # Plot line for this class
            plt.plot(feature_grid, pdp_values, 
                    color=colors[i % len(colors)], 
                    linewidth=2, 
                    label=class_label)
        
        # Customize the plot
        plt.xlabel(feature_names[feature_idx], fontsize=12, fontweight='bold')
        plt.ylabel('Predicted Probability', fontsize=12, fontweight='bold')
        plt.title(f'Partial Dependence Plot for {feature_names[feature_idx]}', fontsize=14, fontweight='bold', pad=20)
        plt.grid(True, alpha=0.3, linestyle='--')
        plt.legend(loc='best', frameon=True, framealpha=0.9, fontsize=10)
        
        # Ensure y-axis has reasonable limits
        plt.ylim(0, 1)
        
        # Add a light background color to the plot area
        plt.gca().set_facecolor('#f8f9fa')
        
        # Add a border to the plot
        for spine in plt.gca().spines.values():
            spine.set_linewidth(1.5)
            spine.set_color('#dee2e6')
        
        # Add tight layout
        plt.tight_layout()
        
        # Save the figure to a BytesIO buffer
        buf = io.BytesIO()
        plt.savefig(buf, format='png', dpi=300, bbox_inches='tight', facecolor='white')
        buf.seek(0)
        
        # Encode to base64
        encoded_img = base64.b64encode(buf.getvalue()).decode('utf-8')
        
        # Close the figure and buffer
        plt.close(fig)  # Close specific figure
        plt.close('all')  # Also close all other figures just to be safe
        buf.close()
        
        print(f"DEBUG: Created PDP image of size: {len(encoded_img)} bytes")
        return encoded_img
        
    except Exception as e:
        print(f"ERROR creating PDP for feature {feature_names[feature_idx]}: {str(e)}")
        traceback.print_exc()
        plt.close('all')  # Make sure to close all figures in case of error
        return None

def create_model_insights(model, X, y, feature_names, model_type):
    """Create model insights including statistics and feature importance."""
    insights = {}
    
    # Get model statistics
    if model_type == 'decision_tree':
        insights['model_statistics'] = {
            'total_nodes': model.tree_.node_count,
            'leaf_nodes': model.tree_.n_leaves,
            'max_depth': model.get_depth()
        }
    elif model_type == 'knn':
        insights['model_statistics'] = {
            'n_neighbors': model.n_neighbors,
            'algorithm': model.algorithm,
            'metric': model.metric
        }
    
    # Get feature importance
    if hasattr(model, 'feature_importances_'):
        feature_importance = dict(zip(feature_names, model.feature_importances_))
        insights['key_features'] = {
            feature: {'importance': importance * 100}
            for feature, importance in feature_importance.items()
        }
    
    return insights

def create_confusion_matrix(model, X, y, class_names=None):
    """Create a confusion matrix visualization for the model's predictions."""
    try:
        # Predict classes for the input data
        y_pred = model.predict(X)
        
        # Compute the confusion matrix
        cm = confusion_matrix(y, y_pred)
        
        # Create the confusion matrix display
        fig, ax = plt.subplots(figsize=(10, 8))
        disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=class_names)
        disp.plot(cmap=plt.cm.Blues, ax=ax)
        plt.title('Confusion Matrix')
        plt.grid(False)
        
        # Save figure to a binary stream
        buf = io.BytesIO()
        plt.savefig(buf, format='png', bbox_inches='tight')
        plt.close(fig)
        buf.seek(0)
        
        # Encode the image
        encoded_img = base64.b64encode(buf.read()).decode('utf-8')
        return encoded_img
        
    except Exception as e:
        print(f"ERROR creating confusion matrix: {str(e)}")
        traceback.print_exc()
        plt.close('all')  # Make sure to close all figures in case of error
        return None

def train_model():
    try:
        data = request.json
        print("\n=== Starting Model Training ===")
        
        # Validate input data structure
        validate_input_data(data)
        
        # Load and validate dataset
        if data['dataset'] == 'iris':
            iris = load_iris()
            
            # Only include selected features (not marked for discard)
            selected_features = data['selectedFeatures']
            print(f"Using {len(selected_features)} selected features out of {len(iris.feature_names)} total features")
            print(f"Selected features: {selected_features}")
            
            # Make sure we have at least one feature selected
            if len(selected_features) == 0:
                raise ModelError("At least one feature must be selected for training")
            
            # Get indices of selected features
            feature_indices = [i for i, feature in enumerate(iris.feature_names) if feature in selected_features]
            
            # Select only the requested features
            X = pd.DataFrame(iris.data[:, feature_indices], columns=[iris.feature_names[i] for i in feature_indices])
            y = iris.target
            feature_names = [iris.feature_names[i] for i in feature_indices]
            target_names = iris.target_names  # Get actual class names
            
            # Convert to numpy arrays and split the data
            X_np = X.to_numpy()
            X_train, X_test, y_train, y_test = train_test_split(
                X_np, y, test_size=data['testSize'], random_state=42
            )
            
            # Scale features
            scaler = StandardScaler()
            X_train = scaler.fit_transform(X_train)
            X_test = scaler.transform(X_test)
        else:
            validate_custom_dataset(data)
            df = pd.DataFrame(data['customData'])
            y = df[data['targetFeature']]
            validate_target_feature(y)
            
            # Only include features that were selected (not marked for discard)
            selected_features = data['selectedFeatures']
            print(f"Using {len(selected_features)} selected features out of {len(df.columns) - 1} total features (excluding target)")
            print(f"Selected features: {selected_features}")
            
            # Make sure we have at least one feature selected
            if len(selected_features) == 0:
                raise ModelError("At least one feature must be selected for training")
                
            X = df[selected_features]
            feature_names = selected_features
            target_names = None  # No predefined class names for custom datasets
            
            # Detect and encode categorical features
            categorical_features = []
            for col in X.columns:
                # Check if column contains string values or boolean
                if X[col].dtype == 'object' or X[col].dtype == 'bool':
                    categorical_features.append(col)
                    
            print(f"Detected categorical features: {categorical_features}")
            
            # Create a preprocessor for categorical data
            if categorical_features:
                from sklearn.compose import ColumnTransformer
                from sklearn.preprocessing import OneHotEncoder
                
                # Create transformers for categorical features
                categorical_transformer = OneHotEncoder(handle_unknown='ignore')
                
                # Create column transformer
                preprocessor = ColumnTransformer(
                    transformers=[
                        ('cat', categorical_transformer, categorical_features)
                    ],
                    remainder='passthrough'
                )
                
                # Fit and transform the data
                X_processed = preprocessor.fit_transform(X)
                
                # Get feature names after transformation
                if hasattr(preprocessor, 'get_feature_names_out'):
                    # For sklearn 1.0+
                    transformed_feature_names = preprocessor.get_feature_names_out()
                else:
                    # Manually create feature names
                    transformed_feature_names = []
                    # Add names for categorical features (one-hot encoded)
                    for cat_feat in categorical_features:
                        unique_values = X[cat_feat].unique()
                        for val in unique_values:
                            transformed_feature_names.append(f"{cat_feat}_{val}")
                    # Add names for numerical features
                    for col in X.columns:
                        if col not in categorical_features:
                            transformed_feature_names.append(col)
                            
                print(f"Transformed data with shape: {X_processed.shape}")
                print(f"Transformed feature names: {transformed_feature_names[:10]}...")
                
                # Update X to use processed data
                from scipy.sparse import issparse
                if issparse(X_processed):
                    X_processed = X_processed.toarray()
                X = pd.DataFrame(X_processed)
            
            # Convert to numpy arrays before splitting
            X_np = X.to_numpy()
            
            # Make sure target is also properly encoded if categorical
            if y.dtype == 'object' or y.dtype == 'bool':
                from sklearn.preprocessing import LabelEncoder
                label_encoder = LabelEncoder()
                y = label_encoder.fit_transform(y)
                
            print(f"Dataset loaded: {len(X)} samples, {len(feature_names)} features")
            
            # Split and scale the data
            X_train, X_test, y_train, y_test = train_test_split(
                X_np, y, test_size=data['testSize'], random_state=42
            )
            
            # Scale features if needed
            scaler = StandardScaler()
            X_train = scaler.fit_transform(X_train)
            X_test = scaler.transform(X_test)
        
        print(f"Data split and scaled: train={X_train.shape}, test={X_test.shape}")
        
        # Train model
        if data['modelType'] == 'decision_tree':
            # Create a more nuanced decision tree that's not too simple and not too complex
            max_depth = data.get('max_depth', 5)  # Use provided max_depth or default to 5
            
            # For very small datasets, ensure we don't overfit
            if X_train.shape[0] < 50:
                max_depth = min(max_depth, 3)
                
            model = DecisionTreeClassifier(
                min_samples_split=data['minSamplesSplit'],
                max_depth=max_depth,              # Limit tree depth for better generalization
                min_samples_leaf=2,               # Require at least 2 samples in leaf nodes
                random_state=42
            )
            model.fit(X_train, y_train)
            
            # Log model properties
            print(f"Decision tree depth: {model.get_depth()}, nodes: {model.tree_.node_count}")
        else:
            model = KNeighborsClassifier(
                n_neighbors=data['nNeighbors'],
                n_jobs=-1
            )
            model.fit(X_train, y_train)
        
        print(f"Training {data['modelType']} model...")
        print("Model training completed")
        
        # Calculate metrics
        metrics = {
            'train': {
                'accuracy': float(accuracy_score(y_train, model.predict(X_train))),
                'precision': float(precision_score(y_train, model.predict(X_train), average='weighted')),
                'recall': float(recall_score(y_train, model.predict(X_train), average='weighted')),
                'f1': float(f1_score(y_train, model.predict(X_train), average='weighted'))
            },
            'test': {
                'accuracy': float(accuracy_score(y_test, model.predict(X_test))),
                'precision': float(precision_score(y_test, model.predict(X_test), average='weighted')),
                'recall': float(recall_score(y_test, model.predict(X_test), average='weighted')),
                'f1': float(f1_score(y_test, model.predict(X_test), average='weighted'))
            }
        }
        
        # Generate visualization if it's a decision tree
        visualization = None
        if data['modelType'] == 'decision_tree':
            visualization = create_visualisation(model, X, y, data['modelType'], feature_names)
        
        # Generate model insights
        insights = create_model_insights(model, X, y, feature_names, data['modelType'])
        
        # Generate confusion matrices for train and test sets
        train_cm = create_confusion_matrix(model, X_train, y_train, target_names)
        test_cm = create_confusion_matrix(model, X_test, y_test, target_names)
        
        # Add confusion matrices to insights
        insights['confusion_matrices'] = {
            'train': train_cm,
            'test': test_cm
        }
        
        # Get decision paths for decision tree
        if data['modelType'] == 'decision_tree':
            # Limit the number of samples to avoid overwhelming the response
            max_samples = min(10, len(X_train))
            sample_indices = np.random.choice(len(X_train), max_samples, replace=False)
            X_train_sample = X_train[sample_indices]
            insights['decision_path'] = get_decision_paths(model, feature_names, X_train_sample)
        
        # Generate partial dependence plots
        insights['partial_dependence_plots'] = {}
        insights['pdp_explanations'] = {}
        
        print("\n=== Generating Partial Dependence Plots ===")
        print(f"Number of features: {len(feature_names)}")
        print(f"Feature names: {feature_names}")
        
        # Get unique classes
        unique_classes = np.unique(y)
        print(f"Number of classes: {len(unique_classes)}")
        
        # Make sure X is a numpy array for indexing
        if not isinstance(X, np.ndarray):
            X = X.to_numpy()
            
        # Check data dimensions
        print(f"X shape: {X.shape}")
        if X.shape[1] < len(feature_names):
            print(f"WARNING: X has {X.shape[1]} columns but there are {len(feature_names)} feature names")
            # Adjust feature_names to match the actual data
            feature_names = feature_names[:X.shape[1]]
        
        # Generate PDPs only for numerical features
        pdp_features = []
        for i, feature in enumerate(feature_names):
            # Skip if i is out of bounds for X
            if i >= X.shape[1]:
                print(f"Skipping feature {feature} (index {i}) as it's out of bounds for X with shape {X.shape}")
                continue
                
            # Check if feature is numerical
            if np.issubdtype(X[:, i].dtype, np.number):
                pdp_features.append((i, feature))
            else:
                print(f"Skipping non-numeric feature {feature} with dtype {X[:, i].dtype}")
                
        print(f"Will generate PDPs for {len(pdp_features)} numerical features")
        
        # Process each suitable feature
        for feature_idx, feature_name in pdp_features:
            try:
                print(f"\nProcessing feature {feature_idx}: {feature_name}")
                
                # Generate the partial dependence plot
                pdp_plot = create_partial_dependence_plot_display(model, X, feature_names, feature_idx, unique_classes)
                
                if pdp_plot is not None:
                    print(f"Successfully generated PDP for {feature_name}")
                    insights['partial_dependence_plots'][feature_name] = pdp_plot
                    
                    # Generate explanations for each class
                    class_explanations = {}
                    
                    # Create a new figure for analysis only (not for display)
                    feature_min = np.nanmin(X[:, feature_idx])
                    feature_max = np.nanmax(X[:, feature_idx])
                    
                    # If range is too small, expand it
                    if np.isclose(feature_min, feature_max):
                        feature_min = feature_min - 0.1
                        feature_max = feature_max + 0.1
                        
                    feature_grid = np.linspace(feature_min, feature_max, num=50)
                    
                    for class_idx, target_class in enumerate(unique_classes):
                        # Calculate PDP values manually for analysis
                        pdp_values = []
                        try:
                            for grid_value in feature_grid:
                                X_modified = X.copy()
                                X_modified[:, feature_idx] = grid_value
                                y_pred_proba = model.predict_proba(X_modified)
                                class_position = np.where(model.classes_ == target_class)[0][0]
                                avg_proba = np.mean(y_pred_proba[:, class_position])
                                pdp_values.append(avg_proba)
                        except Exception as e:
                            print(f"Error calculating PDP values for class {target_class}: {str(e)}")
                            pdp_values = []
                        
                        # Skip if we couldn't calculate values
                        if not pdp_values:
                            class_explanations[f"class_{target_class}"] = (
                                f"Unable to calculate partial dependence for this feature and class."
                            )
                            continue
                        
                        # Calculate statistics for explanation
                        mean_effect = np.mean(pdp_values)
                        std_effect = np.std(pdp_values)
                        max_effect = np.max(pdp_values)
                        min_effect = np.min(pdp_values)
                        
                        # Detect if there's meaningful variation in the values
                        has_variation = std_effect > 0.01
                        
                        # Find effect direction: where is the maximum effect?
                        max_idx = np.argmax(pdp_values)
                        min_idx = np.argmin(pdp_values)
                        
                        # Calculate relative position (0 to 1) of max and min
                        max_pos = max_idx / (len(feature_grid) - 1)
                        min_pos = min_idx / (len(feature_grid) - 1)
                        
                        # Determine feature value at max effect
                        feature_at_max = feature_grid[max_idx]
                        
                        # Direction descriptions
                        if max_pos < 0.3:
                            direction = "lower"
                        elif max_pos > 0.7:
                            direction = "higher"
                        else:
                            direction = "moderate"
                            
                        # Get class name for explanations
                        if target_names is not None and class_idx < len(target_names):
                            class_name = target_names[class_idx]
                        else:
                            class_name = f"Class {target_class}"
                        
                        # Create a more meaningful explanation based on the pattern
                        if not has_variation:
                            if mean_effect > 0.9:
                                pattern_text = f"This class is consistently predicted with high probability across all values of {feature_name}."
                            elif mean_effect < 0.1:
                                pattern_text = f"This class is consistently not predicted across all values of {feature_name}."
                            else:
                                pattern_text = f"This feature has little influence on predicting this class, showing a consistent effect."
                        else:
                            effect_range = max_effect - min_effect
                            if effect_range > 0.5:
                                strength = "strong"
                            elif effect_range > 0.2:
                                strength = "moderate"
                            else:
                                strength = "slight"
                                
                            pattern_text = (
                                f"This feature has a {strength} influence on predicting this class. "
                                f"The highest probability ({max_effect:.2f}) occurs at {direction} values "
                                f"(around {feature_at_max:.2f})."
                            )
                        
                        class_explanations[f"class_{target_class}"] = (
                            f"For {class_name}, the average effect is {mean_effect:.2f} "
                            f"with a standard deviation of {std_effect:.2f}. "
                            f"The effect ranges from {min_effect:.2f} to {max_effect:.2f}. "
                            f"{pattern_text}"
                        )
                    
                    insights['pdp_explanations'][feature_name] = class_explanations
                else:
                    print(f"Failed to generate PDP for {feature_name}")
                    insights['pdp_explanations'][feature_name] = {
                        f"class_{target_class}": (
                            f"Unable to generate partial dependence plot for {feature_name}. "
                            f"This might be due to the feature type or model limitations."
                        ) for target_class in unique_classes
                    }
            except Exception as e:
                print(f"Error processing feature {feature_name}: {str(e)}")
                traceback.print_exc()  # Print full traceback
                insights['pdp_explanations'][feature_name] = {
                    f"class_{target_class}": (
                        f"Unable to generate partial dependence plot for {feature_name}. "
                        f"This might be due to the feature type or model limitations."
                    ) for target_class in unique_classes
                }
        
        print(f"\n=== PDP Generation Complete ===")
        print(f"Successfully generated PDPs for {len(insights['partial_dependence_plots'])} features")
        
        # Debug check for PDPs
        if len(insights['partial_dependence_plots']) > 0:
            print(f"First PDP image size: {len(list(insights['partial_dependence_plots'].values())[0])} bytes")
            first_pdp_key = list(insights['partial_dependence_plots'].keys())[0]
            print(f"First PDP key: {first_pdp_key}")
            print(f"First few characters: {insights['partial_dependence_plots'][first_pdp_key][:50]}...")
        else:
            print("WARNING: No PDP plots were generated!")
        
        print("\n=== Model Training Complete ===")
        
        # Prepare response
        response_data = {
            'metrics': metrics,
            'visualization': visualization,
            'insights': insights
        }
        
        # Convert any remaining NumPy types to Python native types
        try:
            response_data = json.loads(json.dumps(response_data, cls=NumpyEncoder))
        except Exception as e:
            print(f"Error encoding response data: {str(e)}")
            traceback.print_exc()
            return jsonify({'error': 'Error encoding response data'}), 500
        
        print("\n=== Model Training Complete ===")
        print(f"Response includes visualization: {'visualization' in response_data}")
        
        return jsonify(response_data)
        
    except Exception as e:
        print(f"Error in train_model: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

def explain_tree():
    try:
        data = request.get_json()
        model_path = data.get('model_path')
        explainer_path = data.get('explainer_path')
        
        if not model_path or not explainer_path:
            return jsonify({'error': 'Model or explainer path not provided'}), 400
            
        # Load the model and explainer
        model = joblib.load(model_path)
        explainer = joblib.load(explainer_path)
        
        # Get feature names from the explainer
        feature_names = explainer.feature_names
        
        # Generate feature importance
        feature_importance = dict(zip(feature_names, model.feature_importances_))
        
        # Create model insights
        insights = create_model_insights(model, None, None, feature_names, 'decision_tree')
        
        return jsonify({
            'model_statistics': insights['model_statistics'],
            'key_features': insights['key_features']
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def register_model_training_routes(app):
    """Register all model training routes with the app"""
    app.route('/api/train-model', methods=['POST'])(train_model)
    app.route('/api/explain-tree', methods=['POST'])(explain_tree) 