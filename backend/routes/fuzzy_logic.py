# this script handles the fuzzy logic for the comfort, air quality, light and plant care systems

import numpy as np
from flask import request, jsonify
import skfuzzy as fuzz # for fuzzy logic operations
from skfuzzy import control as ctrl
import os
from flask_cors import CORS

# initialise the fuzzy logic simulators
comfort_simulator = None
air_quality_simulator = None
light_simulator = None
plant_care_simulator = None

# adjust input values slightly to prevent them from being exactly at the minimum or maximum, avoiding edge cases in fuzzy logic
def avoid_fuzzy_edge(value, min_val, max_val, delta=0.01):
    if value <= min_val:
        return min_val + delta
    elif value >= max_val:
        return max_val - delta
    return value

def initialise_comfort_system():
    try:
        # define ranges and jumps for the inputs and output
        temperature = ctrl.Antecedent(np.arange(0, 51, 1), 'temperature') # from 0 to 50
        humidity = ctrl.Antecedent(np.arange(0, 101, 1), 'humidity') # from 0 to 100
        comfort = ctrl.Consequent(np.arange(0, 101, 1), 'comfort') # from 0 to 100

        # define how to classify temperature, humidity, and comfort levels
        temperature['cold'] = fuzz.trimf(temperature.universe, [0, 0, 15]) # cold is between 0 and 15, with coldest at 0
        temperature['moderate'] = fuzz.trimf(temperature.universe, [15, 23, 30]) # moderate is between 15 and 30, with most moderate at 23
        temperature['hot'] = fuzz.trimf(temperature.universe, [28, 50, 50]) # hot is between 28 and 50, with hottest at 50

        humidity['dry'] = fuzz.trimf(humidity.universe, [0, 0, 30])
        humidity['normal'] = fuzz.trimf(humidity.universe, [30, 50, 70])
        humidity['humid'] = fuzz.trimf(humidity.universe, [65, 100, 100])

        comfort['uncomfortable'] = fuzz.trimf(comfort.universe, [0, 0, 30])
        comfort['acceptable'] = fuzz.trimf(comfort.universe, [25, 50, 75])
        comfort['comfortable'] = fuzz.trimf(comfort.universe, [70, 100, 100])

        # create rules to decide comfort level based on temperature and humidity
        rule1 = ctrl.Rule(temperature['cold'] & humidity['humid'], comfort['uncomfortable'])  # cold and humid is uncomfortable
        rule2 = ctrl.Rule(temperature['cold'] & humidity['normal'], comfort['acceptable'])  # cold and normal is acceptable
        rule3 = ctrl.Rule(temperature['cold'] & humidity['dry'], comfort['uncomfortable'])  # cold and dry is uncomfortable

        rule4 = ctrl.Rule(temperature['moderate'] & humidity['dry'], comfort['acceptable'])
        rule5 = ctrl.Rule(temperature['moderate'] & humidity['normal'], comfort['comfortable'])
        rule6 = ctrl.Rule(temperature['moderate'] & humidity['humid'], comfort['acceptable'])

        rule7 = ctrl.Rule(temperature['hot'] & humidity['dry'], comfort['uncomfortable'])
        rule8 = ctrl.Rule(temperature['hot'] & humidity['normal'], comfort['uncomfortable'])
        rule9 = ctrl.Rule(temperature['hot'] & humidity['humid'], comfort['uncomfortable'])

        # set up the system to simulate comfort levels based on the rules
        comfort_ctrl = ctrl.ControlSystem([rule1, rule2, rule3, rule4, rule5, rule6, rule7, rule8, rule9])
        comfort_simulator = ctrl.ControlSystemSimulation(comfort_ctrl)

        return comfort_simulator
    except Exception:
        return None

