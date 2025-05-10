import numpy as np # for numerical operations
from flask import request, jsonify # for handling HTTP requests and responses
import skfuzzy as fuzz # for fuzzy logic operations
from skfuzzy import control as ctrl # for fuzzy control operations


comfort_simulator = None # set the comfort simulator to None initially, this will be used to store the comfort simulator
air_quality_simulator = None # set the air quality simulator to None initially, this will be used to store the air quality simulator
light_simulator = None # set the light simulator to None initially, this will be used to store the light simulator
plant_care_simulator = None # set the plant care simulator to None initially, this will be used to store the plant care simulator

def initialise_comfort_system(): # define the initialise_comfort_system function to initialise the comfort system
    try: # try to initialise the comfort system
        temperature = ctrl.Antecedent(np.arange(0, 51, 1), 'temperature') # create the temperature antecedent, this is the input of the comfort system, between 0 and 50 degrees Celsius
        humidity = ctrl.Antecedent(np.arange(0, 101, 1), 'humidity') # create the humidity antecedent, this is the input of the comfort system, between 0 and 100%
        
        comfort = ctrl.Consequent(np.arange(0, 101, 1), 'comfort') # create the comfort consequent, this is the output of the comfort system, between 0 and 100%
        
        temperature['cold'] = fuzz.trimf(temperature.universe, [0, 0, 20]) # create the cold membership function, this is used to define the cold temperature, between 0 and 20 degrees Celsius
        temperature['moderate'] = fuzz.trimf(temperature.universe, [10, 25, 35]) # create the moderate membership function, this is used to define the moderate temperature, between 10 and 35 degrees Celsius  
        temperature['hot'] = fuzz.trimf(temperature.universe, [30, 50, 50]) # create the hot membership function, this is used to define the hot temperature, between 30 and 50 degrees Celsius
        
        humidity['dry'] = fuzz.trimf(humidity.universe, [0, 0, 40]) # create the dry membership function, this is used to define the dry humidity, between 0 and 40%
        humidity['normal'] = fuzz.trimf(humidity.universe, [20, 50, 80]) # create the normal membership function, this is used to define the normal humidity, between 20 and 80%    
        humidity['humid'] = fuzz.trimf(humidity.universe, [60, 100, 100]) # create the humid membership function, this is used to define the humid humidity, between 60 and 100%
        
        comfort['uncomfortable'] = fuzz.trimf(comfort.universe, [0, 0, 40]) # create the uncomfortable membership function, this is used to define the uncomfortable comfort, between 0 and 40%
        comfort['acceptable'] = fuzz.trimf(comfort.universe, [20, 50, 80]) # create the acceptable membership function, this is used to define the acceptable comfort, between 20 and 80%   
        comfort['comfortable'] = fuzz.trimf(comfort.universe, [60, 100, 100]) # create the comfortable membership function, this is used to define the comfortable comfort, between 60 and 100%
        
        rule1 = ctrl.Rule(temperature['cold'] & humidity['humid'], comfort['uncomfortable']) # create the rule for the cold and humid conditions, this is used to define the uncomfortable comfort, between 0 and 40%
        rule2 = ctrl.Rule(temperature['cold'] & humidity['normal'], comfort['acceptable']) # create the rule for the cold and normal conditions, this is used to define the acceptable comfort, between 20 and 80%  
        rule3 = ctrl.Rule(temperature['cold'] & humidity['dry'], comfort['acceptable']) # create the rule for the cold and dry conditions, this is used to define the acceptable comfort, between 20 and 80%
        
        rule4 = ctrl.Rule(temperature['moderate'] & humidity['dry'], comfort['acceptable']) # create the rule for the moderate and dry conditions, this is used to define the acceptable comfort, between 20 and 80%
        rule5 = ctrl.Rule(temperature['moderate'] & humidity['normal'], comfort['comfortable']) # create the rule for the moderate and normal conditions, this is used to define the comfortable comfort, between 60 and 100%   
        rule6 = ctrl.Rule(temperature['moderate'] & humidity['humid'], comfort['acceptable']) # create the rule for the moderate and humid conditions, this is used to define the acceptable comfort, between 20 and 80%
        
        rule7 = ctrl.Rule(temperature['hot'] & humidity['dry'], comfort['acceptable']) # create the rule for the hot and dry conditions, this is used to define the acceptable comfort, between 20 and 80%
        rule8 = ctrl.Rule(temperature['hot'] & humidity['normal'], comfort['acceptable']) # create the rule for the hot and normal conditions, this is used to define the acceptable comfort, between 20 and 80%    
        rule9 = ctrl.Rule(temperature['hot'] & humidity['humid'], comfort['uncomfortable']) # create the rule for the hot and humid conditions, this is used to define the uncomfortable comfort, between 0 and 40% 
        
        comfort_ctrl = ctrl.ControlSystem([rule1, rule2, rule3, rule4, rule5, rule6, rule7, rule8, rule9]) # create the control system for the comfort system, taking the rules into account
        comfort_simulator = ctrl.ControlSystemSimulation(comfort_ctrl) # create the simulator for the comfort system, taking the control system into account
        
        return comfort_simulator # return the comfort simulator
    except Exception: # if an error occurs
        return None # return None

