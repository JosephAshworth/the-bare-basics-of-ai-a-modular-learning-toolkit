#!/usr/bin/env python
import os
import sys
import shutil
import subprocess
import logging
import glob

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("render_setup")

def setup_models():
    """Download and set up models in the correct location for Render"""
    logger.info("Setting up models for Render deployment...")
    
    # Create the saved_models directory in both potential locations
    base_dir = os.path.dirname(os.path.abspath(__file__))
    models_dir = os.path.join(base_dir, "saved_models")
    os.makedirs(models_dir, exist_ok=True)
    
    # The path where the app will look for models on Render
    render_models_dir = "/opt/render/project/src/saved_models"
    os.makedirs(render_models_dir, exist_ok=True)
    
    # Run the model download script
    logger.info("Downloading models...")
    try:
        subprocess.check_call([sys.executable, os.path.join(base_dir, "routes", "download_models.py")])
        logger.info("Models downloaded successfully")
    except subprocess.CalledProcessError as e:
        logger.error(f"Error downloading models: {e}")
        return False
    
    # Debug: Log all model directories 
    logger.info("Investigating downloaded model directories...")
    for root, dirs, files in os.walk(base_dir):
        if "saved_models" in root:
            logger.info(f"Found saved_models directory: {root}")
            if dirs:
                logger.info(f"  Subdirectories: {dirs}")
            if files:
                logger.info(f"  Files: {files}")
    
    # Check all possible model locations
    possible_model_paths = [
        models_dir,
        os.path.join(base_dir, "backend", "saved_models"),
        "/opt/render/project/src/backend/saved_models"
    ]
    
    source_model_dir = None
    for path in possible_model_paths:
        if os.path.exists(path):
            logger.info(f"Found models at: {path}")
            # Check for face_emotion_model subdirectory
            if os.path.exists(os.path.join(path, "face_emotion_model")):
                logger.info(f"Face emotion model found in {path}")
                source_model_dir = path
                break
    
    if not source_model_dir:
        logger.error("Could not find face_emotion_model in any of the expected locations")
        # Try to find any directory containing saved models
        all_model_dirs = glob.glob(f"{base_dir}/**/saved_models", recursive=True)
        logger.info(f"All found saved_models directories: {all_model_dirs}")
        
        # If we found any, use the first one
        if all_model_dirs:
            source_model_dir = all_model_dirs[0]
            logger.info(f"Using model directory: {source_model_dir}")
        else:
            return False
    
    # Ensure face_emotion_model directory exists in destination
    face_emotion_dir = os.path.join(render_models_dir, "face_emotion_model")
    os.makedirs(face_emotion_dir, exist_ok=True)
    
    # Copy models to the expected location (no symlinks)
    try:
        logger.info(f"Copying models from {source_model_dir} to {render_models_dir}")
        
        # First clear the destination directory if it exists
        if os.path.exists(render_models_dir):
            logger.info(f"Clearing existing directory: {render_models_dir}")
            for item in os.listdir(render_models_dir):
                item_path = os.path.join(render_models_dir, item)
                if os.path.isdir(item_path):
                    shutil.rmtree(item_path)
                else:
                    os.remove(item_path)
        
        # Copy all files and directories from source to destination
        for item in os.listdir(source_model_dir):
            s = os.path.join(source_model_dir, item)
            d = os.path.join(render_models_dir, item)
            logger.info(f"Copying {s} to {d}")
            if os.path.isdir(s):
                shutil.copytree(s, d, dirs_exist_ok=True)
            else:
                shutil.copy2(s, d)
        
        # Special case: create face_emotion_model directory if it doesn't exist
        if not os.path.exists(os.path.join(render_models_dir, "face_emotion_model")):
            logger.info("Creating face_emotion_model directory manually")
            os.makedirs(os.path.join(render_models_dir, "face_emotion_model"), exist_ok=True)
            
            # Look for model files in any subdirectory and copy them
            for root, dirs, files in os.walk(source_model_dir):
                for file in files:
                    if file.endswith(".h5") or file.endswith(".pb") or file.endswith(".pt") or file.endswith(".bin"):
                        src_file = os.path.join(root, file)
                        dst_file = os.path.join(render_models_dir, "face_emotion_model", file)
                        logger.info(f"Copying model file: {src_file} -> {dst_file}")
                        shutil.copy2(src_file, dst_file)
                
        logger.info(f"Models copied successfully to {render_models_dir}")
        
        # Debug: check contents after copying
        if os.path.exists(os.path.join(render_models_dir, "face_emotion_model")):
            face_files = os.listdir(os.path.join(render_models_dir, "face_emotion_model"))
            logger.info(f"face_emotion_model directory contents: {face_files}")
        else:
            logger.warning("face_emotion_model directory not found after copying!")
            
    except Exception as e:
        logger.error(f"Error copying models: {e}")
        return False
    
    logger.info("Model setup completed successfully")
    return True

if __name__ == "__main__":
    success = setup_models()
    if not success:
        logger.error("Model setup failed")
        sys.exit(1)
    logger.info("Render setup completed successfully")
    sys.exit(0) 