def initialise_air_quality_system():
    try:
        co2 = ctrl.Antecedent(np.arange(300, 2001, 1), 'co2')
        pm25 = ctrl.Antecedent(np.arange(0, 101, 1), 'pm25')
        air_quality = ctrl.Consequent(np.arange(0, 101, 1), 'air_quality')

        co2['good'] = fuzz.trimf(co2.universe, [300, 300, 800])
        co2['moderate'] = fuzz.trimf(co2.universe, [600, 1000, 1400])
        co2['poor'] = fuzz.trimf(co2.universe, [1200, 2000, 2000])

        pm25['low'] = fuzz.trimf(pm25.universe, [0, 0, 25])
        pm25['medium'] = fuzz.trimf(pm25.universe, [15, 35, 55])
        pm25['high'] = fuzz.trimf(pm25.universe, [45, 100, 100])

        air_quality['unhealthy'] = fuzz.trimf(air_quality.universe, [0, 0, 40])
        air_quality['moderate'] = fuzz.trimf(air_quality.universe, [20, 50, 80])
        air_quality['healthy'] = fuzz.trimf(air_quality.universe, [60, 100, 100])

        rule1 = ctrl.Rule(co2['good'] & pm25['low'], air_quality['healthy'])
        rule2 = ctrl.Rule(co2['good'] & pm25['medium'], air_quality['moderate'])
        rule3 = ctrl.Rule(co2['good'] & pm25['high'], air_quality['unhealthy'])

        rule4 = ctrl.Rule(co2['moderate'] & pm25['low'], air_quality['moderate'])
        rule5 = ctrl.Rule(co2['moderate'] & pm25['medium'], air_quality['moderate'])
        rule6 = ctrl.Rule(co2['moderate'] & pm25['high'], air_quality['unhealthy'])

        rule7 = ctrl.Rule(co2['poor'] & pm25['low'], air_quality['moderate'])
        rule8 = ctrl.Rule(co2['poor'] & pm25['medium'], air_quality['unhealthy'])
        rule9 = ctrl.Rule(co2['poor'] & pm25['high'], air_quality['unhealthy'])

        air_quality_ctrl = ctrl.ControlSystem([
            rule1, rule2, rule3, rule4, rule5, rule6, rule7, rule8, rule9
        ])
        air_quality_simulator = ctrl.ControlSystemSimulation(air_quality_ctrl)

        return air_quality_simulator
    except Exception:
        return None

def initialise_light_system():
    try:
        intensity = ctrl.Antecedent(np.arange(0, 1001, 1), 'intensity')
        colour_temp = ctrl.Antecedent(np.arange(2000, 6501, 1), 'colour_temp')

        light_comfort = ctrl.Consequent(np.arange(0, 101, 1), 'light_comfort')

        intensity['dim'] = fuzz.trimf(intensity.universe, [0, 0, 300])
        intensity['moderate'] = fuzz.trimf(intensity.universe, [200, 500, 800])
        intensity['bright'] = fuzz.trimf(intensity.universe, [700, 1000, 1000])

        colour_temp['warm'] = fuzz.trimf(colour_temp.universe, [2000, 2000, 3500])
        colour_temp['neutral'] = fuzz.trimf(colour_temp.universe, [3000, 4000, 5000])
        colour_temp['cool'] = fuzz.trimf(colour_temp.universe, [4500, 6500, 6500])

        light_comfort['uncomfortable'] = fuzz.trimf(light_comfort.universe, [0, 0, 40])
        light_comfort['acceptable'] = fuzz.trimf(light_comfort.universe, [20, 50, 80])
        light_comfort['comfortable'] = fuzz.trimf(light_comfort.universe, [60, 100, 100])

        rule1 = ctrl.Rule(intensity['dim'] & colour_temp['warm'], light_comfort['acceptable'])
        rule2 = ctrl.Rule(intensity['dim'] & colour_temp['neutral'], light_comfort['acceptable'])
        rule3 = ctrl.Rule(intensity['dim'] & colour_temp['cool'], light_comfort['uncomfortable'])

        rule4 = ctrl.Rule(intensity['moderate'] & colour_temp['warm'], light_comfort['comfortable'])
        rule5 = ctrl.Rule(intensity['moderate'] & colour_temp['neutral'], light_comfort['comfortable'])
        rule6 = ctrl.Rule(intensity['moderate'] & colour_temp['cool'], light_comfort['acceptable'])

        rule7 = ctrl.Rule(intensity['bright'] & colour_temp['warm'], light_comfort['acceptable'])
        rule8 = ctrl.Rule(intensity['bright'] & colour_temp['neutral'], light_comfort['acceptable'])
        rule9 = ctrl.Rule(intensity['bright'] & colour_temp['cool'], light_comfort['uncomfortable'])

        light_ctrl = ctrl.ControlSystem([rule1, rule2, rule3, rule4, rule5, rule6, rule7, rule8, rule9])
        light_simulator = ctrl.ControlSystemSimulation(light_ctrl)

        return light_simulator
    except Exception:
        return None

