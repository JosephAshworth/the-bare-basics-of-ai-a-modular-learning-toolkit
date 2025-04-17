import numpy as np
import logging
import traceback
from flask import request, jsonify
import skfuzzy as fuzz
from skfuzzy import control as ctrl

# Get logger
logger = logging.getLogger("emotion_detector")

# Global variables for fuzzy systems
comfort_simulator = None
air_quality_simulator = None
light_simulator = None
plant_care_simulator = None

def initialize_comfort_system():
    try:
        # Define the universe of discourse for input variables
        temperature = ctrl.Antecedent(np.arange(0, 51, 1), 'temperature')
        humidity = ctrl.Antecedent(np.arange(0, 101, 1), 'humidity')
        
        # Define the universe of discourse for output variable
        comfort = ctrl.Consequent(np.arange(0, 101, 1), 'comfort')
        
        # Define membership functions for temperature
        temperature['cold'] = fuzz.trimf(temperature.universe, [0, 0, 20])
        temperature['moderate'] = fuzz.trimf(temperature.universe, [10, 25, 35])
        temperature['hot'] = fuzz.trimf(temperature.universe, [30, 50, 50])
        
        # Define membership functions for humidity
        humidity['dry'] = fuzz.trimf(humidity.universe, [0, 0, 40])
        humidity['normal'] = fuzz.trimf(humidity.universe, [20, 50, 80])
        humidity['humid'] = fuzz.trimf(humidity.universe, [60, 100, 100])
        
        # Define membership functions for comfort
        comfort['uncomfortable'] = fuzz.trimf(comfort.universe, [0, 0, 40])
        comfort['acceptable'] = fuzz.trimf(comfort.universe, [20, 50, 80])
        comfort['comfortable'] = fuzz.trimf(comfort.universe, [60, 100, 100])
        
        # Define fuzzy rules
        rule1 = ctrl.Rule(temperature['cold'] & humidity['humid'], comfort['uncomfortable'])
        rule2 = ctrl.Rule(temperature['cold'] & humidity['normal'], comfort['acceptable'])
        rule3 = ctrl.Rule(temperature['cold'] & humidity['dry'], comfort['acceptable'])
        
        rule4 = ctrl.Rule(temperature['moderate'] & humidity['dry'], comfort['acceptable'])
        rule5 = ctrl.Rule(temperature['moderate'] & humidity['normal'], comfort['comfortable'])
        rule6 = ctrl.Rule(temperature['moderate'] & humidity['humid'], comfort['acceptable'])
        
        rule7 = ctrl.Rule(temperature['hot'] & humidity['dry'], comfort['acceptable'])
        rule8 = ctrl.Rule(temperature['hot'] & humidity['normal'], comfort['acceptable'])
        rule9 = ctrl.Rule(temperature['hot'] & humidity['humid'], comfort['uncomfortable'])
        
        # Create the control system
        comfort_ctrl = ctrl.ControlSystem([rule1, rule2, rule3, rule4, rule5, rule6, rule7, rule8, rule9])
        comfort_simulator = ctrl.ControlSystemSimulation(comfort_ctrl)
        
        return comfort_simulator
    except Exception as e:
        logger.error(f"Error initializing comfort fuzzy system: {str(e)}")
        logger.error(traceback.format_exc())
        return None

