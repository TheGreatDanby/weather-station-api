import { Router } from "express";
import bcrypt from "bcryptjs";
import { v4 as uuid4 } from "uuid";
import { validate } from "../middleware/validator.js";
import { User } from "../models/user.js";
import auth from "../middleware/auth.js";
import {
    create,
    deleteByID,
    deleteManyByID,
    getAll,
    getByAuthenticationKey,
    getByEmail,
    getByID,
    update,
    updateUserRole,
} from "../models/user-mdb.js";

const userController = Router();


// Get user list endpoint
const getUserListSchema = {
    type: "object",
    properties: {},
};

userController.get(
    "/users",
    [auth(["admin", "teacher"]),
    validate({ body: getUserListSchema })],
    async (req, res) => {
        // #swagger.tags = ['Users - GET']

        // #swagger.summary = 'Get a list with all users'
        /*
            #swagger.parameters['authenticationKey'] = {
                in: 'header',
                required: true,
                example: "be39783e-0aaa-4fc8-b0d8-5e3f0a8b1465"
            }
            */
        const users = await getAll();
        res.status(200).json({
            status: 200,
            message: "List of all Users",
            users: users,
        });
    }
);

// Get user by ID endpoint
const getUserByIDSchema = {
    type: "object",
    required: ["id"],
    properties: {
        id: {
            type: "string",
        },
    },
};

userController.get(
    "/users/:id",
    [auth(["admin", "teacher"]), validate({ params: getUserByIDSchema })],
    (req, res) => {
        // #swagger.tags = ['Users  - GET']

        // #swagger.summary = 'Get a specific user by ID'
        /*
            #swagger.parameters['authenticationKey'] = {
                in: 'header',
                required: true,
                example: "be39783e-0aaa-4fc8-b0d8-5e3f0a8b1465"

                
            }
            */
        const userID = req.params.id;

        getByID(userID)
            .then((user) => {
                res.status(200).json({
                    status: 200,
                    message: "Get a user by ID",
                    user: user,
                });
            })
            .catch((error) => {
                res.status(500).json({
                    status: 500,
                    message: "No user by this ID",
                });
            });
    }
);

// Get user by authentication key endpoint
const getUserByAuthenticationKeySchema = {
    type: "object",
    required: ["authenticationKey"],
    properties: {
        authenticationKey: {
            type: "string",
        },
    },
};

userController.get(
    "/users/by-key/:authenticationKey",
    [auth(["admin"]), validate({ params: getUserByAuthenticationKeySchema })],
    (req, res) => {
        // #swagger.tags = ['Users  - GET']

        // #swagger.summary = 'Get a user by the authentication key '

        /*
        #swagger.parameters['authenticationKey'] = {
                in: 'header',
                required: true,
                example: "be39783e-0aaa-4fc8-b0d8-5e3f0a8b1465"
    
            }
        */

        const authenticationKey = req.params.authenticationKey;

        getByAuthenticationKey(authenticationKey)
            .then((user) => {
                res.status(200).json({
                    status: 200,
                    message: "Get user by authentication key",
                    user: user,
                });
            })
            .catch((error) => {
                res.status(500).json({
                    status: 500,
                    message: "No user with authentication key",
                });
            });
    }
);

// User login endpoint
const postUserLoginSchema = {
    type: "object",
    required: ["email", "password"],
    properties: {
        email: {
            pattern: "^[a-zA-Z0-9]+@[a-zA-Z0-9]+.[a-zA-Z0-9]+$",
            type: "string",
        },
        password: {
            type: "string",
        },
        lastLogin: {
            type: "string",
            default: "date-time",
        },
    },
};

userController.post(
    "/users/login",

    validate({ body: postUserLoginSchema }),
    (req, res) => {
        // #swagger.tags = ['Users  - POST']

        // #swagger.summary = 'User Login'

        // access request body

        /* #swagger.requestBody = {
                description: "User Login",
                content: {
                    'application/json': {
                        schema: {
                            email: 'string',
                            password: 'number'
                        },
                        example: {
                            "email": "email@server.com",
                            "password": "password"
                        }
                    }
                }
            } */
        const loginData = req.body;

        getByEmail(loginData.email)
            .then((user) => {
                if (bcrypt.compareSync(loginData.password, user.password)) {
                    user.authenticationKey = uuid4().toString();

                    user.lastLogin = new Date();

                    update(user).then((result) => {
                        res.status(200).json({
                            status: 200,
                            message: "Login Successful",
                            authenticationKey: user.authenticationKey,
                        });
                    });
                } else {
                    res.status(400).json({
                        status: 400,
                        message: "Email or Password are incorrect!",
                    });
                }
            })
            .catch((error) => {
                res.status(500).json({
                    status: 500,
                    message: "Login Unsuccessful!",
                });
            });
    }
);