def initialise_air_quality_system(): # define the initialise_air_quality_system function to initialise the air quality system
    try: # try to initialise the air quality system
        co2 = ctrl.Antecedent(np.arange(300, 2001, 1), 'co2') # create the co2 antecedent, this is the input of the air quality system, between 300 and 2000 ppm
        pm25 = ctrl.Antecedent(np.arange(0, 101, 1), 'pm25') # create the pm25 antecedent, this is the input of the air quality system, between 0 and 100 μg/m³
        
        air_quality = ctrl.Consequent(np.arange(0, 101, 1), 'air_quality') # create the air quality consequent, this is the output of the air quality system, between 0 and 100%
        
        co2['good'] = fuzz.trimf(co2.universe, [300, 300, 800]) # create the good membership function, this is used to define the good co2, between 300 and 800 ppm
        co2['moderate'] = fuzz.trimf(co2.universe, [600, 1000, 1400]) # create the moderate membership function, this is used to define the moderate co2, between 600 and 1400 ppm  
        co2['poor'] = fuzz.trimf(co2.universe, [1200, 2000, 2000]) # create the poor membership function, this is used to define the poor co2, between 1200 and 2000 ppm
        
        pm25['low'] = fuzz.trimf(pm25.universe, [0, 0, 25]) # create the low membership function, this is used to define the low pm25, between 0 and 25 μg/m³
        pm25['medium'] = fuzz.trimf(pm25.universe, [15, 35, 55]) # create the medium membership function, this is used to define the medium pm25, between 15 and 55 μg/m³   
        pm25['high'] = fuzz.trimf(pm25.universe, [45, 100, 100]) # create the high membership function, this is used to define the high pm25, between 45 and 100 μg/m³
        
        air_quality['unhealthy'] = fuzz.trimf(air_quality.universe, [0, 0, 40]) # create the unhealthy membership function, this is used to define the unhealthy air quality, between 0 and 40%
        air_quality['moderate'] = fuzz.trimf(air_quality.universe, [20, 50, 80]) # create the moderate membership function, this is used to define the moderate air quality, between 20 and 80%
        air_quality['healthy'] = fuzz.trimf(air_quality.universe, [60, 100, 100]) # create the healthy membership function, this is used to define the healthy air quality, between 60 and 100%
        
        rule1 = ctrl.Rule(co2['good'] & pm25['low'], air_quality['healthy']) # create the rule for the good and low conditions, this is used to define the healthy air quality, between 60 and 100%
        rule2 = ctrl.Rule(co2['good'] & pm25['medium'], air_quality['moderate']) # create the rule for the good and medium conditions, this is used to define the moderate air quality, between 20 and 80%  
        rule3 = ctrl.Rule(co2['good'] & pm25['high'], air_quality['unhealthy']) # create the rule for the good and high conditions, this is used to define the unhealthy air quality, between 0 and 40%
        
        rule4 = ctrl.Rule(co2['moderate'] & pm25['low'], air_quality['moderate']) # create the rule for the moderate and low conditions, this is used to define the moderate air quality, between 20 and 80%
        rule5 = ctrl.Rule(co2['moderate'] & pm25['medium'], air_quality['moderate']) # create the rule for the moderate and medium conditions, this is used to define the moderate air quality, between 20 and 80%  
        rule6 = ctrl.Rule(co2['moderate'] & pm25['high'], air_quality['unhealthy']) # create the rule for the moderate and high conditions, this is used to define the unhealthy air quality, between 0 and 40%
        
        rule7 = ctrl.Rule(co2['poor'] & pm25['low'], air_quality['moderate']) # create the rule for the poor and low conditions, this is used to define the moderate air quality, between 20 and 80%
        rule8 = ctrl.Rule(co2['poor'] & pm25['medium'], air_quality['unhealthy']) # create the rule for the poor and medium conditions, this is used to define the unhealthy air quality, between 0 and 40% 
        rule9 = ctrl.Rule(co2['poor'] & pm25['high'], air_quality['unhealthy']) # create the rule for the poor and high conditions, this is used to define the unhealthy air quality, between 0 and 40%
        
        air_quality_ctrl = ctrl.ControlSystem([rule1, rule2, rule3, rule4, rule5, rule6, rule7, rule8, rule9]) # create the control system for the air quality system, taking the rules into account
        air_quality_simulator = ctrl.ControlSystemSimulation(air_quality_ctrl) # create the simulator for the air quality system, taking the control system into account
        
        return air_quality_simulator # return the air quality simulator
    except Exception: # if an error occurs
        return None # return None

