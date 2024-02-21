import { Router } from "express"
import { validate, validateWeatherData } from "../middleware/validator.js"
import { Weather } from "../models/weather.js"
import {
    create,
    createMany,
    deleteByID,
    getAll,
    getMaxRain,
    getMaxRainName,
    getById,
    getByPage,
    update,
    getWeatherData,
    getMaxTemperature,
    updatePrecipitation
} from "../models/weather-mdb.js"
import auth from "../middleware/auth.js"


const weatherController = Router()


const getWeatherListSchema = {
    type: "object",
    properties: {}
};

weatherController.get("/weather/all",

    [auth(["admin", "teacher", "student"]),
    validate({ body: getWeatherListSchema })],

    (req, res) => {
        // #swagger.tags = ['Weather Readings - GET']
        // #swagger.summary = 'Get all weather readings. (Limited to 100) '
        /*
         #swagger.parameters['authenticationKey'] = {
                in: 'header',
                required: true,
                example: "be39783e-0aaa-4fc8-b0d8-5e3f0a8b1465"    
            }
        */
        getAll().then(weather => {
            res.status(200).json({
                status: 200,
                message: "Get all weather readings. (Limited to 100)",
                weather: weather
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to get all weather readings"
            })
        })
    });



const getPaginatedWeatherReadingsSchema = {
    type: "object",
    required: ["page"],
    properties: {
        page: {
            type: "string",
            minLength: 1,
            pattern: "^\\d+$",
        },
    },
};

weatherController.get("/weather/paged/:page",

    [auth(["admin", "teacher", "student"]),
    validate({ params: getPaginatedWeatherReadingsSchema })],

    async (req, res) => {
        // #swagger.tags = ['Weather Readings - GET']
        // #swagger.summary = 'Get a collection of weather readings  in pages'
        /*
         #swagger.parameters['authenticationKey'] = {
                in: 'header',
                required: true,
                example: "be39783e-0aaa-4fc8-b0d8-5e3f0a8b1465"    
            }
        */
        const pageSize = 10;
        const page = parseInt(req.params.page);

        const { weatherReadings, totalCount } = await getByPage(page, pageSize);
        const totalPages = Math.ceil(totalCount / pageSize);


        res.status(200).json({
            status: 200,
            message: `Get paginated weather readings on page ${page} of ${totalPages}`,
            sightings: weatherReadings,
        })
    })

const getRainListSchema = {
    type: "object",
    properties: {}
};

weatherController.get("/weather/Woodford/:months",

    [auth(["admin", "teacher", "student"]),
    validate({ params: getRainListSchema })],

    (req, res) => {
        const months = req.params.months;
        // #swagger.tags = ['Weather Readings - GET']

        // #swagger.summary = 'Get max rain for the Woodford Sensor from all weather readings (currently limited to 10)'
        /* #swagger.parameters['months'] = {
                in: 'path',
                description: 'Define the period in months',
                
                required: true,
                example: '5'
        }
         #swagger.parameters['authenticationKey'] = {
                in: 'header',
                required: true,
                example: "be39783e-0aaa-4fc8-b0d8-5e3f0a8b1465"    
            }
        
        */
        getMaxRain(months).then(weather => {

            res.status(200).json({
                status: 200,
                message: `Get max rain of the last ${req.params.months} month(s) from all weather readings (limited to 10)`,
                weather: weather
            })
        }).catch(error => {

            res.status(500).json({
                status: 500,
                message: "Failed to get all weather readings"
            })
        })
    });



const getWeatherDataSchema = {
    type: "object",
    properties: {
        deviceName: {
            type: "string",
        },
        date: {
            type: "string",
            pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$",
        },

    },
    required: ["deviceName", "date"],
};

