import { Weather } from "./weather.js";
import { ObjectId } from "mongodb";
import { db } from "../database/mdb.js";

export async function create(weather) {
    delete weather.ObjectId;
    weather.time = new Date();
    return db
        .collection("weatherReadings")
        .insertOne(weather)
        .then((result) => {
            delete weather._id;
            return { ...weather, id: result.insertedId.toString() };
        });
}

export async function createMany(weatherDataArray) {
    weatherDataArray.forEach((weather) => {
        delete weather.ObjectId;
        weather.time = new Date();
    });

    return db
        .collection("weatherReadings")
        .insertMany(weatherDataArray)
        .then((result) => {
            return weatherDataArray.map((weather, index) => {
                delete weather._id;
                return { ...weather, id: result.insertedIds[index].toString() };
            });
        });
}
export async function getAll() {
    let allWeatherResults = await db
        .collection("weatherReadings")
        .find()
        .limit(100)
        .toArray();
    return allWeatherResults.map((weatherResult) =>
        Weather(weatherResult._id.toString(), weatherResult)
    );
}


export async function getByPage(page, size) {
    // Calculate page offset
    const offset = page * size

    // Get the collection of sightings on a given "page"
    const paginatedWeatherReadingsResults = await db
        .collection("weatherReadings")
        .find()
        .sort({ _id: 1 })
        .skip(offset)
        .limit(size)
        .toArray();

    const totalCount = await db.collection("weatherReadings").countDocuments();


    // Convert the collection of results into a list of Sighting objects
    const weatherReadings = paginatedWeatherReadingsResults.map((weatherResult) =>
        Weather(weatherResult._id.toString(), weatherResult)
    );
    return { weatherReadings, totalCount };

}

export async function getMaxRain(months) {
    let maxRainCursor = await db
        .collection("weatherReadings")
        .find({
            device_name: "Woodford_Sensor",
            time: {
                $gt: new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000),
            },
        })
        .sort({ precipitation: -1 })
        .limit(10);

    let maxRainDocs = await maxRainCursor.toArray();

    return maxRainDocs.map((rainDoc) => Weather(rainDoc._id.toString(), rainDoc));

    // return maxRainResults.map(rainResult =>
    //     Weather(rainResult._id.toString(), rainResult))
}

export async function getMaxRainName(deviceName) {
    const currentDate = new Date();
    const fiveMonthsAgo = new Date(
        currentDate.setMonth(currentDate.getMonth() - 5)
    );

    const maxRainCursor = await db
        .collection("weatherReadings")
        .find({
            device_name: deviceName,
            time: {
                $gte: fiveMonthsAgo,
            },
        })
        .sort({ precipitation: -1 })
        .limit(1);

    const maxRainDocs = await maxRainCursor.toArray();

    return maxRainDocs.map((rainDoc) => {
        return {
            _id: rainDoc._id.toString(),
            device_name: rainDoc.device_name,
            precipitation: rainDoc.precipitation,
            time: rainDoc.time,
        };
    });
}

export async function getWeatherData(deviceName, date) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    endDate.setMinutes(endDate.getMinutes() + 1);

    const weatherResult = await db.collection("weatherReadings").findOne({
        device_name: deviceName,
        time: {
            $gte: startDate,
            $lt: endDate,
        },
    });


    if (weatherResult) {
        return {
            _id: weatherResult._id.toString(),
            device_name: weatherResult.device_name,
            atmospheric_pressure: weatherResult.atmospheric_pressure,
            precipitation: weatherResult.precipitation,
            solar_radiation: weatherResult.solar_radiation,
            temperature: weatherResult.temperature,
            time: weatherResult.time,
        };
    } else {
        throw new Error("No matching weather data found");
    }
}

export async function getMaxTemperature(startDate, endDate) {
    const weatherResult = await db
        .collection("weatherReadings")
        .aggregate([
            {
                $match: {
                    time: {
                        $gte: startDate,
                        $lt: endDate,
                    },
                },
            },
            {
                $sort: { temperature: -1 }
            },
            {
                $group: {
                    _id: "$device_name",
                    maxTemperature: { $first: "$temperature" },
                    time: { $first: "$time" },
                },
            },
        ])
        .toArray();

    if (weatherResult && weatherResult.length > 0) {
        return weatherResult.map((result) => ({
            device_name: result._id,
            max_temperature: result.maxTemperature,
            time: result.time,
        }));
    } else {
        throw new Error("No matching weather data found");
    }
}

export async function getById(weatherID) {
    let weatherResult = await db.collection("weatherReadings").findOne({
        _id: new ObjectId(weatherID),
    });
    if (weatherResult != null) {
        return Promise.resolve(
            Weather(weatherResult._id.toString(), weatherResult)
        );
    } else {
        return null;
    }
}

export async function update(weather) {
    const weatherID = new ObjectId(weather._id);
    delete weather._id;

    const weatherUpdateDocument = {
        $set: weather,
    };

    return db
        .collection("weatherReadings")
        .updateOne({ _id: weatherID }, weatherUpdateDocument);
}

export async function deleteByID(weatherID) {
    return db
        .collection("weatherReadings")
        .deleteOne({ _id: new ObjectId(weatherID) });
}

export async function updatePrecipitation(weatherID, newPrecipitation) {
    return db
        .collection("weatherReadings")
        .updateOne(
            { _id: new ObjectId(weatherID) },
            { $set: { precipitation: newPrecipitation } }
        );
}