def initialize_air_quality_system():
    try:
        # Define the universe of discourse for input variables
        co2 = ctrl.Antecedent(np.arange(300, 2001, 1), 'co2')
        pm25 = ctrl.Antecedent(np.arange(0, 101, 1), 'pm25')
        
        # Define the universe of discourse for output variable
        air_quality = ctrl.Consequent(np.arange(0, 101, 1), 'air_quality')
        
        # Define membership functions for CO2 (ppm)
        co2['good'] = fuzz.trimf(co2.universe, [300, 300, 800])
        co2['moderate'] = fuzz.trimf(co2.universe, [600, 1000, 1400])
        co2['poor'] = fuzz.trimf(co2.universe, [1200, 2000, 2000])
        
        # Define membership functions for PM2.5 (μg/m³)
        pm25['low'] = fuzz.trimf(pm25.universe, [0, 0, 25])
        pm25['medium'] = fuzz.trimf(pm25.universe, [15, 35, 55])
        pm25['high'] = fuzz.trimf(pm25.universe, [45, 100, 100])
        
        # Define membership functions for air quality
        air_quality['unhealthy'] = fuzz.trimf(air_quality.universe, [0, 0, 40])
        air_quality['moderate'] = fuzz.trimf(air_quality.universe, [20, 50, 80])
        air_quality['healthy'] = fuzz.trimf(air_quality.universe, [60, 100, 100])
        
        # Define fuzzy rules
        rule1 = ctrl.Rule(co2['good'] & pm25['low'], air_quality['healthy'])
        rule2 = ctrl.Rule(co2['good'] & pm25['medium'], air_quality['moderate'])
        rule3 = ctrl.Rule(co2['good'] & pm25['high'], air_quality['unhealthy'])
        
        rule4 = ctrl.Rule(co2['moderate'] & pm25['low'], air_quality['moderate'])
        rule5 = ctrl.Rule(co2['moderate'] & pm25['medium'], air_quality['moderate'])
        rule6 = ctrl.Rule(co2['moderate'] & pm25['high'], air_quality['unhealthy'])
        
        rule7 = ctrl.Rule(co2['poor'] & pm25['low'], air_quality['moderate'])
        rule8 = ctrl.Rule(co2['poor'] & pm25['medium'], air_quality['unhealthy'])
        rule9 = ctrl.Rule(co2['poor'] & pm25['high'], air_quality['unhealthy'])
        
        # Create the control system
        air_quality_ctrl = ctrl.ControlSystem([rule1, rule2, rule3, rule4, rule5, rule6, rule7, rule8, rule9])
        air_quality_simulator = ctrl.ControlSystemSimulation(air_quality_ctrl)
        
        return air_quality_simulator
    except Exception as e:
        logger.error(f"Error initializing air quality fuzzy system: {str(e)}")
        logger.error(traceback.format_exc())
        return None

def initialize_light_system():
    try:
        # Define the universe of discourse for input variables
        intensity = ctrl.Antecedent(np.arange(0, 1001, 1), 'intensity')
        color_temp = ctrl.Antecedent(np.arange(2000, 6501, 1), 'color_temp')
        
        # Define the universe of discourse for output variable
        light_comfort = ctrl.Consequent(np.arange(0, 101, 1), 'light_comfort')
        
        # Define membership functions for light intensity (lux)
        intensity['dim'] = fuzz.trimf(intensity.universe, [0, 0, 300])
        intensity['moderate'] = fuzz.trimf(intensity.universe, [200, 500, 800])
        intensity['bright'] = fuzz.trimf(intensity.universe, [700, 1000, 1000])
        
        # Define membership functions for color temperature (Kelvin)
        color_temp['warm'] = fuzz.trimf(color_temp.universe, [2000, 2000, 3500])
        color_temp['neutral'] = fuzz.trimf(color_temp.universe, [3000, 4000, 5000])
        color_temp['cool'] = fuzz.trimf(color_temp.universe, [4500, 6500, 6500])
        
        # Define membership functions for light comfort
        light_comfort['uncomfortable'] = fuzz.trimf(light_comfort.universe, [0, 0, 40])
        light_comfort['acceptable'] = fuzz.trimf(light_comfort.universe, [20, 50, 80])
        light_comfort['comfortable'] = fuzz.trimf(light_comfort.universe, [60, 100, 100])
        
        # Define fuzzy rules
        rule1 = ctrl.Rule(intensity['dim'] & color_temp['warm'], light_comfort['acceptable'])
        rule2 = ctrl.Rule(intensity['dim'] & color_temp['neutral'], light_comfort['acceptable'])
        rule3 = ctrl.Rule(intensity['dim'] & color_temp['cool'], light_comfort['uncomfortable'])
        
        rule4 = ctrl.Rule(intensity['moderate'] & color_temp['warm'], light_comfort['comfortable'])
        rule5 = ctrl.Rule(intensity['moderate'] & color_temp['neutral'], light_comfort['comfortable'])
        rule6 = ctrl.Rule(intensity['moderate'] & color_temp['cool'], light_comfort['acceptable'])
        
        rule7 = ctrl.Rule(intensity['bright'] & color_temp['warm'], light_comfort['acceptable'])
        rule8 = ctrl.Rule(intensity['bright'] & color_temp['neutral'], light_comfort['acceptable'])
        rule9 = ctrl.Rule(intensity['bright'] & color_temp['cool'], light_comfort['uncomfortable'])
        
        # Create the control system
        light_ctrl = ctrl.ControlSystem([rule1, rule2, rule3, rule4, rule5, rule6, rule7, rule8, rule9])
        light_simulator = ctrl.ControlSystemSimulation(light_ctrl)
        
        return light_simulator
    except Exception as e:
        logger.error(f"Error initializing light comfort fuzzy system: {str(e)}")
        logger.error(traceback.format_exc())
        return None

