import { MongoClient, ServerApiVersion } from "mongodb";
import { MONGODB_URI } from "../utils/constants.js";
import mongoose from "mongoose";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(MONGODB_URI, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);

    console.log("✅ Successfully connected to MongoDB!");
  } catch (error) {
    console.error(error);
    throw new Error('Failed connecting to MongoDB');
  }
}

export {
    connectDB
}