import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MongoURI = process.env.BASE_DB_URI;

let dbConnection;

async function connectDB() {
  //Connect to the database
  await mongoose.connect(MongoURI);
  dbConnection = mongoose.connection;

  dbConnection.on("error", console.error.bind(console, "connection error:"));
  dbConnection.once("open", () => {});
}

export { connectDB };
