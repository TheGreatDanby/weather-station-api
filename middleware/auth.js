import { getByAuthenticationKey, updateUserLastQueryTime } from "../models/user-mdb.js";

export default function auth(allowed_roles) {
    return function (req, res, next) {
        const authenticationKey = req.get('authenticationKey');
        console.log('Received authenticationKey:', authenticationKey);


        if (authenticationKey) {
            getByAuthenticationKey(authenticationKey)
                .then(user => {
                    console.log('Fetched user by authentication key:', user);
                    if (allowed_roles.includes(user.role)) {
                        updateUserLastQueryTime(user.id);
                        next();
                    } else {
                        res.status(403).json({
                            status: 403,
                            message: "Access forbidden",
                        });
                    }
                })
                .catch(error => {
                    console.error('Error in getByAuthenticationKey:', error);

                    res.status(401).json({
                        status: 401,
                        message: "Authentication key invalid",
                    });
                })
        } else {
            res.status(401).json({
                status: 401,
                message: "Authentication key missing",
            });
        }
    }
}
