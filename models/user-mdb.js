import { ObjectId } from "mongodb"
import { User } from "./user.js";
import { db } from "../database/mdb.js";


export async function getAll() {

    let allUserResults = await db.collection("users").find().toArray()

    return await Promise.all(allUserResults.map((userResult) =>

        User(userResult._id.toString(), userResult)));


}

export async function getByID(userID) {

    let userResult = await db.collection("users").findOne({ _id: new ObjectId(userID) })

    if (userResult) {
        return Promise.resolve(
            User(userResult._id.toString(), userResult)

        )
    } else {
        return Promise.reject("no results found")
    }
}

export async function getByEmail(email) {

    let userResult = await db.collection("users").findOne({ email })

    if (userResult) {
        return Promise.resolve(
            User(userResult._id.toString(), userResult))

    } else {
        return Promise.reject("no results found")
    }
}

export async function getByAuthenticationKey(authenticationKey) {

    let userResult = await db.collection("users").findOne({ authenticationKey })

    if (userResult) {
        return Promise.resolve(
            User(userResult._id.toString(), userResult))
    } else {
        return Promise.reject("no results found")
    }
}

export async function create(user) {

    delete user._id

    user.created = new Date()

    return db.collection("users").insertOne(user).then(result => {
        delete user._id
        return { ...user, id: result.insertedId.toString() }
    })
}

export async function update(user) {

    const userID = new ObjectId(user.id)
    delete user._id

    const userUpdateDocument = {
        "$set": user
    }

    return db.collection("users").updateOne({ _id: userID }, userUpdateDocument)
}

export async function deleteByID(userID) {
    return db.collection("users").deleteOne({ _id: new ObjectId(userID) })
}
export async function deleteManyByID(userDataArray) {
    const objectIds = userDataArray.map((id) => new ObjectId(id));
    return db.collection("users").deleteMany({ _id: { $in: objectIds } });
}


export async function updateUserRole(startDate, endDate, newRole) {
    const result = await db.collection('users').updateMany(
        {
            created: {
                $gte: startDate,
                $lte: endDate,
            },
        },
        {
            $set: {
                role: newRole,
            },
        }
    );
    return result;
}


export function updateUserLastQueryTime(userId) {

    const userObjectId = new ObjectId(userId);
    const currentTime = new Date();

    return db
        .collection('users')
        .updateOne(
            { _id: userObjectId },
            { $set: { lastQueryTime: currentTime } }
        )
        .then(() => {
            console.log('User last query time updated successfully');
        })
        .catch((error) => {
            console.error('Error updating user last query time:', error);
        });
}