def initialise_light_system(): # define the initialise_light_system function to initialise the light system
    try: # try to initialise the light system
        intensity = ctrl.Antecedent(np.arange(0, 1001, 1), 'intensity') # create the intensity antecedent, this is the input of the light system
        colour_temp = ctrl.Antecedent(np.arange(2000, 6501, 1), 'colour_temp') # create the colour temperature antecedent, this is the input of the light system
        
        light_comfort = ctrl.Consequent(np.arange(0, 101, 1), 'light_comfort') # create the light comfort consequent, this is the output of the light system, between 0 and 100%
        
        intensity['dim'] = fuzz.trimf(intensity.universe, [0, 0, 300]) # create the dim membership function, this is used to define the dim intensity, between 0 and 300 lux
        intensity['moderate'] = fuzz.trimf(intensity.universe, [200, 500, 800]) # create the moderate membership function, this is used to define the moderate intensity, between 200 and 800 lux   
        intensity['bright'] = fuzz.trimf(intensity.universe, [700, 1000, 1000]) # create the bright membership function, this is used to define the bright intensity, between 700 and 1000 lux
        
        colour_temp['warm'] = fuzz.trimf(colour_temp.universe, [2000, 2000, 3500]) # create the warm membership function, this is used to define the warm colour temperature, between 2000 and 3500 K  
        colour_temp['neutral'] = fuzz.trimf(colour_temp.universe, [3000, 4000, 5000]) # create the neutral membership function, this is used to define the neutral colour temperature, between 3000 and 5000 K 
        colour_temp['cool'] = fuzz.trimf(colour_temp.universe, [4500, 6500, 6500]) # create the cool membership function, this is used to define the cool colour temperature, between 4500 and 6500 K
        
        light_comfort['uncomfortable'] = fuzz.trimf(light_comfort.universe, [0, 0, 40]) # create the uncomfortable membership function, this is used to define the uncomfortable light comfort, between 0 and 40%
        light_comfort['acceptable'] = fuzz.trimf(light_comfort.universe, [20, 50, 80]) # create the acceptable membership function, this is used to define the acceptable light comfort, between 20 and 80%
        light_comfort['comfortable'] = fuzz.trimf(light_comfort.universe, [60, 100, 100]) # create the comfortable membership function, this is used to define the comfortable light comfort, between 60 and 100%
        
        rule1 = ctrl.Rule(intensity['dim'] & colour_temp['warm'], light_comfort['acceptable']) # create the rule for the dim and warm conditions, this is used to define the acceptable light comfort, between 20 and 80%
        rule2 = ctrl.Rule(intensity['dim'] & colour_temp['neutral'], light_comfort['acceptable']) # create the rule for the dim and neutral conditions, this is used to define the acceptable light comfort, between 20 and 80%
        rule3 = ctrl.Rule(intensity['dim'] & colour_temp['cool'], light_comfort['uncomfortable']) # create the rule for the dim and cool conditions, this is used to define the uncomfortable light comfort, between 0 and 40%
        
        rule4 = ctrl.Rule(intensity['moderate'] & colour_temp['warm'], light_comfort['comfortable']) # create the rule for the moderate and warm conditions, this is used to define the comfortable light comfort, between 60 and 100%
        rule5 = ctrl.Rule(intensity['moderate'] & colour_temp['neutral'], light_comfort['comfortable']) # create the rule for the moderate and neutral conditions, this is used to define the comfortable light comfort, between 60 and 100%
        rule6 = ctrl.Rule(intensity['moderate'] & colour_temp['cool'], light_comfort['acceptable']) # create the rule for the moderate and cool conditions, this is used to define the acceptable light comfort, between 20 and 80%
        
        rule7 = ctrl.Rule(intensity['bright'] & colour_temp['warm'], light_comfort['acceptable']) # create the rule for the bright and warm conditions, this is used to define the acceptable light comfort, between 20 and 80%
        rule8 = ctrl.Rule(intensity['bright'] & colour_temp['neutral'], light_comfort['acceptable']) # create the rule for the bright and neutral conditions, this is used to define the acceptable light comfort, between 20 and 80%
        rule9 = ctrl.Rule(intensity['bright'] & colour_temp['cool'], light_comfort['uncomfortable']) # create the rule for the bright and cool conditions, this is used to define the uncomfortable light comfort, between 0 and 40%
        
        light_ctrl = ctrl.ControlSystem([rule1, rule2, rule3, rule4, rule5, rule6, rule7, rule8, rule9]) # create the control system for the light system, taking the rules into account
        light_simulator = ctrl.ControlSystemSimulation(light_ctrl) # create the simulator for the light system, taking the control system into account
        
        return light_simulator # return the light simulator
    except Exception: # if an error occurs
        return None # return None