def initialise_plant_care_system():
    try:
        soil_moisture = ctrl.Antecedent(np.arange(0, 101, 1), 'soil_moisture')
        light_level = ctrl.Antecedent(np.arange(0, 101, 1), 'light_level')
        temperature = ctrl.Antecedent(np.arange(0, 41, 1), 'temperature')

        watering_frequency = ctrl.Consequent(np.arange(0, 11, 1), 'watering_frequency')
        light_adjustment = ctrl.Consequent(np.arange(0, 101, 1), 'light_adjustment')
        temp_adjustment = ctrl.Consequent(np.arange(0, 101, 1), 'temp_adjustment')

        soil_moisture['dry'] = fuzz.trimf(soil_moisture.universe, [0, 0, 40])
        soil_moisture['moist'] = fuzz.trimf(soil_moisture.universe, [0, 50, 100])
        soil_moisture['wet'] = fuzz.trimf(soil_moisture.universe, [60, 100, 100])

        light_level['dark'] = fuzz.trimf(light_level.universe, [0, 0, 30])
        light_level['medium'] = fuzz.trimf(light_level.universe, [0, 50, 100])
        light_level['bright'] = fuzz.trimf(light_level.universe, [70, 100, 100])

        temperature['cold'] = fuzz.trimf(temperature.universe, [0, 0, 15])
        temperature['moderate'] = fuzz.trimf(temperature.universe, [0, 20, 40])
        temperature['hot'] = fuzz.trimf(temperature.universe, [25, 40, 40])

        watering_frequency['frequent'] = fuzz.trimf(watering_frequency.universe, [0, 0, 4])
        watering_frequency['moderate'] = fuzz.trimf(watering_frequency.universe, [2, 5, 8])
        watering_frequency['infrequent'] = fuzz.trimf(watering_frequency.universe, [6, 10, 10])

        light_adjustment['decrease'] = fuzz.trimf(light_adjustment.universe, [0, 0, 30])
        light_adjustment['maintain'] = fuzz.trimf(light_adjustment.universe, [25, 50, 75])
        light_adjustment['increase'] = fuzz.trimf(light_adjustment.universe, [70, 100, 100])

        temp_adjustment['decrease'] = fuzz.trimf(temp_adjustment.universe, [0, 0, 30])
        temp_adjustment['maintain'] = fuzz.trimf(temp_adjustment.universe, [25, 50, 75])
        temp_adjustment['increase'] = fuzz.trimf(temp_adjustment.universe, [70, 100, 100])

        rule1 = ctrl.Rule(soil_moisture['dry'] & (light_level['bright'] | temperature['hot']), watering_frequency['frequent'])
        rule2 = ctrl.Rule(soil_moisture['dry'] & light_level['medium'] & temperature['moderate'], watering_frequency['frequent'])
        rule3 = ctrl.Rule(soil_moisture['dry'] & light_level['dark'] & temperature['cold'], watering_frequency['moderate'])
        rule4 = ctrl.Rule(soil_moisture['moist'] & (light_level['bright'] | temperature['hot']), watering_frequency['moderate'])
        rule5 = ctrl.Rule(soil_moisture['moist'] & light_level['medium'] & temperature['moderate'], watering_frequency['moderate'])
        rule6 = ctrl.Rule(soil_moisture['moist'] & light_level['dark'] & temperature['cold'], watering_frequency['infrequent'])
        rule7 = ctrl.Rule(soil_moisture['wet'], watering_frequency['infrequent'])

        rule8 = ctrl.Rule(light_level['dark'], light_adjustment['increase'])
        rule9 = ctrl.Rule(light_level['medium'], light_adjustment['maintain'])
        rule10 = ctrl.Rule(light_level['bright'], light_adjustment['decrease'])

        rule11 = ctrl.Rule(temperature['cold'], temp_adjustment['increase'])
        rule12 = ctrl.Rule(temperature['moderate'], temp_adjustment['maintain'])
        rule13 = ctrl.Rule(temperature['hot'], temp_adjustment['decrease'])

        plant_care_ctrl = ctrl.ControlSystem([
            rule1, rule2, rule3, rule4, rule5, rule6, rule7,
            rule8, rule9, rule10, rule11, rule12, rule13
        ])
        plant_care_simulator = ctrl.ControlSystemSimulation(plant_care_ctrl)

        return plant_care_simulator
    except Exception:
        return None