weatherController.get(
    "/weather/spaceTime",

    [auth(["admin", "teacher", "student"]),
    validate({ query: getWeatherDataSchema })],

    (req, res) => {

        const deviceName = req.query.deviceName;
        const date = req.query.date;
        // #swagger.tags = ['Weather Readings - GET']

        // #swagger.summary = 'Get weather data for a specific device and date and time'
        /* #swagger.parameters['deviceName'] = {
                in: 'query',
                description: 'Find the temperature, atmospheric pressure, radiation and precipitation recorded by a specific station at a given date and time. <br /> Name of the Weather Sensor like: <b>Woodford_Sensor, Noosa_Sensor, or Yandina_Sensor</b>',
                
                required: true,
                example: 'Noosa_Sensor'
        }
        #swagger.parameters['date'] = {
                in: 'query',
                description: 'Date and time in the format of: YYYY-MM-DD',
                required: true,
                example: '2022-12-05'
        }

         #swagger.parameters['authenticationKey'] = {
                in: 'header',
                required: true,    
                example: "be39783e-0aaa-4fc8-b0d8-5e3f0a8b1465"
            }
        
        */

        getWeatherData(deviceName, date)
            .then((weather) => {
                if (weather === 0) {
                    res.status(404).json({
                        status: 404,
                        message: "No matching entries found",

                    });
                } else {

                    res.status(200).json({
                        status: 200,
                        message: `Weather data for ${deviceName} at ${date}`,
                        weather: weather,
                    });
                }
            })

            .catch((error) => {
                res.status(500).json({
                    status: 500,
                    message: "Failed to get weather data",
                });
            });
    }
);

const getRainNameSchema = {
    type: "object",
    properties: {
        deviceName: {
            type: "string"
        }
    },
    required: ["deviceName"]
};


weatherController.get(
    "/weather/deviceName/:deviceName",

    [auth(["admin", "teacher", "student"]),
    validate({ params: getRainNameSchema })],

    (req, res) => {
        const deviceName = req.params.deviceName;
        // #swagger.tags = ['Weather Readings - GET']
        // #swagger.summary = 'Get the maximum precipitation recorded in the last 5 Months for a specific sensor'
        /* #swagger.parameters['deviceName'] = { 
            in: 'path', 
             description: 'Find the maximum precipitation recorded in the last 5 Months for a specific sensor, returning the sensor name, reading date and time and the precipitation value (single / projection). 
             <br /> Name of the Weather Sensor like: <b>Woodford_Sensor or Noosa_Sensor or Yandina_Sensor </b>', 
             required: true, 
              example: "Woodford_Sensor" } 
         
         #swagger.parameters['authenticationKey'] = {
                in: 'header',
                required: true,    
                example: "be39783e-0aaa-4fc8-b0d8-5e3f0a8b1465"
            }
        
        */

        getMaxRainName(deviceName)
            .then((weather) => {
                res.status(200).json({
                    status: 200,
                    message:
                        `Get max rain from the last 5 months from the ${req.params.deviceName}`,
                    weather: weather,
                });
            })
            .catch((error) => {
                res.status(500).json({
                    status: 500,
                    message: "Failed to get max rain",
                });
            });
    }
);






const getMaxTemperatureSchema = {
    type: "object",
    properties: {
        startDate: {
            type: "string",
            pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
        },
        endDate: {
            type: "string",
            pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
        },
    },
    required: ["startDate", "endDate"],
};

weatherController.get(
    "/weather/max-temperature",

    [auth(["admin", "teacher", "student"]),
    validate({ query: getMaxTemperatureSchema })],

    // #swagger.tags = ['Weather Readings - GET']

    // #swagger.summary = 'Find the maximum Temp(C) recorded for all stations for a given Date / Time range (start and finish date)'
    /* #swagger.parameters['startDate'] = {
            in: 'query',
            description: 'Start Date in the format of: YYYY-MM-DD',
            
            required: true,
            example: '2022-06-05'
    }
    #swagger.parameters['endDate'] = {
            in: 'query',
            description: 'End Date in the format of: YYYY-MM-DD',
            required: true,
            example: '2022-12-05'
    }
    
    #swagger.parameters['authenticationKey'] = {
                in: 'header',
                required: true,
                example: "be39783e-0aaa-4fc8-b0d8-5e3f0a8b1465"    
                }
        
    */

    (req, res) => {

        const startDate = new Date(req.query.startDate);
        const endDate = new Date(req.query.endDate);

        getMaxTemperature(startDate, endDate)
            .then((results) => {
                res.status(200).json({
                    status: 200,
                    message: `Maximum temperature recorded for all stations between ${startDate} and ${endDate}`,
                    results: results,
                });
            })
            .catch((error) => {
                res.status(500).json({
                    status: 500,
                    message: "Failed to get maximum temperature data",
                });
            });
    }
);


