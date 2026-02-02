import mongoose from "mongoose";
import config from "./config.js";

async function connectDB() {
  try {
    const status = await mongoose.connect(config.mongoDBUrl);
    console.log(`mongoDB connected: ${status.connection.host}`);
  } catch (error) {
    console.log(error);
    console.log(
      "Database is not created please put your database url in .env file "
    );
  }
}

export default connectDB;