def initialize_plant_care_system():
    try:
        # Define the universe of discourse for input variables
        soil_moisture = ctrl.Antecedent(np.arange(0, 101, 1), 'soil_moisture')
        light_level = ctrl.Antecedent(np.arange(0, 101, 1), 'light_level')
        temperature = ctrl.Antecedent(np.arange(0, 41, 1), 'temperature')
        
        # Define the universe of discourse for output variables
        watering_freq = ctrl.Consequent(np.arange(0, 11, 1), 'watering_freq')
        light_adjustment = ctrl.Consequent(np.arange(-10, 11, 1), 'light_adjustment')
        temp_adjustment = ctrl.Consequent(np.arange(-10, 11, 1), 'temp_adjustment')
        
        # Define membership functions for soil moisture
        soil_moisture['dry'] = fuzz.trimf(soil_moisture.universe, [0, 0, 40])
        soil_moisture['moist'] = fuzz.trimf(soil_moisture.universe, [20, 50, 80])
        soil_moisture['wet'] = fuzz.trimf(soil_moisture.universe, [60, 100, 100])
        
        # Define membership functions for light level
        light_level['dark'] = fuzz.trimf(light_level.universe, [0, 0, 30])
        light_level['medium'] = fuzz.trimf(light_level.universe, [20, 50, 80])
        light_level['bright'] = fuzz.trimf(light_level.universe, [70, 100, 100])
        
        # Define membership functions for temperature
        temperature['cold'] = fuzz.trimf(temperature.universe, [0, 0, 15])
        temperature['moderate'] = fuzz.trimf(temperature.universe, [10, 20, 30])
        temperature['hot'] = fuzz.trimf(temperature.universe, [25, 40, 40])
        
        # Define membership functions for watering frequency (days between watering)
        watering_freq['frequent'] = fuzz.trimf(watering_freq.universe, [0, 0, 4])
        watering_freq['moderate'] = fuzz.trimf(watering_freq.universe, [2, 5, 8])
        watering_freq['infrequent'] = fuzz.trimf(watering_freq.universe, [6, 10, 10])
        
        # Define membership functions for light adjustment
        light_adjustment['decrease'] = fuzz.trimf(light_adjustment.universe, [-10, -10, 0])
        light_adjustment['maintain'] = fuzz.trimf(light_adjustment.universe, [-5, 0, 5])
        light_adjustment['increase'] = fuzz.trimf(light_adjustment.universe, [0, 10, 10])
        
        # Define membership functions for temperature adjustment
        temp_adjustment['decrease'] = fuzz.trimf(temp_adjustment.universe, [-10, -10, 0])
        temp_adjustment['maintain'] = fuzz.trimf(temp_adjustment.universe, [-5, 0, 5])
        temp_adjustment['increase'] = fuzz.trimf(temp_adjustment.universe, [0, 10, 10])

        # Define rules for watering frequency
        rule1 = ctrl.Rule(soil_moisture['dry'] & (light_level['bright'] | temperature['hot']), watering_freq['frequent'])
        rule2 = ctrl.Rule(soil_moisture['dry'] & light_level['medium'] & temperature['moderate'], watering_freq['frequent'])
        rule3 = ctrl.Rule(soil_moisture['dry'] & light_level['dark'] & temperature['cold'], watering_freq['moderate'])
        
        rule4 = ctrl.Rule(soil_moisture['moist'] & (light_level['bright'] | temperature['hot']), watering_freq['moderate'])
        rule5 = ctrl.Rule(soil_moisture['moist'] & light_level['medium'] & temperature['moderate'], watering_freq['moderate'])
        rule6 = ctrl.Rule(soil_moisture['moist'] & light_level['dark'] & temperature['cold'], watering_freq['infrequent'])
        
        rule7 = ctrl.Rule(soil_moisture['wet'], watering_freq['infrequent'])

        # Define rules for light adjustment
        rule8 = ctrl.Rule(light_level['dark'], light_adjustment['increase'])
        rule9 = ctrl.Rule(light_level['medium'], light_adjustment['maintain'])
        rule10 = ctrl.Rule(light_level['bright'], light_adjustment['decrease'])
        
        # Define rules for temperature adjustment
        rule11 = ctrl.Rule(temperature['cold'], temp_adjustment['increase'])
        rule12 = ctrl.Rule(temperature['moderate'], temp_adjustment['maintain'])
        rule13 = ctrl.Rule(temperature['hot'], temp_adjustment['decrease'])

        # Create the control system
        plant_care_ctrl = ctrl.ControlSystem([rule1, rule2, rule3, rule4, rule5, rule6, rule7, 
                                              rule8, rule9, rule10, rule11, rule12, rule13])
        plant_care_simulator = ctrl.ControlSystemSimulation(plant_care_ctrl)
        
        return plant_care_simulator
    except Exception as e:
        logger.error(f"Error initializing plant care fuzzy system: {str(e)}")
        logger.error(traceback.format_exc())
        return None