def comfort_analysis():
    global comfort_simulator # global variable to store the comfort simulator
    try:
        data = request.json # extract JSON data from the request
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # extract the temperatire and humidity
        temperature = data.get('temperature')
        humidity = data.get('humidity')
        
        if temperature is None or humidity is None:
            return jsonify({"error": "Temperature and humidity values are required"}), 400
        
        # check if the temperature and humidity are within the valid range
        if not (0 <= temperature <= 50):
            return jsonify({"error": "Temperature must be between 0 and 50°C"}), 400
        
        if not (0 <= humidity <= 100):
            return jsonify({"error": "Humidity must be between 0 and 100%"}), 400
        
        if comfort_simulator is None:
            comfort_simulator = initialise_comfort_system()
            
        if comfort_simulator is None:
            return jsonify({"error": "Fuzzy logic system is not initialised"}), 500
        
        # deal with edge cases
        temperature = avoid_fuzzy_edge(temperature, 0, 50)
        humidity = avoid_fuzzy_edge(humidity, 0, 100)

        # input the temperature and humidity into the comfort simulator
        comfort_simulator.input['temperature'] = temperature
        comfort_simulator.input['humidity'] = humidity
        
        # compute the comfort level
        comfort_simulator.compute()
        
        # get the comfort level
        comfort_level = comfort_simulator.output['comfort']

        # determine the comfort level description based on the numerical comfort level
        comfort_description = ""
        if comfort_level < 30:
            comfort_description = "Uncomfortable"
        elif comfort_level < 70:
            comfort_description = "Acceptable"
        else:
            comfort_description = "Comfortable"

        # check for extreme temperature or humidity and set a warning if detected
        warning = None
        if temperature > 45 or humidity < 10:
            warning = "Extreme temperature or humidity detected. Comfort reading may not reflect safety conditions."
        
        # define the messages for the comfort level
        comfort_messages = {
            "Uncomfortable": "The current conditions are uncomfortable. You might want to adjust the temperature or humidity.",
            "Acceptable": "The current conditions are acceptable, but not optimal.",
            "Comfortable": "The current conditions are comfortable. Enjoy!"
        }
        
        # create the response
        response = {
            "comfort_level": round(comfort_level, 2), # round the comfort level to 2 decimal places
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
            "warning": warning,
            "result": f"Comfort Level: {round(comfort_level, 2)}/100 ({comfort_description}). {comfort_messages[comfort_description]}" # format the result
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        error_msg = f"Error in comfort analysis: {str(e)}"
        return jsonify({"error": error_msg}), 500

def air_quality_analysis():
    global air_quality_simulator
    try:
        data = request.json
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        co2 = data.get('co2')
        pm25 = data.get('pm25')
        
        if co2 is None or pm25 is None:
            return jsonify({"error": "CO2 and PM2.5 values are required"}), 400
        
        if not (300 <= co2 <= 2000):
            return jsonify({"error": "CO2 must be between 300 and 2000 ppm"}), 400
        
        if not (0 <= pm25 <= 100):
            return jsonify({"error": "PM2.5 must be between 0 and 100 μg/m³"}), 400
        
        if air_quality_simulator is None:
            air_quality_simulator = initialise_air_quality_system()
            
        if air_quality_simulator is None:
            return jsonify({"error": "Air quality fuzzy system is not initialised"}), 500
        
        co2 = avoid_fuzzy_edge(co2, 300, 2000)
        pm25 = avoid_fuzzy_edge(pm25, 0, 100)

        air_quality_simulator.input['co2'] = co2
        air_quality_simulator.input['pm25'] = pm25
        
        air_quality_simulator.compute()
        
        air_quality_level = air_quality_simulator.output['air_quality']
        
        air_quality_description = ""
        if air_quality_level < 30:
            air_quality_description = "Unhealthy"
        elif air_quality_level < 70:
            air_quality_description = "Moderate"
        else:
            air_quality_description = "Healthy"
        
        air_quality_messages = {
            "Unhealthy": "The air quality is poor. Consider ventilation or air purification.",
            "Moderate": "The air quality is acceptable, but could be improved.",
            "Healthy": "The air quality is good. Enjoy the clean air!"
        }
        
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
        return jsonify({"error": error_msg}), 500

def light_comfort_analysis():
    global light_simulator
    try:
        data = request.json
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        intensity = data.get('intensity')
        colour_temp = data.get('colour_temp')
        
        if intensity is None or colour_temp is None:
            return jsonify({"error": "Light intensity and colour temperature values are required"}), 400
        
        if not (0 <= intensity <= 1000):
            return jsonify({"error": "Light intensity must be between 0 and 1000 lux"}), 400
        
        if not (2000 <= colour_temp <= 6500):
            return jsonify({"error": "Colour temperature must be between 2000 and 6500 Kelvin"}), 400
        
        if light_simulator is None:
            light_simulator = initialise_light_system()
            
        if light_simulator is None:
            return jsonify({"error": "Light comfort fuzzy system is not initialised"}), 500
        
        intensity = avoid_fuzzy_edge(intensity, 0, 1000)
        colour_temp = avoid_fuzzy_edge(colour_temp, 2000, 6500)

        light_simulator.input['intensity'] = intensity
        light_simulator.input['colour_temp'] = colour_temp
        
        light_simulator.compute()
        
        light_comfort_level = light_simulator.output['light_comfort']
        
        light_comfort_description = ""
        if light_comfort_level < 30:
            light_comfort_description = "Uncomfortable"
        elif light_comfort_level < 70:
            light_comfort_description = "Acceptable"
        else:
            light_comfort_description = "Comfortable"
        
        light_comfort_messages = {
            "Uncomfortable": "The lighting conditions are uncomfortable. Consider adjusting intensity or colour temperature.",
            "Acceptable": "The lighting conditions are acceptable, but could be improved for optimal comfort.",
            "Comfortable": "The lighting conditions are comfortable. Enjoy the pleasant lighting!"
        }
        
        response = {
            "light_comfort_level": round(light_comfort_level, 2),
            "light_comfort_category": light_comfort_description,
            "message": light_comfort_messages[light_comfort_description],
            "analysis": {
                "intensity": {
                    "value": intensity,
                    "interpretation": "dim" if intensity < 300 else ("moderate" if intensity < 800 else "bright")
                },
                "colour_temp": {
                    "value": colour_temp,
                    "interpretation": "warm" if colour_temp < 3500 else ("neutral" if colour_temp < 5000 else "cool")
                }
            },
            "result": f"Light Comfort Level: {round(light_comfort_level, 2)}/100 ({light_comfort_description}). {light_comfort_messages[light_comfort_description]}"
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        error_msg = f"Error in light comfort analysis: {str(e)}"
        return jsonify({"error": error_msg}), 500

def plant_care_analysis():
    global plant_care_simulator
    try:
        data = request.json
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        soil_moisture = data.get('soil_moisture')
        light_level = data.get('light_level')
        temperature = data.get('temperature')
        plant_type = data.get('plant_type', 'General')
        
        if soil_moisture is None or light_level is None or temperature is None:
            return jsonify({"error": "Soil moisture, light level, and temperature values are required"}), 400
        
        if not (0 <= soil_moisture <= 100):
            return jsonify({"error": "Soil moisture must be between 0 and 100%"}), 400
        
        if not (0 <= light_level <= 100):
            return jsonify({"error": "Light level must be between 0 and 100%"}), 400
        
        if not (0 <= temperature <= 40):
            return jsonify({"error": "Temperature must be between 0 and 40°C"}), 400
        
        if plant_care_simulator is None:
            plant_care_simulator = initialise_plant_care_system()
            
        if plant_care_simulator is None:
            return jsonify({"error": "Plant care fuzzy system is not initialised"}), 500
        
        soil_moisture = avoid_fuzzy_edge(soil_moisture, 0, 100)
        light_level = avoid_fuzzy_edge(light_level, 0, 100)
        temperature = avoid_fuzzy_edge(temperature, 0, 40)
        
        plant_care_simulator.input['soil_moisture'] = soil_moisture
        plant_care_simulator.input['light_level'] = light_level
        plant_care_simulator.input['temperature'] = temperature
        
        # compute the plant care and round the outputs
        try:
            plant_care_simulator.compute()
            watering_frequency = round(plant_care_simulator.output['watering_frequency'])
            light_adjustment = round(plant_care_simulator.output['light_adjustment'])
            temp_adjustment = round(plant_care_simulator.output['temp_adjustment'])
        except Exception as e:
            error_msg = f"Error in plant care fuzzy computation: {str(e)}. Inputs: soil_moisture={soil_moisture}, light_level={light_level}, temperature={temperature}, plant_type={plant_type}"
            return jsonify({"error": error_msg}), 500

        # determine the plant type and deal with edge cases
        plant = plant_type.lower().strip()
        known_plants = {"succulent", "cactus", "fern", "orchid"}
        if plant not in known_plants:
            plant = "general"
        
        # adjust watering and environmental conditions based on plant type
        if plant in {"succulent", "cactus"}:
            watering_frequency = min(watering_frequency + 2, 10) # increase watering frequency for succulents and cacti

            if light_level < 60:
                light_adjustment = max(light_adjustment, 70) # increase light exposure for succulents and cacti

            if temperature < 15:
                temp_adjustment = max(temp_adjustment, 70) # increase temperature for succulents and cacti

            temp_adjustment = min(temp_adjustment, 60) # decrease temperature for succulents and cacti

        elif plant == "fern":
            watering_frequency = max(watering_frequency - 2, 1)
            if light_level > 70:
                light_adjustment = min(light_adjustment, 30)
            if temperature < 18:
                temp_adjustment = max(temp_adjustment, 60)

        elif plant == "orchid":
            watering_frequency = max(watering_frequency, 5)

            if light_level < 40:
                light_adjustment = max(light_adjustment, 70)

            if temperature < 20:
                temp_adjustment = max(temp_adjustment, 60)

        # determine the soil moisture status based on the value
        if soil_moisture < 30:
            soil_moisture_status = "Dry"
        elif soil_moisture < 70:
            soil_moisture_status = "Moist"
        else:
            soil_moisture_status = "Wet"
        
        if light_level < 30:
            light_level_status = "Low"
        elif light_level < 70:
            light_level_status = "Medium"
        else:
            light_level_status = "High"
        
        if temperature < 15:
            temperature_status = "Cold"
        elif temperature < 28:
            temperature_status = "Moderate"
        else:
            temperature_status = "Hot"
        
        # determine the watering recommendation based on the watering frequency
        if watering_frequency <= 2:
            watering_recommendation = "Water your plant daily or every other day. The soil is quite dry."
        elif watering_frequency <= 5:
            watering_recommendation = f"Water your plant every {watering_frequency} days. Monitor soil moisture regularly."
        else:
            watering_recommendation = f"Water your plant every {watering_frequency} days. Be careful not to overwater."

        # determine the light recommendation based on the light adjustment
        if light_adjustment >= 70:
            light_recommendation = "Increase light exposure significantly. Move to a sunnier location."
        elif light_adjustment > 55:
            light_recommendation = "Slightly increase light exposure. Consider moving closer to a window."
        elif light_adjustment < 30:
            light_recommendation = "Decrease light exposure significantly. Move to a shadier location or add a curtain."
        else:
            light_recommendation = "Maintain current light conditions."

        # determine the temperature recommendation based on the temperature adjustment
        if temp_adjustment >= 70:
            temp_recommendation = "Increase temperature significantly. Consider moving to a warmer spot or using heating."
        elif temp_adjustment > 55:
            temp_recommendation = "Slightly increase temperature. Move away from cold drafts."
        elif temp_adjustment < 30:
            temp_recommendation = "Decrease temperature significantly. Move to a cooler location."
        else:
            temp_recommendation = "Maintain current temperature."

        plant_specific_advice = {
            "succulent": "Succulents prefer drier conditions and less frequent watering than most houseplants.",
            "cactus": "Cacti prefer dry, warm conditions and need infrequent watering.",
            "fern": "Ferns generally prefer higher humidity and regular watering. Consider misting regularly.",
            "orchid": "Orchids require bright, indirect light and should be watered thoroughly but infrequently."
        }.get(plant, "")

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
                "watering_frequency_days": watering_frequency,
                "light_adjustment": light_adjustment,
                "temperature_adjustment": temp_adjustment
            }
        }
        
        # add plant specific advice if it exists
        if plant_specific_advice:
            response["plant_specific_advice"] = plant_specific_advice
            
        
        result_summary = f"Plant Care Recommendations: Water every {watering_frequency} days. "

            
        response["result"] = result_summary
        
        return jsonify(response), 200
        
    except Exception as e:
        error_msg = f"Error in plant care analysis: {str(e)}"
        return jsonify({"error": error_msg}), 500

