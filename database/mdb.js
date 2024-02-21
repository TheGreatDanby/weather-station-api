import { MongoClient } from "mongodb";

const connectionString = process.env.MONGODB;

const client = new MongoClient(connectionString);
export const db = client.db("weatherData");
