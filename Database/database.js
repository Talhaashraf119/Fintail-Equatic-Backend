import mongoose from "mongoose";

let isConnected = false;

const MONGODB_URI = process.env.DB_CONNECTION;

if (!MONGODB_URI) {
  throw new Error("Please define the DB_CONNECTION environment variable");
}

export const database = async () => {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }

  try {
    const opts = {
      bufferCommands: false,           // Important for serverless
      serverSelectionTimeoutMS: 10000, // Fail faster if can't connect
      connectTimeoutMS: 10000,
      maxIdleTimeMS: 10000,
    };

    const conn = await mongoose.connect(MONGODB_URI, opts);

    isConnected = !!conn.connections[0].readyState;
    console.log("✅ Database connected successfully");

  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    throw error;
  }
};