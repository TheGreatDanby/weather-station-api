# MongoDB REST API for Climate Data Analysis

This repository houses a project developed for an educational institution to analyze climate data collected in QLD using a distributed Internet of Things Sensor network. The RESTful API is designed to interact with a MongoDB database, containing a collection of weather data and user information.

## Project Overview

The API is crafted to manage and query a dataset representing weather recordings from various locations on the Sunshine Coast. The data, provided in JSON format, encompasses various data points relating to weather observations. The project includes robust user authentication and authorization features, with specific roles allocated to teachers and students.

## Features

- **Weather Data Management**: Insertion and querying of weather data from IoT sensors across different areas.
- **User Management**: Creation and management of user accounts with distinct access levels, including teacher and student roles.
- **Data Partitioning**: Effective data field selection to partition current and future data for maximum efficiency.
- **Indexing and TTL**: Implementation of indexing for optimized data retrieval and TTL settings for document auto-removal.
- **Triggers**: Creation of triggers to maintain data integrity and update document values based on specified conditions.
- **Security**: Ensuring data encryption in transit and at rest, along with secure API authentication and authorization mechanisms.

## Technology Stack

- **Node.js**: The core environment for running the server-side code.
- **Express**: A web application framework for Node.js, used for building the REST API.
- **MongoDB**: The NoSQL database used to store and manage the large dataset of climate data.
- **Bcryptjs**: Utilized for hashing and securing sensitive information.
- **CORS (Cross-Origin Resource Sharing)**: Middleware to enable CORS for the API, allowing resources to be requested from another domain.
- **Express JSON Validator Middleware**: Middleware for validating JSON data structures against JSON Schema.
- **Swagger UI Express**: Allows API documentation to be served in a user-friendly manner with Swagger UI.
- **UUID**: Library for the generation of RFC4122 UUIDs, useful for creating unique identifiers.
- **Nodemon** (Dev Dependency): Utility that monitors for any changes in your source and automatically restarts your server, improving the development process.
- **Swagger Autogen** (Dev Dependency): Tool for automatically generating Swagger documentation based on your Express routes and JSDoc comments.

This stack provides a robust setup for developing, documenting, and deploying a RESTful API to interact with climate data, ensuring data integrity, security, and ease of use for end users.

## API Endpoints

- **Insert a New Reading for a Weather Station**: `POST /weather-data`
- **Insert a New User**: `POST /user`
- **Insert Multiple Sensor Readings for a Single Station**: `POST /weather-data/batch`
- **Find Maximum Precipitation for a Sensor**: `GET /weather-data/precipitation/max`
- **Retrieve Specific Weather Data by Station and Time**: `GET /weather-data/{stationId}`
- **Find Maximum Temperature Across Stations**: `GET /weather-data/temperature/max`
- **Query with Index Key**: `GET /query-index`
- **Delete a User by ID**: `DELETE /user/{userId}`
- **Delete Inactive Users**: `DELETE /users/inactive`
- **Update Precipitation Value**: `PATCH /weather-data/{dataId}/precipitation`
- **Update User Access Levels**: `PATCH /users/access-levels`

## Contributing

This project is designed for educational purposes and as a demonstration of skills in working with MongoDB and developing REST APIs. Suggestions for enhancements or improvements are welcome for academic exploration.

## License

This project is created for educational and demonstration use and is not intended for commercial deployment.

## Acknowledgements

- The educational institution for providing the project opportunity and raw data set.
- MongoDB documentation and community for guidance on database design and best practices.
