import os
import io
import json
import base64
import numpy as np
from PIL import Image
import matplotlib.pyplot as plt

class NumpyEncoder(json.JSONEncoder):
    """Custom JSON encoder for NumPy types"""
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        return super().default(obj)

def encode_image_to_base64(image_path):
    """Convert an image file to base64 encoding"""
    with open(image_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
    return encoded_string

def save_pil_image_to_temp(image, filename):
    """Save a PIL image to a temporary file"""
    temp_dir = "debug"
    os.makedirs(temp_dir, exist_ok=True)
    file_path = os.path.join(temp_dir, filename)
    image.save(file_path)
    return file_path

def save_plot_to_base64(fig):
    """Save a matplotlib figure to base64 string"""
    buf = io.BytesIO()
    fig.savefig(buf, format='png', bbox_inches='tight', dpi=300, facecolor='white')
    plt.close(fig)
    buf.seek(0)
    img_str = base64.b64encode(buf.getvalue()).decode('utf-8')
    buf.close()
    return img_str

def process_base64_image(base64_data):
    """Process base64 encoded image data and return a PIL Image"""
    if ',' in base64_data:
        # Split off the data URL prefix if present
        base64_data = base64_data.split(',', 1)[1]
    
    # Decode base64 image
    img_data = base64.b64decode(base64_data)
    image = Image.open(io.BytesIO(img_data))
    
    # Convert to RGB if needed
    if image.mode == 'RGBA':
        # Create a white background
        background = Image.new('RGB', image.size, (255, 255, 255))
        # Paste the image using alpha as mask
        background.paste(image, mask=image.split()[3])
        image = background
    elif image.mode != 'RGB':
        image = image.convert('RGB')
    
    return image 