def initialise_plant_care_system(): # define the initialise_plant_care_system function to initialise the plant care system
    try: # try to initialise the plant care system
        soil_moisture = ctrl.Antecedent(np.arange(0, 101, 1), 'soil_moisture') # create the soil moisture antecedent, this is the input of the plant care system, between 0 and 100%
        light_level = ctrl.Antecedent(np.arange(0, 101, 1), 'light_level') # create the light level antecedent, this is the input of the plant care system, between 0 and 100%
        temperature = ctrl.Antecedent(np.arange(0, 41, 1), 'temperature') # create the temperature antecedent, this is the input of the plant care system, between 0 and 40 degrees Celsius
        
        watering_freq = ctrl.Consequent(np.arange(0, 11, 1), 'watering_freq') # create the watering frequency consequent, this is the output of the plant care system, between 0 and 10
        light_adjustment = ctrl.Consequent(np.arange(-10, 11, 1), 'light_adjustment') # create the light adjustment consequent, this is the output of the plant care system, between -10 and 10
        temp_adjustment = ctrl.Consequent(np.arange(-10, 11, 1), 'temp_adjustment') # create the temperature adjustment consequent, this is the output of the plant care system, between -10 and 10
        
        soil_moisture['dry'] = fuzz.trimf(soil_moisture.universe, [0, 0, 40]) # create the dry membership function, this is used to define the dry soil moisture, between 0 and 40%
        soil_moisture['moist'] = fuzz.trimf(soil_moisture.universe, [20, 50, 80]) # create the moist membership function, this is used to define the moist soil moisture, between 20 and 80%
        soil_moisture['wet'] = fuzz.trimf(soil_moisture.universe, [60, 100, 100]) # create the wet membership function, this is used to define the wet soil moisture, between 60 and 100%
        
        light_level['dark'] = fuzz.trimf(light_level.universe, [0, 0, 30]) # create the dark membership function, this is used to define the dark light level, between 0 and 30%
        light_level['medium'] = fuzz.trimf(light_level.universe, [20, 50, 80]) # create the medium membership function, this is used to define the medium light level, between 20 and 80%
        light_level['bright'] = fuzz.trimf(light_level.universe, [70, 100, 100]) # create the bright membership function, this is used to define the bright light level, between 70 and 100%
        
        temperature['cold'] = fuzz.trimf(temperature.universe, [0, 0, 15]) # create the cold membership function, this is used to define the cold temperature, between 0 and 15 degrees Celsius
        temperature['moderate'] = fuzz.trimf(temperature.universe, [10, 20, 30]) # create the moderate membership function, this is used to define the moderate temperature, between 10 and 30 degrees Celsius
        temperature['hot'] = fuzz.trimf(temperature.universe, [25, 40, 40]) # create the hot membership function, this is used to define the hot temperature, between 25 and 40 degrees Celsius
        
        watering_freq['frequent'] = fuzz.trimf(watering_freq.universe, [0, 0, 4]) # create the frequent membership function, this is used to define the frequent watering frequency, between 0 and 4
        watering_freq['moderate'] = fuzz.trimf(watering_freq.universe, [2, 5, 8]) # create the moderate membership function, this is used to define the moderate watering frequency, between 2 and 8
        watering_freq['infrequent'] = fuzz.trimf(watering_freq.universe, [6, 10, 10]) # create the infrequent membership function, this is used to define the infrequent watering frequency, between 6 and 10
        
        light_adjustment['decrease'] = fuzz.trimf(light_adjustment.universe, [-10, -10, 0]) # create the decrease membership function, this is used to define the decrease light adjustment, between -10 and 0
        light_adjustment['maintain'] = fuzz.trimf(light_adjustment.universe, [-5, 0, 5]) # create the maintain membership function, this is used to define the maintain light adjustment, between -5 and 5
        light_adjustment['increase'] = fuzz.trimf(light_adjustment.universe, [0, 10, 10]) # create the increase membership function, this is used to define the increase light adjustment, between 0 and 10
        
        temp_adjustment['decrease'] = fuzz.trimf(temp_adjustment.universe, [-10, -10, 0]) # create the decrease membership function, this is used to define the decrease temperature adjustment, between -10 and 0
        temp_adjustment['maintain'] = fuzz.trimf(temp_adjustment.universe, [-5, 0, 5]) # create the maintain membership function, this is used to define the maintain temperature adjustment, between -5 and 5
        temp_adjustment['increase'] = fuzz.trimf(temp_adjustment.universe, [0, 10, 10]) # create the increase membership function, this is used to define the increase temperature adjustment, between 0 and 10

        rule1 = ctrl.Rule(soil_moisture['dry'] & (light_level['bright'] | temperature['hot']), watering_freq['frequent']) # create the rule for the dry and bright or hot conditions, this is used to define the frequent watering frequency, between 0 and 4
        rule2 = ctrl.Rule(soil_moisture['dry'] & light_level['medium'] & temperature['moderate'], watering_freq['frequent']) # create the rule for the dry and medium and moderate conditions, this is used to define the frequent watering frequency, between 0 and 4
        rule3 = ctrl.Rule(soil_moisture['dry'] & light_level['dark'] & temperature['cold'], watering_freq['moderate']) # create the rule for the dry and dark and cold conditions, this is used to define the moderate watering frequency, between 2 and 8
        
        rule4 = ctrl.Rule(soil_moisture['moist'] & (light_level['bright'] | temperature['hot']), watering_freq['moderate']) # create the rule for the moist and bright or hot conditions, this is used to define the moderate watering frequency, between 2 and 8
        rule5 = ctrl.Rule(soil_moisture['moist'] & light_level['medium'] & temperature['moderate'], watering_freq['moderate']) # create the rule for the moist and medium and moderate conditions, this is used to define the moderate watering frequency, between 2 and 8
        rule6 = ctrl.Rule(soil_moisture['moist'] & light_level['dark'] & temperature['cold'], watering_freq['infrequent']) # create the rule for the moist and dark and cold conditions, this is used to define the infrequent watering frequency, between 6 and 10
        
        rule7 = ctrl.Rule(soil_moisture['wet'], watering_freq['infrequent']) # create the rule for the wet conditions, this is used to define the infrequent watering frequency, between 6 and 10

        rule8 = ctrl.Rule(light_level['dark'], light_adjustment['increase']) # create the rule for the dark conditions, this is used to define the increase light adjustment, between -10 and 0
        rule9 = ctrl.Rule(light_level['medium'], light_adjustment['maintain']) # create the rule for the medium conditions, this is used to define the maintain light adjustment, between -5 and 5
        rule10 = ctrl.Rule(light_level['bright'], light_adjustment['decrease']) # create the rule for the bright conditions, this is used to define the decrease light adjustment, between 0 and 10
        
        rule11 = ctrl.Rule(temperature['cold'], temp_adjustment['increase']) # create the rule for the cold conditions, this is used to define the increase temperature adjustment, between 0 and 10
        rule12 = ctrl.Rule(temperature['moderate'], temp_adjustment['maintain']) # create the rule for the moderate conditions, this is used to define the maintain temperature adjustment, between -5 and 5
        rule13 = ctrl.Rule(temperature['hot'], temp_adjustment['decrease']) # create the rule for the hot conditions, this is used to define the decrease temperature adjustment, between -10 and 0

        plant_care_ctrl = ctrl.ControlSystem([rule1, rule2, rule3, rule4, rule5, rule6, rule7, 
                                              rule8, rule9, rule10, rule11, rule12, rule13]) # create the control system for the plant care system, taking the rules into account
        plant_care_simulator = ctrl.ControlSystemSimulation(plant_care_ctrl) # create the simulator for the plant care system, taking the control system into account
        
        return plant_care_simulator # return the plant care simulator
    except Exception: # if an error occurs
        return None # return None

