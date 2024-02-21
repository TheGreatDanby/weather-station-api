




export function User(id, object) {
    const user = { id };
    for (const [key, value] of Object.entries(object)) {
        if (value !== undefined) {
            if (key === "_id" || key === "id") continue
            user[key] = value;

        }
    }

    return user;

}


// working constructor but duplicating the `id`
// export function User(id, object) {
//     const { email, password, role, firstName, lastName, authenticationKey } = object
//     return {
//         id,
//         email,
//         password,
//         role,
//         firstName,
//         lastName,
//         authenticationKey
//     }
// }