// User logout endpoint
const postUserLogoutSchema = {
    type: "object",
    required: ["authenticationKey"],
    properties: {
        authenticationKey: {
            type: "string",
        },
    },
};

userController.post(
    "/users/logout",
    validate({ body: postUserLogoutSchema }),
    (req, res) => {
        // #swagger.tags = ['Users  - POST']

        // #swagger.summary = 'User Logout'
        // access request body
        /* #swagger.requestBody = {
                description: "User Logout",
                content: {
                    'application/json': {
                        schema: {
                            authenticationKey: 'string',
                        },
                        example: {
                            "authenticationKey": "22ebfdea-7535-43b4-9436-7ca2ab9f2408",
                        }
                    }
                }
            } */

        const authenticationKey = req.body.authenticationKey;
        getByAuthenticationKey(authenticationKey)
            .then((user) => {
                user.authenticationKey = null;
                update(user).then((user) => {
                    res.status(200).json({
                        status: 200,
                        message: "Logout Successful",
                    });
                });
            })
            .catch((error) => {
                res.status(500).json({
                    status: 500,
                    message: "Already logged out",
                });
            });
    }
);


// Create user endpoint
const createUserSchema = {
    type: "object",
    required: [
        "email",
        "password",
        "role",
        "firstName",
        "lastName",
        // "authenticationKey"
    ],
    properties: {
        email: {
            type: "string",
        },
        password: {
            type: "string",
        },
        role: {
            type: "string",
        },
        firstName: {
            type: "string",
        },
        lastName: {
            type: "string",
        },
    },
};

userController.post(
    "/users",
    [auth(["admin", "teacher"]),
    validate({ body: createUserSchema })],
    (req, res) => {
        // #swagger.tags = ['Users  - POST']

        // #swagger.summary = 'Create a user'
        // access request body

        /* 
        #swagger.parameters['authenticationKey'] = {
                in: 'header',
                required: true,    
                example: "be39783e-0aaa-4fc8-b0d8-5e3f0a8b1465"
            }
             #swagger.parameters['authenticationKey'] = {
                in: 'header',
                required: true,    
            }
            #swagger.requestBody = {
                description: "User Login",
                content: {
                    'application/json': {
                        schema: {
                            email: 'string',
                            password: 'number',
                            role: 'string',
                            firstName: 'string',
                            lastName: 'string',
                            
                            
                        },
                        example: {
                            "email": "email@server.com",
                            "password": "password",
                            "role": 'role',
                            "firstName": 'Firstname',
                            "lastName": 'Lastname',
                            
                        }
                    }
                }
            } */

        // Get the user data out of the request
        const { id, ...userData } = req.body;

        // hash the password if it isn't already hashed
        if (!userData.password.startsWith("$2a")) {
            userData.password = bcrypt.hashSync(userData.password);
        }

        // Convert the user data into an User model object
        const user = User(id, userData);

        // Use the create model function to insert this user into the DB
        create(user)
            .then((user) => {
                res.status(200).json({
                    status: 200,
                    message: "User created Successfully",
                    user: user,
                });
            })
            .catch((error) => {
                res.status(500).json({
                    status: 500,
                    message: "No User created!",
                });
            });
    }
);