def comfort_analysis(): # define the comfort analysis function, this is used to analyse the comfort of the user
    global comfort_simulator # define the comfort simulator as a global variable, so it can be used in the other functions

    try: # try to execute the comfort analysis logic
        data = request.json # get the JSON data from the incoming request
        
        if not data: # check if any data was received in the request
            return jsonify({"error": "No data provided"}), 400 # return an error message and 400 status code if no data exists
        
        temperature = data.get('temperature') # get the value associated with the 'temperature' key from the data
        humidity = data.get('humidity') # get the value associated with the 'humidity' key from the data
        
        if temperature is None or humidity is None: # check if either the temperature or humidity value is missing
            return jsonify({"error": "Temperature and humidity values are required"}), 400 # return an error message and 400 status if values are missing
        
        if not (0 <= temperature <= 50): # check if the temperature is outside the valid range of 0 to 50
            return jsonify({"error": "Temperature must be between 0 and 50°C"}), 400 # return an error message and 400 status if temperature is invalid
        
        if not (0 <= humidity <= 100): # check if the humidity is outside the valid range of 0 to 100
            return jsonify({"error": "Humidity must be between 0 and 100%"}), 400 # return an error message and 400 status if humidity is invalid
        
        if comfort_simulator is None: # check if the comfort simulator object has not been initialised
            comfort_simulator = initialise_comfort_system() # call the initialisation function for the comfort fuzzy system
            
        if comfort_simulator is None: # check again if the simulator is still None (meaning initialisation failed)
            return jsonify({"error": "Fuzzy logic system is not initialised"}), 500 # return an error message and 500 status if initialisation failed
        
        comfort_simulator.input['temperature'] = temperature # assign the received temperature value to the 'temperature' input variable of the simulator
        comfort_simulator.input['humidity'] = humidity # assign the received humidity value to the 'humidity' input variable of the simulator
        
        comfort_simulator.compute() # run the fuzzy inference computation based on the inputs and rules
        
        comfort_level = comfort_simulator.output['comfort'] # retrieve the calculated output value for 'comfort' from the simulator

        comfort_description = "" # initialise an empty string to hold the descriptive comfort level
        if comfort_level < 30: # check if the numerical comfort level is less than 30
            comfort_description = "Uncomfortable" # set the description to "Uncomfortable"
        elif comfort_level < 70: # otherwise, check if the numerical comfort level is less than 70
            comfort_description = "Acceptable" # set the description to "Acceptable"
        else: # if the comfort level is 70 or greater
            comfort_description = "Comfortable" # set the description to "Comfortable"
        
        comfort_messages = { # create a dictionary mapping the comfort descriptions to longer, user-friendly messages
            "Uncomfortable": "The current conditions are uncomfortable. You might want to adjust the temperature or humidity.", # set the message for the uncomfortable comfort level
            "Acceptable": "The current conditions are acceptable, but not optimal.", # set the message for the acceptable comfort level
            "Comfortable": "The current conditions are comfortable. Enjoy!" # set the message for the comfortable comfort level
        }
        
        response = { # create a response dictionary to hold the comfort analysis results
            "comfort_level": round(comfort_level, 2), # round the comfort level to 2 decimal places
            "comfort_category": comfort_description, # set the comfort category to the descriptive comfort level
            "message": comfort_messages[comfort_description], # set the message to the descriptive comfort level
            "analysis": { # create an analysis dictionary to hold the temperature and humidity analysis
                "temperature": {
                    "value": temperature, # set the value to the temperature
                    "interpretation": "cold" if temperature < 15 else ("moderate" if temperature < 30 else "hot") # set the interpretation to the temperature
                },
                "humidity": {
                    "value": humidity, # set the value to the humidity
                    "interpretation": "dry" if humidity < 30 else ("normal" if humidity < 70 else "humid") # set the interpretation to the humidity
                }
            },
            "result": f"Comfort Level: {round(comfort_level, 2)}/100 ({comfort_description}). {comfort_messages[comfort_description]}" # create a result string to hold the comfort analysis results
        }
        
        return jsonify(response), 200 # return the response and 200 status code
        
    except Exception as e: # if an error occurs
        error_msg = f"Error in comfort analysis: {str(e)}" # create an error message
        return jsonify({"error": error_msg}), 500 # return the error message and 500 status code

def air_quality_analysis(): # define the air_quality_analysis function to analyse the air quality
    global air_quality_simulator # define the air quality simulator as a global variable, so it can be used in the other functions
    
    try: # try to execute the air quality analysis logic
        data = request.json # get the JSON data from the incoming request
        
        if not data: # check if any data was received in the request
            return jsonify({"error": "No data provided"}), 400 # return an error message and 400 status code if no data exists
        
        co2 = data.get('co2') # get the value associated with the 'co2' key from the data
        pm25 = data.get('pm25') # get the value associated with the 'pm25' key from the data
        
        if co2 is None or pm25 is None: # check if either the co2 or pm25 value is missing
            return jsonify({"error": "CO2 and PM2.5 values are required"}), 400 # return an error message and 400 status code if values are missing
        
        if not (300 <= co2 <= 2000): # check if the co2 value is outside the valid range of 300 to 2000 ppm
            return jsonify({"error": "CO2 must be between 300 and 2000 ppm"}), 400 # return an error message and 400 status code if co2 is invalid
        
        if not (0 <= pm25 <= 100): # check if the pm25 value is outside the valid range of 0 to 100 μg/m³
            return jsonify({"error": "PM2.5 must be between 0 and 100 μg/m³"}), 400 # return an error message and 400 status code if pm25 is invalid
        
        if air_quality_simulator is None: # check if the air quality simulator object has not been initialised
            air_quality_simulator = initialise_air_quality_system() # call the initialisation function for the air quality fuzzy system
            
        if air_quality_simulator is None: # check again if the simulator is still None (meaning initialisation failed)
            return jsonify({"error": "Air quality fuzzy system is not initialised"}), 500 # return an error message and 500 status code if initialisation failed
        
        air_quality_simulator.input['co2'] = co2 # assign the received co2 value to the 'co2' input variable of the simulator
        air_quality_simulator.input['pm25'] = pm25 # assign the received pm25 value to the 'pm25' input variable of the simulator
        
        air_quality_simulator.compute() # run the fuzzy inference computation based on the inputs and rules
        
        air_quality_level = air_quality_simulator.output['air_quality'] # retrieve the calculated output value for 'air_quality' from the simulator
        
        air_quality_description = "" # initialise an empty string to hold the descriptive air quality level
        if air_quality_level < 30: # check if the numerical air quality level is less than 30
            air_quality_description = "Unhealthy" # set the description to "Unhealthy"
        elif air_quality_level < 70: # otherwise, check if the numerical air quality level is less than 70
            air_quality_description = "Moderate" # set the description to "Moderate"
        else: # if the air quality level is 70 or greater
            air_quality_description = "Healthy" # set the description to "Healthy"
        
        air_quality_messages = { # create a dictionary mapping the air quality descriptions to longer, user-friendly messages   
            "Unhealthy": "The air quality is poor. Consider ventilation or air purification.", # set the message for the unhealthy air quality level
            "Moderate": "The air quality is acceptable, but could be improved.", # set the message for the moderate air quality level
            "Healthy": "The air quality is good. Enjoy the clean air!" # set the message for the healthy air quality level
        }
        
        response = { # create a response dictionary to hold the air quality analysis results
            "air_quality_level": round(air_quality_level, 2), # round the air quality level to 2 decimal places
            "air_quality_category": air_quality_description, # set the air quality category to the descriptive air quality level
            "message": air_quality_messages[air_quality_description], # set the message to the descriptive air quality level
            "analysis": { # create an analysis dictionary to hold the co2 and pm25 analysis
                "co2": {
                    "value": co2, # set the value to the co2
                    "interpretation": "good" if co2 < 800 else ("moderate" if co2 < 1400 else "poor") # set the interpretation to the co2
                },
                "pm25": {
                    "value": pm25, # set the value to the pm25
                    "interpretation": "low" if pm25 < 25 else ("medium" if pm25 < 55 else "high") # set the interpretation to the pm25
                }
            },
            "result": f"Air Quality Level: {round(air_quality_level, 2)}/100 ({air_quality_description}). {air_quality_messages[air_quality_description]}" # create a result string to hold the air quality analysis results
        }
        
        return jsonify(response), 200 # return the response and 200 status code
        
    except Exception as e: # if an error occurs
        error_msg = f"Error in air quality analysis: {str(e)}" # create an error message
        return jsonify({"error": error_msg}), 500 # return the error message and 500 status code