const createWeatherSchema = {
    type: "object",
    required: ["device_name", "precipitation", "latitude", "longitude", "temperature", "atmospheric_pressure", "max_wind_speed", "solar_radiation", "vapor_pressure", "humidity", "wind_direction"],
    properties: {
        device_name: {
            type: "string"
        },
        precipitation: {
            type: "number",
            minimum: 0,
            maximum: 9999,
        },
        latitude: {
            type: "number",
            minimum: -180,
            maximum: 180,
        },
        longitude: {
            type: "number",
            minimum: -180,
            maximum: 180,
        },
        temperature: {
            type: "number",
            minimum: -100,
            maximum: 100,
        },
        atmospheric_pressure: {
            type: "number",
            minimum: 80,
            maximum: 135,
        },
        max_wind_speed: {
            type: "number",
            minimum: 0,
            maximum: 135,
        },
        solar_radiation: {
            type: "number",
            minimum: 0,
            maximum: 3500,
        },
        vapor_pressure: {
            type: "number",
            minimum: -1,
            maximum: 10,
        },
        humidity: {
            type: "number",
            minimum: -10,
            maximum: 999
        },
        wind_direction: {
            type: "number",
            minimum: 0,
            maximum: 360,
        }

    }
};
weatherController.post("/weather/createOne",

    [auth(["admin", "teacher", "student"]),
    validate({ body: createWeatherSchema })],

    (req, res) => {
        // #swagger.tags = ['Weather Readings - POST']
        // #swagger.summary = "Create a weather reading."
        /* #swagger.requestBody = {
            description: "Adding new weather reading",
            content: {
                'application/json': {
                    schema: {
                        device_name: 'string',
                        precipitation: 'number',
                        latitude: 'number',
                        longitude: 'number',
                        temperature: 'number',
                        atmospheric_pressure: 'number',
                        max_wind_speed: 'number',
                        solar_radiation: 'number',
                        vapor_pressure: 'number',
                        humidity: 'number',
                        wind_direction: 'number'


                    },
                    example: {
                        "device_name": "Woodford_Sensor",
                        "precipitation": 0.085,
                        "latitude": 152.77891,
                        "longitude": -26.95064,
                        "temperature": 23.07,
                        "atmospheric_pressure": 128.02,
                        "max_wind_speed": 3.77,
                        "solar_radiation": 290.5,
                        "vapor_pressure": 1.72,
                        "humidity": 71.9,
                        "wind_direction": 163.3
                    }
                }
            }
        } 
        #swagger.parameters['authenticationKey'] = {
                in: 'header',
                required: true, 
                example: "be39783e-0aaa-4fc8-b0d8-5e3f0a8b1465"   
                }
        
        */

        const weatherData = req.body
        const validationResult = validateWeatherData(weatherData.temperature, weatherData.humidity);

        if (!validationResult.isValid) {
            res.status(400).json({
                status: 400,
                message: validationResult.message,
            });
            return;
        }
        const weather = Weather(null, weatherData)

        create(weather).then(weather => {
            res.status(200).json({

                status: 200,
                message: "Created weather reading",
                weather: weather,

            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: `Failed to created weather reading ${error}`,
            })
        })
    })

