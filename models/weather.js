export function Weather(_id, object) {
    const weather = { _id };
    for (const [key, value] of Object.entries(object)) {
        if (value !== undefined) {
            weather[key] = value;
        }
    }
    return weather;
}
//     const { device_name, precipitation, time, latitude, longitude, temperature, atmospheric_pressure, max_wind_speed, solar_radiation, vapor_pressure, humidity, wind_direction } = object
//     return {
//         id,
//         device_name,
//         precipitation,
//         time,
//         latitude,
//         longitude,
//         temperature,
//         atmospheric_pressure,
//         max_wind_speed,
//         solar_radiation,
//         vapor_pressure,
//         humidity,
//         wind_direction
//     }
// }