def comfort_analysis():
    """
    Analyze temperature and humidity using fuzzy logic to determine comfort level.
    
    Expected input:
    {
        "temperature": float (0-50),
        "humidity": float (0-100)
    }
    """
    global comfort_simulator
    
    try:
        # Get input data
        data = request.json
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Extract temperature and humidity values
        temperature = data.get('temperature')
        humidity = data.get('humidity')
        
        if temperature is None or humidity is None:
            return jsonify({"error": "Temperature and humidity values are required"}), 400
        
        # Validate input ranges
        if not (0 <= temperature <= 50):
            return jsonify({"error": "Temperature must be between 0 and 50°C"}), 400
        
        if not (0 <= humidity <= 100):
            return jsonify({"error": "Humidity must be between 0 and 100%"}), 400
        
        # Check if fuzzy system is initialized
        if comfort_simulator is None:
            comfort_simulator = initialize_comfort_system()
            
        if comfort_simulator is None:
            return jsonify({"error": "Fuzzy logic system is not initialized"}), 500
        
        # Set input values
        comfort_simulator.input['temperature'] = temperature
        comfort_simulator.input['humidity'] = humidity
        
        # Compute result
        comfort_simulator.compute()
        
        # Get comfort level
        comfort_level = comfort_simulator.output['comfort']
        
        # Determine linguistic comfort level
        comfort_description = ""
        if comfort_level < 30:
            comfort_description = "Uncomfortable"
        elif comfort_level < 70:
            comfort_description = "Acceptable"
        else:
            comfort_description = "Comfortable"
        
        # Generate appropriate message
        comfort_messages = {
            "Uncomfortable": "The current conditions are uncomfortable. You might want to adjust the temperature or humidity.",
            "Acceptable": "The current conditions are acceptable, but not optimal.",
            "Comfortable": "The current conditions are comfortable. Enjoy!"
        }
        
        # Create response with detailed analysis
        response = {
            "comfort_level": round(comfort_level, 2),
            "comfort_category": comfort_description,
            "message": comfort_messages[comfort_description],
            "analysis": {
                "temperature": {
                    "value": temperature,
                    "interpretation": "cold" if temperature < 15 else ("moderate" if temperature < 30 else "hot")
                },
                "humidity": {
                    "value": humidity,
                    "interpretation": "dry" if humidity < 30 else ("normal" if humidity < 70 else "humid")
                }
            },
            "result": f"Comfort Level: {round(comfort_level, 2)}/100 ({comfort_description}). {comfort_messages[comfort_description]}"
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        error_msg = f"Error in comfort analysis: {str(e)}"
        logger.error(error_msg)
        logger.error(traceback.format_exc())
        return jsonify({"error": error_msg}), 500

def air_quality_analysis():
    """
    Analyze CO2 and PM2.5 levels using fuzzy logic to determine air quality.
    
    Expected input:
    {
        "co2": float (300-2000),
        "pm25": float (0-100)
    }
    """
    global air_quality_simulator
    
    try:
        # Get input data
        data = request.json
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Extract CO2 and PM2.5 values
        co2 = data.get('co2')
        pm25 = data.get('pm25')
        
        if co2 is None or pm25 is None:
            return jsonify({"error": "CO2 and PM2.5 values are required"}), 400
        
        # Validate input ranges
        if not (300 <= co2 <= 2000):
            return jsonify({"error": "CO2 must be between 300 and 2000 ppm"}), 400
        
        if not (0 <= pm25 <= 100):
            return jsonify({"error": "PM2.5 must be between 0 and 100 μg/m³"}), 400
        
        # Check if fuzzy system is initialized
        if air_quality_simulator is None:
            air_quality_simulator = initialize_air_quality_system()
            
        if air_quality_simulator is None:
            return jsonify({"error": "Air quality fuzzy system is not initialized"}), 500
        
        # Set input values
        air_quality_simulator.input['co2'] = co2
        air_quality_simulator.input['pm25'] = pm25
        
        # Compute result
        air_quality_simulator.compute()
        
        # Get air quality level
        air_quality_level = air_quality_simulator.output['air_quality']
        
        # Determine linguistic air quality level
        air_quality_description = ""
        if air_quality_level < 30:
            air_quality_description = "Unhealthy"
        elif air_quality_level < 70:
            air_quality_description = "Moderate"
        else:
            air_quality_description = "Healthy"
        
        # Generate appropriate message
        air_quality_messages = {
            "Unhealthy": "The air quality is poor. Consider ventilation or air purification.",
            "Moderate": "The air quality is acceptable, but could be improved.",
            "Healthy": "The air quality is good. Enjoy the clean air!"
        }
        
        # Create response with detailed analysis
        response = {
            "air_quality_level": round(air_quality_level, 2),
            "air_quality_category": air_quality_description,
            "message": air_quality_messages[air_quality_description],
            "analysis": {
                "co2": {
                    "value": co2,
                    "interpretation": "good" if co2 < 800 else ("moderate" if co2 < 1400 else "poor")
                },
                "pm25": {
                    "value": pm25,
                    "interpretation": "low" if pm25 < 25 else ("medium" if pm25 < 55 else "high")
                }
            },
            "result": f"Air Quality Level: {round(air_quality_level, 2)}/100 ({air_quality_description}). {air_quality_messages[air_quality_description]}"
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        error_msg = f"Error in air quality analysis: {str(e)}"
        logger.error(error_msg)
        logger.error(traceback.format_exc())
        return jsonify({"error": error_msg}), 500

def light_comfort_analysis():
    """
    Analyze light intensity and color temperature using fuzzy logic to determine light comfort.
    
    Expected input:
    {
        "intensity": float (0-1000),
        "color_temp": float (2000-6500)
    }
    """
    global light_simulator
    
    try:
        # Get input data
        data = request.json
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Extract light intensity and color temperature values
        intensity = data.get('intensity')
        color_temp = data.get('color_temp')
        
        if intensity is None or color_temp is None:
            return jsonify({"error": "Light intensity and color temperature values are required"}), 400
        
        # Validate input ranges
        if not (0 <= intensity <= 1000):
            return jsonify({"error": "Light intensity must be between 0 and 1000 lux"}), 400
        
        if not (2000 <= color_temp <= 6500):
            return jsonify({"error": "Color temperature must be between 2000 and 6500 Kelvin"}), 400
        
        # Check if fuzzy system is initialized
        if light_simulator is None:
            light_simulator = initialize_light_system()
            
        if light_simulator is None:
            return jsonify({"error": "Light comfort fuzzy system is not initialized"}), 500
        
        # Set input values
        light_simulator.input['intensity'] = intensity
        light_simulator.input['color_temp'] = color_temp
        
        # Compute result
        light_simulator.compute()
        
        # Get light comfort level
        light_comfort_level = light_simulator.output['light_comfort']
        
        # Determine linguistic light comfort level
        light_comfort_description = ""
        if light_comfort_level < 30:
            light_comfort_description = "Uncomfortable"
        elif light_comfort_level < 70:
            light_comfort_description = "Acceptable"
        else:
            light_comfort_description = "Comfortable"
        
        # Generate appropriate message
        light_comfort_messages = {
            "Uncomfortable": "The lighting conditions are uncomfortable. Consider adjusting intensity or color temperature.",
            "Acceptable": "The lighting conditions are acceptable, but could be improved for optimal comfort.",
            "Comfortable": "The lighting conditions are comfortable. Enjoy the pleasant lighting!"
        }
        
        # Create response with detailed analysis
        response = {
            "light_comfort_level": round(light_comfort_level, 2),
            "light_comfort_category": light_comfort_description,
            "message": light_comfort_messages[light_comfort_description],
            "analysis": {
                "intensity": {
                    "value": intensity,
                    "interpretation": "dim" if intensity < 300 else ("moderate" if intensity < 800 else "bright")
                },
                "color_temp": {
                    "value": color_temp,
                    "interpretation": "warm" if color_temp < 3500 else ("neutral" if color_temp < 5000 else "cool")
                }
            },
            "result": f"Light Comfort Level: {round(light_comfort_level, 2)}/100 ({light_comfort_description}). {light_comfort_messages[light_comfort_description]}"
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        error_msg = f"Error in light comfort analysis: {str(e)}"
        logger.error(error_msg)
        logger.error(traceback.format_exc())
        return jsonify({"error": error_msg}), 500

def plant_care_analysis():
    """
    Analyze plant care conditions using fuzzy logic to provide care recommendations.
    
    Expected input:
    {
        "soil_moisture": float (0-100),
        "light_level": float (0-100),
        "temperature": float (0-40),
        "plant_type": string (optional)
    }
    """
    global plant_care_simulator
    
    try:
        # Get input data
        data = request.json
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Extract values
        soil_moisture = data.get('soil_moisture')
        light_level = data.get('light_level')
        temperature = data.get('temperature')
        plant_type = data.get('plant_type', 'General')  # Optional plant type
        
        if soil_moisture is None or light_level is None or temperature is None:
            return jsonify({"error": "Soil moisture, light level, and temperature values are required"}), 400
        
        # Validate input ranges
        if not (0 <= soil_moisture <= 100):
            return jsonify({"error": "Soil moisture must be between 0 and 100%"}), 400
        
        if not (0 <= light_level <= 100):
            return jsonify({"error": "Light level must be between 0 and 100%"}), 400
        
        if not (0 <= temperature <= 40):
            return jsonify({"error": "Temperature must be between 0 and 40°C"}), 400
        
        # Check if fuzzy system is initialized
        if plant_care_simulator is None:
            plant_care_simulator = initialize_plant_care_system()
            
        if plant_care_simulator is None:
            return jsonify({"error": "Plant care fuzzy system is not initialized"}), 500
        
        # Set input values
        plant_care_simulator.input['soil_moisture'] = soil_moisture
        plant_care_simulator.input['light_level'] = light_level
        plant_care_simulator.input['temperature'] = temperature
        
        # Compute result
        plant_care_simulator.compute()
        
        # Get result values
        watering_freq = round(plant_care_simulator.output['watering_freq'])
        light_adjustment = round(plant_care_simulator.output['light_adjustment'])
        temp_adjustment = round(plant_care_simulator.output['temp_adjustment'])
        
        # Determine soil moisture interpretation
        if soil_moisture < 30:
            soil_moisture_status = "Dry"
        elif soil_moisture < 70:
            soil_moisture_status = "Moist"
        else:
            soil_moisture_status = "Wet"
        
        # Determine light level interpretation
        if light_level < 30:
            light_level_status = "Low"
        elif light_level < 70:
            light_level_status = "Medium"
        else:
            light_level_status = "High"
        
        # Determine temperature interpretation
        if temperature < 15:
            temperature_status = "Cold"
        elif temperature < 28:
            temperature_status = "Moderate"
        else:
            temperature_status = "Hot"
        
        # Generate recommendations
        watering_recommendation = ""
        if watering_freq <= 2:
            watering_recommendation = "Water your plant daily or every other day. The soil is quite dry."
        elif watering_freq <= 5:
            watering_recommendation = f"Water your plant every {watering_freq} days. Monitor soil moisture regularly."
        else:
            watering_recommendation = f"Water your plant every {watering_freq} days. Be careful not to overwater."
        
        light_recommendation = ""
        if light_adjustment > 3:
            light_recommendation = "Increase light exposure significantly. Move to a sunnier location."
        elif light_adjustment > 0:
            light_recommendation = "Slightly increase light exposure. Consider moving closer to a window."
        elif light_adjustment < -3:
            light_recommendation = "Decrease light exposure significantly. Move to a shadier location or add a curtain."
        elif light_adjustment < 0:
            light_recommendation = "Slightly decrease light exposure. Move a bit further from direct sunlight."
        else:
            light_recommendation = "Current light conditions are appropriate. Maintain current placement."
        
        temp_recommendation = ""
        if temp_adjustment > 3:
            temp_recommendation = "Increase temperature significantly. Consider moving to a warmer spot or using heating."
        elif temp_adjustment > 0:
            temp_recommendation = "Slightly increase temperature. Move away from cold drafts."
        elif temp_adjustment < -3:
            temp_recommendation = "Decrease temperature significantly. Move to a cooler location."
        elif temp_adjustment < 0:
            temp_recommendation = "Slightly decrease temperature. Avoid placing near heaters or hot windows."
        else:
            temp_recommendation = "Current temperature is appropriate. Maintain current conditions."
        
        # Plant type specific advice (simplified)
        plant_specific_advice = ""
        if plant_type.lower() == "succulent" or plant_type.lower() == "cactus":
            plant_specific_advice = "As a succulent/cactus, this plant prefers drier conditions and less frequent watering than most houseplants."
        elif plant_type.lower() == "fern":
            plant_specific_advice = "Ferns generally prefer higher humidity and consistent moisture. Consider misting regularly."
        elif plant_type.lower() == "orchid":
            plant_specific_advice = "Orchids have specific care requirements. They prefer bright indirect light and should be watered thoroughly but infrequently."
        
        # Create comprehensive response
        response = {
            "recommendations": {
                "watering": watering_recommendation,
                "light": light_recommendation,
                "temperature": temp_recommendation
            },
            "current_conditions": {
                "soil_moisture": {
                    "value": soil_moisture,
                    "status": soil_moisture_status
                },
                "light_level": {
                    "value": light_level,
                    "status": light_level_status
                },
                "temperature": {
                    "value": temperature,
                    "status": temperature_status
                }
            },
            "numerical_outputs": {
                "watering_frequency_days": watering_freq,
                "light_adjustment": light_adjustment,
                "temperature_adjustment": temp_adjustment
            }
        }
        
        # Add plant-specific advice if provided
        if plant_specific_advice:
            response["plant_specific_advice"] = plant_specific_advice
            
        # Create a summarized result string
        result_summary = f"Plant Care Recommendations: Water every {watering_freq} days. "
        
        if light_adjustment > 0:
            result_summary += "Increase light exposure. "
        elif light_adjustment < 0:
            result_summary += "Decrease light exposure. "
        else:
            result_summary += "Maintain current light. "
            
        if temp_adjustment > 0:
            result_summary += "Increase temperature. "
        elif temp_adjustment < 0:
            result_summary += "Decrease temperature. "
        else:
            result_summary += "Maintain current temperature."
            
        response["result"] = result_summary
        
        return jsonify(response), 200
        
    except Exception as e:
        error_msg = f"Error in plant care analysis: {str(e)}"
        logger.error(error_msg)
        logger.error(traceback.format_exc())
        return jsonify({"error": error_msg}), 500

def register_fuzzy_logic_routes(app):
    """Register all fuzzy logic routes with the app"""
    app.route('/api/fuzzy-logic/comfort', methods=['POST'])(comfort_analysis)
    app.route('/api/fuzzy-logic/air-quality', methods=['POST'])(air_quality_analysis)
    app.route('/api/fuzzy-logic/light-comfort', methods=['POST'])(light_comfort_analysis)
    app.route('/api/fuzzy-logic/plant-care', methods=['POST'])(plant_care_analysis) 