const createManyWeatherSchema = {
    type: "array",
    required: ["device_name", "precipitation", "latitude", "longitude", "temperature", "atmospheric_pressure", "max_wind_speed", "solar_radiation", "vapor_pressure", "humidity", "wind_direction"],
    properties: {
        device_name: {
            type: "string"
        },
        precipitation: {
            type: "number",
            minimum: 0,
            maximum: 9999,
        },
        latitude: {
            type: "number",
            minimum: -180,
            maximum: 180,
        },
        longitude: {
            type: "number",
            minimum: -180,
            maximum: 180,
        },
        temperature: {
            type: "number",
            minimum: -100,
            maximum: 100,
        },
        atmospheric_pressure: {
            type: "number",
            minimum: 80,
            maximum: 135,
        },
        max_wind_speed: {
            type: "number",
            minimum: 0,
            maximum: 135,
        },
        solar_radiation: {
            type: "number",
            minimum: 0,
            maximum: 3500,
        },
        vapor_pressure: {
            type: "number",
            minimum: -1,
            maximum: 10,
        },
        humidity: {
            type: "number",
            minimum: -10,
            maximum: 999
        },
        wind_direction: {
            type: "number",
            minimum: 0,
            maximum: 360,
        }

    }
};
weatherController.post("/weather/createMany",

    [auth(["admin", "teacher", "student"]),
    validate({ body: createManyWeatherSchema })],

    (req, res) => {
        // #swagger.tags = ['Weather Readings - POST']
        // #swagger.summary = "Create multiple weather readings."
        /*
        #swagger.parameters['authenticationKey'] = {
                in: 'header',
                required: true,  
                example: "be39783e-0aaa-4fc8-b0d8-5e3f0a8b1465"  
                }
        
        #swagger.requestBody = {
            description: "Adding multiple new weather readings",
            content: {
                'application/json': {
                    schema: {
                        device_name: 'string',
                        precipitation: 'number',
                        latitude: 'number',
                        longitude: 'number',
                        temperature: 'number',
                        atmospheric_pressure: 'number',
                        max_wind_speed: 'number',
                        solar_radiation: 'number',
                        vapor_pressure: 'number',
                        humidity: 'number',
                        wind_direction: 'number'
 
 
                    },
                    example: ([{
                        "device_name": "Woodford_Sensor 1",
                        "precipitation": 0.085,
                        "latitude": 152.77891,
                        "longitude": -26.95064,
                        "temperature": 23.07,
                        "atmospheric_pressure": 128.02,
                        "max_wind_speed": 3.77,
                        "solar_radiation": 290.5,
                        "vapor_pressure": 1.72,
                        "humidity": 71.9,
                        "wind_direction": 163.3
                    },
                {
                        "device_name": "Woodford_Sensor 2",
                        "precipitation": 0.085,
                        "latitude": 152.77891,
                        "longitude": -26.95064,
                        "temperature": 23.07,
                        "atmospheric_pressure": 128.02,
                        "max_wind_speed": 3.77,
                        "solar_radiation": 290.5,
                        "vapor_pressure": 1.72,
                        "humidity": 71.9,
                        "wind_direction": 163.3
                    },
                {
                        "device_name": "Woodford_Sensor 3",
                        "precipitation": 0.085,
                        "latitude": 152.77891,
                        "longitude": -26.95064,
                        "temperature": 23.07,
                        "atmospheric_pressure": 128.02,
                        "max_wind_speed": 3.77,
                        "solar_radiation": 290.5,
                        "vapor_pressure": 1.72,
                        "humidity": 71.9,
                        "wind_direction": 163.3
                    },
                {
                        "device_name": "Woodford_Sensor 4",
                        "precipitation": 0.085,
                        "latitude": 152.77891,
                        "longitude": -26.95064,
                        "temperature": 23.07,
                        "atmospheric_pressure": 128.02,
                        "max_wind_speed": 3.77,
                        "solar_radiation": 290.5,
                        "vapor_pressure": 1.72,
                        "humidity": 71.9,
                        "wind_direction": 163.3
                    },
                {
                        "device_name": "Woodford_Sensor 5",
                        "precipitation": 0.085,
                        "latitude": 152.77891,
                        "longitude": -26.95064,
                        "temperature": 23.07,
                        "atmospheric_pressure": 128.02,
                        "max_wind_speed": 3.77,
                        "solar_radiation": 290.5,
                        "vapor_pressure": 1.72,
                        "humidity": 71.9,
                        "wind_direction": 163.3
                    }])
                }
            }
        } */

        const weatherDataArray = req.body


        // const weatherArray = weatherDataArray.map(data => Weather(null, data));
        const weatherArray = [];
        const validationErrors = [];

        weatherDataArray.forEach((data, index) => {
            const validationResult = validateWeatherData(data.temperature, data.humidity);
            if (!validationResult.isValid) {
                validationErrors.push({ index, message: validationResult.message });
            } else {
                weatherArray.push(Weather(null, data));
            }
        });

        if (validationErrors.length > 0) {
            res.status(400).json({
                status: 400,
                message: "Some weather readings have invalid data.",
                errors: validationErrors,
            });
            return;
        }

        createMany(weatherArray).then(weather => {

            res.status(200).json({
                status: 200,
                message: "Created multiple weather readings",
                weather: weather,
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: `Failed to multiple weather readings. Error: ${error}`,
            })
        })
    })