# register the endpoints for the fuzzy logic routes with the flask app
# robust handling logic for any failed requests
def register_fuzzy_logic_routes(app):

    # determine whether its production or deployment
    # if deployment, get the frontend url from the environment variables
    frontend_url = os.environ.get('FRONTEND_URL')
    ENV = os.environ.get('ENVIRONMENT', 'development')

    # determine the allowed origins based on the environment
    if ENV == 'production' and frontend_url:
        origins = [frontend_url]
    else:
        origins = [
            "http://127.0.0.1:3000",
            "http://localhost:3000"
        ]

    # configure CORS for the fuzzy logic routes to allow cross-origin requests
    CORS(app, resources={r"/api/fuzzy-logic/*": {"origins": origins}},
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         allow_headers=["Content-Type", "Authorization"],
         supports_credentials=True)

    # register the fuzzy logic routes
    app.route('/api/fuzzy-logic/comfort', methods=['POST'])(comfort_analysis)
    app.route('/api/fuzzy-logic/air-quality', methods=['POST'])(air_quality_analysis)
    app.route('/api/fuzzy-logic/light-comfort', methods=['POST'])(light_comfort_analysis)
    app.route('/api/fuzzy-logic/plant-care', methods=['POST'])(plant_care_analysis)

    # add routes without /api prefix for backward compatibility, robustness
    app.route('/fuzzy-logic/comfort', methods=['POST'])(comfort_analysis)
    app.route('/fuzzy-logic/air-quality', methods=['POST'])(air_quality_analysis)
    app.route('/fuzzy-logic/light-comfort', methods=['POST'])(light_comfort_analysis)
    app.route('/fuzzy-logic/plant-care', methods=['POST'])(plant_care_analysis)
