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

### Weather Readings Endpoints

- **Get All Weather Readings**
  - `GET /weather/all`: Retrieves all weather readings, limited to 100 entries.

- **Get Paged Weather Readings**
  - `GET /weather/paged/{page}`: Fetches weather readings in a paginated format.

- **Get Max Rain for Woodford Sensor**
  - `GET /weather/Woodford/{months}`: Retrieves maximum rainfall data for the Woodford sensor over a specified number of months.

- **Get Weather Data by Space and Time**
  - `GET /weather/spaceTime`: Fetches weather data for a specific device and date/time.

- **Get Weather Data by Device Name**
  - `GET /weather/deviceName/{deviceName}`: Retrieves maximum precipitation recorded in the last 5 months for a specified sensor.

- **Find Maximum Temperature**
  - `GET /weather/max-temperature`: Finds the maximum temperature recorded across all stations for a specified date/time range.

- **Get Specific Weather Reading by ID**
  - `GET /weather/specificReading/{id}`: Retrieves a specific weather reading by its ID.

- **Create a Weather Reading**
  - `POST /weather/createOne`: Allows the creation of a single weather reading.

- **Create Multiple Weather Readings**
  - `POST /weather/createMany`: Enables the creation of multiple weather readings at once.

- **Update Weather Reading**
  - `PATCH /weather/update`: Updates a specific weather reading.

- **Update Precipitation for Entries**
  - `PUT /entries/updatePrecipitation`: Updates precipitation values for specified entries.

- **Delete a Weather Reading by ID**
  - `DELETE /weather/delete/{id}`: Removes a specific weather reading by ID.

### User Endpoints

- **Get All Users**
  - `GET /users`: Retrieves a list of all users.

- **Get Specific User by ID**
  - `GET /users/{id}`: Fetches a specific user by their ID.

- **Get User by Authentication Key**
  - `GET /users/by-key/{authenticationKey}`: Retrieves a user by their authentication key.

- **Update User Information**
  - `PATCH /users/update`: Updates information for a specific user.

- **Update User Role**
  - `PUT /user/role`: Updates the role of a user based on date.

- **Create or Override User Information**
  - `PUT /user/{id}`: Creates or overrides information for a specific user by ID.

- **Delete a User by ID**
  - `DELETE /users/deleteOne/{id}`: Deletes a user by their ID.

- **Delete Multiple Users**
  - `DELETE /users/deleteMany/`: Deletes multiple users based on their IDs.


## Contributing

This project is designed for educational purposes and as a demonstration of skills in working with MongoDB and developing REST APIs. Suggestions for enhancements or improvements are welcome for academic exploration.

## License

This project is created for educational and demonstration use and is not intended for commercial deployment.

## Acknowledgements

- The educational institution for providing the project opportunity and raw data set.
- MongoDB documentation and community for guidance on database design and best practices.