def light_comfort_analysis(): # define the light_comfort_analysis function to analyse the light comfort
    global light_simulator # define the light simulator as a global variable, so it can be used in the other functions
    
    try: # try to execute the light comfort analysis logic
        data = request.json # get the JSON data from the incoming request
        
        if not data: # check if any data was received in the request
            return jsonify({"error": "No data provided"}), 400 # return an error message and 400 status code if no data exists
        
        intensity = data.get('intensity') # get the value associated with the 'intensity' key from the data
        colour_temp = data.get('colour_temp') # get the value associated with the 'colo r_temp' key from the data
        
        if intensity is None or colour_temp is None: # check if either the intensity or colour_temp value is missing
            return jsonify({"error": "Light intensity and colour temperature values are required"}), 400 # return an error message and 400 status code if values are missing
        
        if not (0 <= intensity <= 1000): # check if the intensity is outside the valid range of 0 to 1000
            return jsonify({"error": "Light intensity must be between 0 and 1000 lux"}), 400 # return an error message and 400 status code if intensity is invalid
        
        if not (2000 <= colour_temp <= 6500): # check if the colour_temp is outside the valid range of 2000 to 6500
            return jsonify({"error": "Colour temperature must be between 2000 and 6500 Kelvin"}), 400
        
        if light_simulator is None: # check if the light simulator object has not been initialised
            light_simulator = initialise_light_system() # call the initialisation function for the light fuzzy system
            
        if light_simulator is None: # check again if the simulator is still None (meaning initialisation failed)
            return jsonify({"error": "Light comfort fuzzy system is not initialised"}), 500 # return an error message and 500 status code if initialisation failed
        
        light_simulator.input['intensity'] = intensity # assign the received intensity value to the 'intensity' input variable of the simulator
        light_simulator.input['colour_temp'] = colour_temp # assign the received colour_temp value to the 'colour_temp' input variable of the simulator
        
        light_simulator.compute() # run the fuzzy inference computation based on the inputs and rules
        
        light_comfort_level = light_simulator.output['light_comfort'] # retrieve the calculated output value for 'light_comfort' from the simulator
        
        light_comfort_description = "" # initialise an empty string to hold the descriptive light comfort level
        if light_comfort_level < 30: # check if the numerical light comfort level is less than 30
            light_comfort_description = "Uncomfortable" # set the description to "Uncomfortable"
        elif light_comfort_level < 70: # otherwise, check if the numerical light comfort level is less than 70
            light_comfort_description = "Acceptable" # set the description to "Acceptable"
        else: # if the light comfort level is 70 or greater
            light_comfort_description = "Comfortable" # set the description to "Comfortable"
        
        light_comfort_messages = { # create a dictionary mapping the light comfort descriptions to longer, user-friendly messages   
            "Uncomfortable": "The lighting conditions are uncomfortable. Consider adjusting intensity or colour temperature.", # set the message for the uncomfortable light comfort level
            "Acceptable": "The lighting conditions are acceptable, but could be improved for optimal comfort.", # set the message for the acceptable light comfort level
            "Comfortable": "The lighting conditions are comfortable. Enjoy the pleasant lighting!" # set the message for the comfortable light comfort level
        }
        
        response = { # create a response dictionary to hold the light comfort analysis results
            "light_comfort_level": round(light_comfort_level, 2), # round the light comfort level to 2 decimal places
            "light_comfort_category": light_comfort_description, # set the light comfort category to the descriptive light comfort level
            "message": light_comfort_messages[light_comfort_description], # set the message to the descriptive light comfort level
            "analysis": { # create an analysis dictionary to hold the intensity and colour_temp analysis
                "intensity": {
                    "value": intensity, # set the value to the intensity
                    "interpretation": "dim" if intensity < 300 else ("moderate" if intensity < 800 else "bright") # set the interpretation to the intensity
                },
                "colour_temp": {
                    "value": colour_temp, # set the value to the colour_temp
                    "interpretation": "warm" if colour_temp < 3500 else ("neutral" if colour_temp < 5000 else "cool") # set the interpretation to the colour_temp
                }
            },
            "result": f"Light Comfort Level: {round(light_comfort_level, 2)}/100 ({light_comfort_description}). {light_comfort_messages[light_comfort_description]}" # create a result string to hold the light comfort analysis results
        }
        
        return jsonify(response), 200 # return the response and 200 status code
        
    except Exception as e: # if an error occurs
        error_msg = f"Error in light comfort analysis: {str(e)}" # create an error message
        return jsonify({"error": error_msg}), 500 # return the error message and 500 status code