// Register user endpoint
const registerUserSchema = {
    type: "object",
    required: ["email", "password", "firstName", "lastName"],
    properties: {
        email: {
            type: "string",
        },
        password: {
            type: "string",
        },
        firstName: {
            type: "string",
        },
        lastName: {
            type: "string",
        },
    },
};
userController.post(
    "/users/register",
    validate({ body: registerUserSchema }),
    (req, res) => {
        // #swagger.tags = ['Users  - POST']

        // #swagger.summary = 'Register a user'
        // access request body
        /* #swagger.requestBody = {
                description: "Register a new User",
                content: {
                    'application/json': {
                        schema: {
                            email: 'string',
                            password: 'number',
                            firstName: 'string',
                            lastName: 'string',
                        },
                        example: {
                            "email": "email@server.com",
                            "password": "password",
                            "firstName": 'Firstname',
                            "lastName": 'Lastname',
                        }
                    }
                }
            } */

        // Get the user data out of the request
        const { id, ...userData } = req.body;

        // hash the password
        userData.password = bcrypt.hashSync(userData.password);

        // Convert the user data into an User model object
        const user = User(id, userData);

        // Use the create model function to insert this user into the DB
        create(user)
            .then((user) => {
                res.status(200).json({
                    status: 200,
                    message: "Registration successful",
                    user: user,
                });
            })
            .catch((error) => {
                res.status(500).json({
                    status: 500,
                    message: "Registration failed",
                });
            });
    }
);

// Update user endpoint
const updateUserSchema = {
    type: "object",
    required: ["id"],
    properties: {
        id: {
            type: "string",
        },
        email: {
            type: "string",
        },
        password: {
            type: "string",
        },
        role: {
            type: "string",
        },
        firstName: {
            type: "string",
        },
        lastName: {
            type: "string",
        },
        authenticationKey: {
            type: ["string", "null"],
        },
    },
};

userController.patch(
    "/users/update",
    [auth(["admin", "teacher"]), validate({ body: updateUserSchema })],
    async (req, res) => {
        // #swagger.tags = ['Users  - PATCH']

        // #swagger.summary = 'Only Update a value for a specific a user'
        // access request body
        /* 
        #swagger.parameters['authenticationKey'] = {
                in: 'header',
                required: true,
                example: "be39783e-0aaa-4fc8-b0d8-5e3f0a8b1465"   

            }
        #swagger.requestBody = {
                description: "Update a existing User ",
                content: {
                    'application/json': {
                        schema: {
                            id: 'string',
                            email: 'string',
                            password: 'number',
                            role: 'string',
                            firstName: 'string',
                            lastName: 'string',
                            authenticationKey: 'string'
                        },
                        example: {
                            "id": "641a6bf00e2c74fca47ea4a1",
                            "email": "email@server.com",
                            "password": "password",
                            "role": 'role',
                            "firstName": 'Firstname',
                            "lastName": 'Lastname',
                            "authenticationKey": 'authenticationKey'
                        }
                    }
                }
            } */

        // Get the user data out of the request
        const { id, ...userData } = req.body;

        // hash the password if it isn't already hashed
        if (userData.password && !userData.password.startsWith("$2a")) {
            userData.password = await bcrypt.hashSync(userData.password);
        }

        // Convert the user data into a User model object
        const user = User(id, userData);

        // Use the update model function to update this user in the DB
        update(user)
            .then((user) => {
                res.status(200).json({
                    status: 200,
                    message: "User has been updated",
                    user: user,
                });
            })
            .catch((error) => {
                res.status(500).json({
                    status: 500,
                    message: "User update failed",
                });
            });
    }
);

const updateUserRoleSchema = {
    type: 'object',
    properties: {
        startDate: {
            type: 'string',
            pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
        },
        endDate: {
            type: 'string',
            pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
        },
        newRole: {
            type: 'string'
        }
    },
    required: ['startDate', 'endDate', 'newRole']
};

userController.put(
    "/user/role",
    [
        auth(["admin", "teacher"]),
        validate({ body: updateUserRoleSchema }),
    ],
    (req, res) => {
        // #swagger.tags = ['Users  - PUT']

        // #swagger.summary = "Update user role by date."
        // access request body
        /* 
        #swagger.parameters['authenticationKey'] = {
                in: 'header',
                required: true,
                example: "be39783e-0aaa-4fc8-b0d8-5e3f0a8b1465"    
            }
        #swagger.requestBody = {
        description: "Update access level for at least two users in the same query, based on a date range in which the users were created.
        Start Date in the format of: YYYY-MM-DD, 
        End Date in the format of: YYYY-MM-DD and 
        New User Role. Admin, Teacher or Student ",
        

        content: {
                    'application/json': {
                        schema: {
                            startDate: 'string',
                            endDate: 'string',
                            newRole: 'string'
                        },
                        example: {
                            "startDate": "2023-05-01",
                            "endDate": "2023-05-07",
                            "newRole": "Teacher"
                        }
                    }
                }
            }
            */


        const { startDate, endDate, newRole } = req.body;

        updateUserRole(new Date(startDate), new Date(endDate), newRole)
            .then((user) => {
                res.status(200).json({
                    status: 200,
                    message: "User role has been updated",
                    user: user,
                });
            })
            .catch((error) => {
                res.status(500).json({
                    status: 500,
                    message: "User role update failed",
                });
            });


    }
);