const updateWeatherSchema = {
    type: "object",
    required: ["id"],
    properties: {
        id: {
            type: "string",
        },
        device_name: {
            type: "string",
            default: null,
        },
        precipitation: {
            type: "number",
            minimum: 0,
            maximum: 9999,
            default: null,
        },
        latitude: {
            type: "number",
            minimum: -180,
            maximum: 180,
            default: null,
        },
        longitude: {
            type: "number",
            minimum: -180,
            maximum: 180,
            default: null,
        },
        temperature: {
            type: "number",
            minimum: -100,
            maximum: 100,
            default: null,
        },
        atmospheric_pressure: {
            type: "number",
            minimum: 80,
            maximum: 135,
            default: null,
        },
        max_wind_speed: {
            type: "number",
            minimum: 0,
            maximum: 135,
            default: null,
        },
        solar_radiation: {
            type: "number",
            minimum: 0,
            maximum: 3500,
            default: null,
        },
        vapor_pressure: {
            type: "number",
            minimum: -1,
            maximum: 10,
            default: null,
        },
        humidity: {
            type: "number",
            minimum: -10,
            maximum: 999,
            default: null,
        },
        wind_direction: {
            type: "number",
            minimum: 0,
            maximum: 360,
            default: null,
        }
    }
};


weatherController.patch("/weather/update",

    [auth(["admin", "teacher", "student"]),
    validate({ body: updateWeatherSchema })],

    (req, res) => {
        // #swagger.tags = ['Weather Readings - PATCH']

        // #swagger.summary = "Update a weather readings."
        /*
        #swagger.parameters['authenticationKey'] = {
                in: 'header',
                required: true, 
                example: "be39783e-0aaa-4fc8-b0d8-5e3f0a8b1465"   
        }
        
        #swagger.requestBody = {
            description: "Update an existing weather reading",
            content: {
                'application/json': {
                    schema: {
                        id: 'string',
                        device_name: 'string',
                        precipitation: 'number',
                        latitude: 'number',
                        longitude: 'number',
                        temperature: 'number',
                        atmospheric_pressure: 'number',
                        max_wind_speed: 'number',
                        solar_radiation: 'number',
                        vapor_pressure: 'number',
                        humidity: 'number',
                        wind_direction: 'number'
    
    
                    },
                    example: {
                        "id": "641a6bf00e2c74fca47ea4a1",
                        "device_name": "Woodford_Sensor",
                        "precipitation": 0.085,
                        "latitude": 152.77891,
                        "longitude": -26.95064,
                        "temperature": 23.07,
                        "atmospheric_pressure": 128.02,
                        "max_wind_speed": 3.77,
                        "solar_radiation": 290.5,
                        "vapor_pressure": 1.72,
                        "humidity": 71.9,
                        "wind_direction": 163.3
                    }
                }
            }
        } */
        const { id, ...weatherData } = req.body
        const validationResult = validateWeatherData(weatherData.temperature, weatherData.humidity);

        if (!validationResult.isValid) {
            res.status(400).json({
                status: 400,
                message: validationResult.message,
            });
            return;
        }
        const weather = Weather(id, weatherData)

        update(weather).then(weather => {
            if (weather.modifiedCount === 0) {
                res.status(404).json({
                    status: 404,
                    message: "No matching entries found",
                    id: id
                });
            } else {
                res.status(200).json({
                    status: 200,
                    message: `Update weather reading with ${weather}`,
                    weather: weather
                })
            }
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to update weather data",
            })
        })
    })




