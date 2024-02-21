import { response } from "express";
import { Validator, ValidationError } from "express-json-validator-middleware";

// Create validator object
const validator = new Validator()

// Export validate middleware for use in endpoints
export const validate = validator.validate

// Export error handling middleware
export const validateErrorMiddleware = (error, req, res, next) => {
    if (response.headersSent) {
        return next(error)
    }
    const isValidationError = error instanceof ValidationError
    if (!isValidationError) {
        return next(error)
    }
    res.status(400).json({
        status: 400,
        message: "Validation error",
        error: error.validationErrors,

    })
}

export function validateWeatherData(temperature, humidity) {
    if (humidity > 100) {
        return { isValid: false, message: "Humidity cannot be greater than 100%" };
    }
    if (temperature > 60) {
        return { isValid: false, message: "Temperature cannot be greater than 60 degrees Celsius" };
    }
    if (temperature < -50) {
        return { isValid: false, message: "Temperature cannot be less than -50 degrees Celsius" };
    }
    return { isValid: true };
}

