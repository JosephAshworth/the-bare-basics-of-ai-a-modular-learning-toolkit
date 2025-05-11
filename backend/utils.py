import json # for handling json data
import numpy as np # for numpy arrays

class NumpyEncoder(json.JSONEncoder): # for the numpy encoder, this is a custom json encoder for numpy types
    def default(self, obj): # for the default method, this is used to convert numpy types to a list
        if isinstance(obj, np.ndarray): # if the object is a numpy array
            return obj.tolist() # convert the numpy array to a list
        if isinstance(obj, np.integer): # if the object is a numpy integer
            return int(obj) # convert the numpy integer to an integer
        if isinstance(obj, np.floating): # if the object is a numpy floating point number
            return float(obj) # convert the numpy floating point number to a float
        return super().default(obj) # return the default method
    
# this file is mainly used in model training, so the results can be encoded to a json string 
