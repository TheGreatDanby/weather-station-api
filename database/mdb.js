import { MongoClient } from "mongodb"

const connectionString = "mongodb+srv://weather_api_db:jHVnf7A8WDtPytR8@weatherdata.pfr7etc.mongodb.net/test?proxyHost=mongodb.bypass.host&proxyPort=80&proxyUsername=student&proxyPassword=student"

const client = new MongoClient(connectionString)
export const db = client.db("weatherData")



// mongodb+srv://thegreatdanby_weather:aycfcTA6Q1SYWyys_weather@weatherdata.pfr7etc.mongodb.net/test?proxyHost=168.138.109.243&proxyPort=80&proxyUsername=student&proxyPassword=student
// "mongodb+srv://thegreatdanby_weather:aycfcTA6Q1SYWyys_weather@weatherdata.pfr7etc.mongodb.net/test?proxyHost=mongodb.bypass.host&proxyPort=80&proxyUsername=student&proxyPassword=student"
// "mongodb+srv://thegreatdanby_weather:aycfcTA6Q1SYWyys_weather@weatherdata.pfr7etc.mongodb.net/test"