def plant_care_analysis(): # define the plant care analysis function
    global plant_care_simulator # define the plant care simulator as a global variable, so it can be used in the other functions
    
    try: # try to execute the plant care analysis logic
        data = request.json # get the JSON data from the incoming request
        
        if not data: # check if any data was received in the request
            return jsonify({"error": "No data provided"}), 400 # return an error message and 400 status code if no data exists
        
        soil_moisture = data.get('soil_moisture') # get the value associated with the 'soil_moisture' key from the data
        light_level = data.get('light_level') # get the value associated with the 'light_level' key from the data
        temperature = data.get('temperature') # get the value associated with the 'temperature' key from the data
        plant_type = data.get('plant_type', 'General') # get the value associated with the 'plant_type' key from the data, defaulting to 'General' if not provided
        
        if soil_moisture is None or light_level is None or temperature is None: # check if either the soil_moisture, light_level, or temperature value is missing
            return jsonify({"error": "Soil moisture, light level, and temperature values are required"}), 400 # return an error message and 400 status code if values are missing
        
        if not (0 <= soil_moisture <= 100): # check if the soil_moisture is outside the valid range of 0 to 100
            return jsonify({"error": "Soil moisture must be between 0 and 100%"}), 400 # return an error message and 400 status code if soil_moisture is invalid
        
        if not (0 <= light_level <= 100): # check if the light_level is outside the valid range of 0 to 100
            return jsonify({"error": "Light level must be between 0 and 100%"}), 400 # return an error message and 400 status code if light_level is invalid
        
        if not (0 <= temperature <= 40): # check if the temperature is outside the valid range of 0 to 40
            return jsonify({"error": "Temperature must be between 0 and 40°C"}), 400 # return an error message and 400 status code if temperature is invalid
        
        if plant_care_simulator is None: # check if the plant care simulator object has not been initialised
            plant_care_simulator = initialise_plant_care_system() # call the initialisation function for the plant care fuzzy system
            
        if plant_care_simulator is None: # check again if the simulator is still None (meaning initialisation failed)
            return jsonify({"error": "Plant care fuzzy system is not initialised"}), 500 # return an error message and 500 status code if initialisation failed
        
        plant_care_simulator.input['soil_moisture'] = soil_moisture # assign the received soil_moisture value to the 'soil_moisture' input variable of the simulator
        plant_care_simulator.input['light_level'] = light_level # assign the received light_level value to the 'light_level' input variable of the simulator
        plant_care_simulator.input['temperature'] = temperature # assign the received temperature value to the 'temperature' input variable of the simulator
        
        plant_care_simulator.compute() # run the fuzzy inference computation based on the inputs and rules
        
        watering_freq = round(plant_care_simulator.output['watering_freq']) # retrieve the calculated output value for 'watering_freq' from the simulator
        light_adjustment = round(plant_care_simulator.output['light_adjustment']) # retrieve the calculated output value for 'light_adjustment' from the simulator
        temp_adjustment = round(plant_care_simulator.output['temp_adjustment']) # retrieve the calculated output value for 'temp_adjustment' from the simulator
        
        if soil_moisture < 30: # check if the soil_moisture is less than 30
            soil_moisture_status = "Dry" # set the status to "Dry"
        elif soil_moisture < 70: # otherwise, check if the soil_moisture is less than 70
            soil_moisture_status = "Moist" # set the status to "Moist"
        else: # if the soil_moisture is 70 or greater
            soil_moisture_status = "Wet" # set the status to "Wet"
        
        if light_level < 30: # check if the light_level is less than 30
            light_level_status = "Low" # set the status to "Low"
        elif light_level < 70: # otherwise, check if the light_level is less than 70
            light_level_status = "Medium" # set the status to "Medium"
        else: # if the light_level is 70 or greater
            light_level_status = "High" # set the status to "High"
        
        if temperature < 15: # check if the temperature is less than 15
            temperature_status = "Cold" # set the status to "Cold"
        elif temperature < 28: # otherwise, check if the temperature is less than 28
            temperature_status = "Moderate" # set the status to "Moderate"
        else: # if the temperature is 28 or greater
            temperature_status = "Hot" # set the status to "Hot"
        
        watering_recommendation = "" # initialise an empty string to hold the watering recommendation
        if watering_freq <= 2: # check if the watering frequency is less than or equal to 2
            watering_recommendation = "Water your plant daily or every other day. The soil is quite dry." # set the recommendation to "Water your plant daily or every other day. The soil is quite dry."
        elif watering_freq <= 5: # otherwise, check if the watering frequency is less than or equal to 5
            watering_recommendation = f"Water your plant every {watering_freq} days. Monitor soil moisture regularly." # set the recommendation to "Water your plant every {watering_freq} days. Monitor soil moisture regularly."
        else: # if the watering frequency is greater than 5
            watering_recommendation = f"Water your plant every {watering_freq} days. Be careful not to overwater." # set the recommendation to "Water your plant every {watering_freq} days. Be careful not to overwater."
        
        light_recommendation = "" # initialise an empty string to hold the light recommendation
        if light_adjustment > 3: # check if the light adjustment is greater than 3
            light_recommendation = "Increase light exposure significantly. Move to a sunnier location." # set the recommendation to "Increase light exposure significantly. Move to a sunnier location."
        elif light_adjustment > 0: # otherwise, check if the light adjustment is greater than 0
            light_recommendation = "Slightly increase light exposure. Consider moving closer to a window." # set the recommendation to "Slightly increase light exposure. Consider moving closer to a window."
        elif light_adjustment < -3: # otherwise, check if the light adjustment is less than -3
            light_recommendation = "Decrease light exposure significantly. Move to a shadier location or add a curtain." # set the recommendation to "Decrease light exposure significantly. Move to a shadier location or add a curtain."
        elif light_adjustment < 0: # otherwise, check if the light adjustment is less than 0
            light_recommendation = "Slightly decrease light exposure. Move a bit further from direct sunlight." # set the recommendation to "Slightly decrease light exposure. Move a bit further from direct sunlight."
        else: # if the light adjustment is 0 or greater
            light_recommendation = "Current light conditions are appropriate. Maintain current placement." # set the recommendation to "Current light conditions are appropriate. Maintain current placement."
        
        temp_recommendation = "" # initialise an empty string to hold the temperature recommendation
        if temp_adjustment > 3: # check if the temperature adjustment is greater than 3
            temp_recommendation = "Increase temperature significantly. Consider moving to a warmer spot or using heating." # set the recommendation to "Increase temperature significantly. Consider moving to a warmer spot or using heating."
        elif temp_adjustment > 0: # otherwise, check if the temperature adjustment is greater than 0
            temp_recommendation = "Slightly increase temperature. Move away from cold drafts." # set the recommendation to "Slightly increase temperature. Move away from cold drafts."
        elif temp_adjustment < -3: # otherwise, check if the temperature adjustment is less than -3
            temp_recommendation = "Decrease temperature significantly. Move to a cooler location." # set the recommendation to "Decrease temperature significantly. Move to a cooler location."
        elif temp_adjustment < 0: # otherwise, check if the temperature adjustment is less than 0
            temp_recommendation = "Slightly decrease temperature. Avoid placing near heaters or hot windows." # set the recommendation to "Slightly decrease temperature. Avoid placing near heaters or hot windows."
        else: # if the temperature adjustment is 0 or greater
            temp_recommendation = "Current temperature is appropriate. Maintain current conditions." # set the recommendation to "Current temperature is appropriate. Maintain current conditions."
        
        plant_specific_advice = "" # initialise an empty string to hold the plant specific advice
        if plant_type.lower() == "succulent" or plant_type.lower() == "cactus": # check if the plant type is a succulent or cactus
            plant_specific_advice = "As a succulent/cactus, this plant prefers drier conditions and less frequent watering than most houseplants." # set the advice to "As a succulent/cactus, this plant prefers drier conditions and less frequent watering than most houseplants."
        elif plant_type.lower() == "fern": # otherwise, check if the plant type is a fern
            plant_specific_advice = "Ferns generally prefer higher humidity and consistent moisture. Consider misting regularly." # set the advice to "Ferns generally prefer higher humidity and consistent moisture. Consider misting regularly."
        elif plant_type.lower() == "orchid": # otherwise, check if the plant type is an orchid
            plant_specific_advice = "Orchids have specific care requirements. They prefer bright indirect light and should be watered thoroughly but infrequently." # set the advice to "Orchids have specific care requirements. They prefer bright indirect light and should be watered thoroughly but infrequently."
        
        response = { # create a response dictionary to hold the plant care analysis results
            "recommendations": { # create a recommendations dictionary to hold the watering, light, and temperature recommendations
                "watering": watering_recommendation, # set the watering recommendation to the watering recommendation
                "light": light_recommendation, # set the light recommendation to the light recommendation
                "temperature": temp_recommendation # set the temperature recommendation to the temperature recommendation
            },
            "current_conditions": { # create a current_conditions dictionary to hold the soil_moisture, light_level, and temperature statuses
                "soil_moisture": { # create a soil_moisture dictionary to hold the soil_moisture value and status
                    "value": soil_moisture, # set the value to the soil_moisture
                    "status": soil_moisture_status # set the status to the soil_moisture_status
                },
                "light_level": { # create a light_level dictionary to hold the light_level value and status
                    "value": light_level, # set the value to the light_level
                    "status": light_level_status # set the status to the light_level_status
                },
                "temperature": { # create a temperature dictionary to hold the temperature value and status
                    "value": temperature, # set the value to the temperature
                    "status": temperature_status # set the status to the temperature_status
                }
            },
            "numerical_outputs": { # create a numerical_outputs dictionary to hold the watering_frequency_days, light_adjustment, and temperature_adjustment values
                "watering_frequency_days": watering_freq, # set the watering_frequency_days to the watering_freq
                "light_adjustment": light_adjustment, # set the light_adjustment to the light_adjustment
                "temperature_adjustment": temp_adjustment # set the temperature_adjustment to the temp_adjustment
            }
        }
        
        if plant_specific_advice: # check if the plant specific advice is not empty
            response["plant_specific_advice"] = plant_specific_advice # set the plant_specific_advice to the plant_specific_advice
            
        result_summary = f"Plant Care Recommendations: Water every {watering_freq} days. " # create a result summary string to hold the plant care recommendations
        
        if light_adjustment > 0: # check if the light adjustment is greater than 0
            result_summary += "Increase light exposure. " # set the result summary to "Increase light exposure. "
        elif light_adjustment < 0: # otherwise, check if the light adjustment is less than 0
            result_summary += "Decrease light exposure. " # set the result summary to "Decrease light exposure. "
        else: # if the light adjustment is 0 or greater
            result_summary += "Maintain current light. " # set the result summary to "Maintain current light. "
            
        if temp_adjustment > 0: # check if the temperature adjustment is greater than 0
            result_summary += "Increase temperature. " # set the result summary to "Increase temperature. "
        elif temp_adjustment < 0: # otherwise, check if the temperature adjustment is less than 0
            result_summary += "Decrease temperature. " # set the result summary to "Decrease temperature. "
        else: # if the temperature adjustment is 0 or greater
            result_summary += "Maintain current temperature." # set the result summary to "Maintain current temperature."
            
        response["result"] = result_summary # set the result to the result summary
        
        return jsonify(response), 200 # return the response and 200 status code
        
    except Exception as e: # if an error occurs
        error_msg = f"Error in plant care analysis: {str(e)}" # create an error message
        return jsonify({"error": error_msg}), 500 # return the error message and 500 status code

def register_fuzzy_logic_routes(app): # define the register_fuzzy_logic_routes function to register the fuzzy logic routes with the app
    app.route('/api/fuzzy-logic/comfort', methods=['POST'])(comfort_analysis) # register the comfort analysis route with the app
    app.route('/api/fuzzy-logic/air-quality', methods=['POST'])(air_quality_analysis) # register the air quality analysis route with the app
    app.route('/api/fuzzy-logic/light-comfort', methods=['POST'])(light_comfort_analysis) # register the light comfort analysis route with the app
    app.route('/api/fuzzy-logic/plant-care', methods=['POST'])(plant_care_analysis) # register the plant care analysis route with the app