userController.put(
    "/user/:id",
    [
        auth(["admin", "teacher"]),
        validate({ body: updateUserSchema }),
    ],
    (req, res) => {
        // #swagger.tags = ['Users  - PUT']

        // #swagger.summary = "Create or Override a value for a specific user by ID."
        // access request body
        /* 
        #swagger.parameters['authenticationKey'] = {
                in: 'header',
                required: true, 
                example: "be39783e-0aaa-4fc8-b0d8-5e3f0a8b1465"   
            }
        #swagger.requestBody = {
                description: "Create or Override a value for a specific user by ID",
                content: {
                    'application/json': {
                        schema: {
                            email: 'string',
                            password: 'number',
                            firstName: 'string',
                            lastName: 'string',
                        },
                        example: {
                            "email": "email@server.com",
                            "password": "password",
                            "firstName": 'Firstname',
                            "lastName": 'Lastname',
                        }
                    }
                }
            } */
        const userID = req.params.id;
        const { id, ...userData } = req.body;

        // hash the password if it isn't already hashed
        if (userData.password && !userData.password.startsWith("$2a")) {
            userData.password = bcrypt.hashSync(userData.password);
        }

        // Convert the user data into a User model object
        const user = User(userID, userData);

        // Use the update model function to update this user in the DB
        update(user)
            .then((user) => {
                res.status(200).json({
                    status: 200,
                    message: "User has been updated",
                    user: user,
                });
            })
            .catch((error) => {
                res.status(500).json({
                    status: 500,
                    message: "User update failed",
                });
            });


    }
);



// Delete user by ID endpoint
const deleteUserByIDSchema = {
    type: "object",
    properties: {
        id: {
            type: "string",
        },
    },
};

userController.delete(
    "/users/deleteOne/:id",
    [
        auth(["admin", "teacher"]),
        validate({ params: deleteUserByIDSchema })
    ],
    (req, res) => {
        // #swagger.tags = ['Users - DELETE']

        // #swagger.summary = 'Delete a user by ID'
        /* 
        #swagger.parameters['authenticationKey'] = {
                in: 'header',
                required: true,  
                example: "be39783e-0aaa-4fc8-b0d8-5e3f0a8b1465"  
            }
        #swagger.parameters['ID'] = {
               in: 'path',
               description: 'Delete User By ID',
               required: true,
               example: '642582d2cd42967d21706df0'
           }
           */

        const userID = req.params.id;

        deleteByID(userID)
            .then((user) => {
                res.status(200).json({
                    status: 200,
                    message: `${user.deletedCount} User with ID ${userID} was deleted`,
                });
            })
            .catch((error) => {
                res.status(500).json({
                    status: 500,
                    message: "User could not be delete",
                });
            });
    }
);

const deleteUsersByIDSchema = {
    type: "array",
    items: {
        type: "string",
    },

};

userController.delete(
    "/users/deleteMany/",
    [
        auth(["admin", "teacher"]),
        validate({ body: deleteUsersByIDSchema }),
    ],
    (req, res) => {
        // #swagger.tags = ['Users  - DELETE']

        // #swagger.summary = 'Delete multiple users by ID's'
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
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                    },
                    example: [
                        "641a6bf00e2c74fca47ea4a1",
                        "641a6bf00e2c74fca47ea4a2",
                        "641a6bf00e2c74fca47ea4a3",
                    ],
                },
            },
        } */

        const userDataArray = req.body;

        deleteManyByID(userDataArray)
            .then((user) => {
                res.status(200).json({
                    status: 200,
                    message: `${user.deletedCount} Users with ID's ${userDataArray} were deleted`,
                });
            })
            .catch((error) => {
                res.status(500).json({
                    status: 500,
                    message: "User could not be delete",
                });
            });
    }
);




export default userController;