const updatePrecipitationSchema = {
    type: "object",
    properties: {
        id: {
            type: "string",
        },
        precipitation: {
            type: "number",
        },
    },
    required: ["id", "precipitation"],
};

weatherController.put(
    "/entries/updatePrecipitation",

    [auth(["admin", "teacher", "student"]),
    validate({ body: updatePrecipitationSchema })],

    async (req, res) => {
        // #swagger.tags = ['Weather Readings - PUT']

        // #swagger.summary = 'Update precipitation for specified entries'
        /*
         #swagger.parameters['authenticationKey'] = {
                in: 'header',
                required: true,
                example: "be39783e-0aaa-4fc8-b0d8-5e3f0a8b1465"    
            }
        
         #swagger.requestBody = {
              content: {
                  'application/json': {
                      schema: {
                          type: 'object',
                          properties: {
                              id: {
                                  type: 'string',
                                  
                              },
                              precipitation: {
                                  type: 'number',
                              },
                          },
                          required: ['id', 'precipitation'],
                      },
                      example: {
                          id: '641a6bf00e2c74fca47ea4a8',
                          precipitation: 50,
                      },
                  },
              },
          } */

        const { id, precipitation } = req.body;

        updatePrecipitation(id, precipitation)
            .then((weather) => {



                if (weather.modifiedCount === 0) {
                    res.status(404).json({
                        status: 404,
                        message: "No matching entries found",
                        id: id
                    });
                } else {
                    res.status(200).json({
                        status: 200,
                        message: `${weather.modifiedCount} entries updated`,
                        id: id,
                    });
                }
            })
            .catch((error) => {
                res.status(500).json({
                    status: 500,
                    message: "Error updating entries",
                });
            });
    }
);

const getWetherByIDSchema = {
    type: "object",
    properties: {
        id: {
            type: "string",
            pattern: "^[0-9a-z]+$"
        }
    }
};

weatherController.get("/weather/specificReading/:id",

    [auth(["admin", "teacher", "student"]),
    validate({ params: getWetherByIDSchema })],

    (reg, res) => {
        // #swagger.tags = ['Weather Readings - GET']

        // #swagger.summary = "Get a specific weather reading by ID."
        /*
         #swagger.parameters['authenticationKey'] = {
                in: 'header',
                required: true,
                example: "be39783e-0aaa-4fc8-b0d8-5e3f0a8b1465"    
            }
        */
        const weatherID = reg.params.id

        getById(weatherID).then(weather => {
            if (weather === null) {
                res.status(404).json({
                    status: 404,
                    message: `No Weather Reading with ID ${weatherID} found`,
                });
            } else {
                res.status(200).json({
                    status: 200,
                    message: "Get weather reading by ID",
                    weather: weather
                })
            }
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to get weather by ID",
            })

        })
    });


const deleteWeatherSchema = {
    type: "object",
    required: ["id"],
    properties: {
        id: {
            type: "string",
            pattern: "^[0-9a-z]+$"
        },
    }
};

weatherController.delete("/weather/delete/:id",

    [auth(["admin", "teacher"]),
    validate({ params: deleteWeatherSchema })],
    (req, res) => {
        // #swagger.tags = ['Weather Readings - DELETE']


        // #swagger.summary = "Delete a weather reading by ID."
        /*
         #swagger.parameters['authenticationKey'] = {
                in: 'header',
                required: true, 
                example: "be39783e-0aaa-4fc8-b0d8-5e3f0a8b1465"   
            }
        
         #swagger.parameters['ID'] = {
            in: 'path',
            description: 'Delete Weather By ID',
            required: true,
            example: '641a6bf00e2c74fca47ea4a8'
        }
        */

        const weatherID = req.params.id

        deleteByID(weatherID).then(weather => {

            if (weather.deletedCount === 0) {
                res.status(404).json({
                    status: 404,
                    message: `No Weather Reading with ID ${weatherID} found`,
                });
            } else {
                res.status(200).json({
                    status: 200,
                    message: `${weather.deletedCount} Weather reading with ID ${weatherID} was deleted`,
                })
            }
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to delete weather reading",
            })
        })

    })

export default weatherController





