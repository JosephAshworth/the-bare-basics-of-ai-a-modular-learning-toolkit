import os
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
            threshold = model.tree_.threshold[node_id]
            feature_name = feature_names[feature_idx]
            
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
        print(f"DEBUG: Creating PDP for feature {feature_names[feature_idx]} using manual calculation")
        
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
        
        # Create a grid of feature values to evaluate
        feature_min = X[:, feature_idx].min()
        feature_max = X[:, feature_idx].max()
        feature_grid = np.linspace(feature_min, feature_max, num=50)
        
        # Colors for different classes
        colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', 
                 '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']
        
        # For each class, calculate and plot PDP
        for i, target_class in enumerate(unique_classes):
            # Get the class position
            class_position = np.where(model.classes_ == target_class)[0][0]
            
            # Get appropriate label for the class
            if class_names is not None and i < len(class_names):
                class_label = class_names[i]
            else:
                class_label = f"Class {target_class}"
            
            # Calculate PDP values manually
            pdp_values = []
            for grid_value in feature_grid:
                X_modified = X.copy()
                X_modified[:, feature_idx] = grid_value
                y_pred_proba = model.predict_proba(X_modified)
                avg_proba = np.mean(y_pred_proba[:, class_position])
                pdp_values.append(avg_proba)
            
            # Plot line for this class
            plt.plot(feature_grid, pdp_values, 
                    color=colors[i % len(colors)], 
                    linewidth=2, 
                    label=class_label)
        
        # Customize the plot
        plt.xlabel(feature_names[feature_idx], fontsize=12, fontweight='bold')
        plt.ylabel('Partial Dependence', fontsize=12, fontweight='bold')
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
            X = pd.DataFrame(iris.data, columns=iris.feature_names)
            y = iris.target
            feature_names = iris.feature_names
            target_names = iris.target_names  # Get actual class names
        else:
            validate_custom_dataset(data)
            df = pd.DataFrame(data['customData'])
            y = df[data['targetFeature']]
            validate_target_feature(y)
            X = df[data['selectedFeatures']]
            feature_names = data['selectedFeatures']
            target_names = None  # No predefined class names for custom datasets
        
        print(f"Dataset loaded: {len(X)} samples, {len(feature_names)} features")
        
        # Split and scale the data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=data['testSize'], random_state=42
        )
        
        # Convert to numpy arrays before scaling to avoid feature names warning
        X_train_np = X_train.to_numpy()
        X_test_np = X_test.to_numpy()
        
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train_np)
        X_test_scaled = scaler.transform(X_test_np)
        
        print(f"Data split and scaled: train={X_train_scaled.shape}, test={X_test_scaled.shape}")
        
        # Train model
        if data['modelType'] == 'decision_tree':
            model = DecisionTreeClassifier(
                min_samples_split=data['minSamplesSplit'],
                random_state=42
            )
            model.fit(X_train_scaled, y_train)
        else:
            model = KNeighborsClassifier(
                n_neighbors=data['nNeighbors'],
                n_jobs=-1
            )
            model.fit(X_train_scaled, y_train)
        
        print(f"Training {data['modelType']} model...")
        print("Model training completed")
        
        # Calculate metrics
        metrics = {
            'train': {
                'accuracy': float(accuracy_score(y_train, model.predict(X_train_scaled))),
                'precision': float(precision_score(y_train, model.predict(X_train_scaled), average='weighted')),
                'recall': float(recall_score(y_train, model.predict(X_train_scaled), average='weighted')),
                'f1': float(f1_score(y_train, model.predict(X_train_scaled), average='weighted'))
            },
            'test': {
                'accuracy': float(accuracy_score(y_test, model.predict(X_test_scaled))),
                'precision': float(precision_score(y_test, model.predict(X_test_scaled), average='weighted')),
                'recall': float(recall_score(y_test, model.predict(X_test_scaled), average='weighted')),
                'f1': float(f1_score(y_test, model.predict(X_test_scaled), average='weighted'))
            }
        }
        
        # Generate visualization if it's a decision tree
        visualization = None
        if data['modelType'] == 'decision_tree':
            visualization = create_visualisation(model, X, y, data['modelType'], feature_names)
        
        # Generate model insights
        insights = create_model_insights(model, X_train_scaled, y_train, feature_names, data['modelType'])
        
        # Generate confusion matrices for train and test sets
        train_cm = create_confusion_matrix(model, X_train_scaled, y_train, target_names)
        test_cm = create_confusion_matrix(model, X_test_scaled, y_test, target_names)
        
        # Add confusion matrices to insights
        insights['confusion_matrices'] = {
            'train': train_cm,
            'test': test_cm
        }
        
        # Get decision paths for decision tree
        if data['modelType'] == 'decision_tree':
            # Limit the number of samples to avoid overwhelming the response
            max_samples = min(10, len(X_train_scaled))
            sample_indices = np.random.choice(len(X_train_scaled), max_samples, replace=False)
            X_train_sample = X_train_scaled[sample_indices]
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
        
        for i, feature in enumerate(feature_names):
            try:
                print(f"\nProcessing feature {i}: {feature}")
                
                # Generate the partial dependence plot
                pdp_plot = create_partial_dependence_plot_display(model, X_train_scaled, feature_names, i, unique_classes)
                
                if pdp_plot is not None:
                    print(f"Successfully generated PDP for {feature}")
                    insights['partial_dependence_plots'][feature] = pdp_plot
                    
                    # Generate explanations for each class
                    class_explanations = {}
                    
                    # Create a new figure for analysis only (not for display)
                    feature_min = X_train_scaled[:, i].min()
                    feature_max = X_train_scaled[:, i].max()
                    feature_grid = np.linspace(feature_min, feature_max, num=50)
                    
                    for class_idx, target_class in enumerate(unique_classes):
                        # Calculate PDP values manually for analysis
                        pdp_values = []
                        for grid_value in feature_grid:
                            X_modified = X_train_scaled.copy()
                            X_modified[:, i] = grid_value
                            y_pred_proba = model.predict_proba(X_modified)
                            class_position = np.where(model.classes_ == target_class)[0][0]
                            avg_proba = np.mean(y_pred_proba[:, class_position])
                            pdp_values.append(avg_proba)
                        
                        # Calculate statistics for explanation
                        mean_effect = np.mean(pdp_values)
                        std_effect = np.std(pdp_values)
                        max_effect = np.max(pdp_values)
                        min_effect = np.min(pdp_values)
                        
                        # Find effect direction: where is the maximum effect?
                        max_idx = np.argmax(pdp_values)
                        direction = "higher" if max_idx > len(feature_grid) // 2 else "lower"
                        
                        # Get class name for explanations
                        if target_names is not None and class_idx < len(target_names):
                            class_name = target_names[class_idx]
                        else:
                            class_name = f"Class {target_class}"
                        
                        class_explanations[f"class_{target_class}"] = (
                            f"For {class_name}, the average effect is {mean_effect:.2f} "
                            f"with a standard deviation of {std_effect:.2f}. "
                            f"The effect ranges from {min_effect:.2f} to {max_effect:.2f}. "
                            f"The strongest effect appears at {direction} values of {feature}."
                        )
                    
                    insights['pdp_explanations'][feature] = class_explanations
                else:
                    print(f"Failed to generate PDP for {feature}")
                    insights['pdp_explanations'][feature] = {
                        f"class_{target_class}": (
                            f"Unable to generate partial dependence plot for {feature}. "
                            f"This might be due to the feature type or model limitations."
                        ) for target_class in unique_classes
                    }
            except Exception as e:
                print(f"Error processing feature {feature}: {str(e)}")
                traceback.print_exc()  # Print full traceback
                insights['pdp_explanations'][feature] = {
                    f"class_{target_class}": (
                        f"Unable to generate partial dependence plot for {feature}. "
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