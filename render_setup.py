#!/usr/bin/env python
import os
import sys
import shutil
import subprocess
import logging

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
    
    # Check if models were downloaded to the local directory
    if not os.path.exists(models_dir):
        logger.error(f"Models not found in {models_dir}")
        return False
    
    # Create a symbolic link to ensure the models are accessible
    try:
        # First, try to symlink directly
        if os.path.exists(render_models_dir) and not os.path.islink(render_models_dir):
            logger.info(f"Creating symlink from {models_dir} to {render_models_dir}")
            if os.path.isdir(render_models_dir):
                shutil.rmtree(render_models_dir)
            os.symlink(models_dir, render_models_dir)
        # If that fails, try to copy the models
        if not os.path.exists(render_models_dir) or not os.listdir(render_models_dir):
            logger.info(f"Copying models from {models_dir} to {render_models_dir}")
            for item in os.listdir(models_dir):
                s = os.path.join(models_dir, item)
                d = os.path.join(render_models_dir, item)
                if os.path.isdir(s):
                    shutil.copytree(s, d, dirs_exist_ok=True)
                else:
                    shutil.copy2(s, d)
    except Exception as e:
        logger.error(f"Error setting up model paths: {e}")
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