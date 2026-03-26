import mongoose from "mongoose";

let isConnected = false;

export const database = async () => {
  try {
    if (isConnected) {
      return;
    }

    const conn = await mongoose.connect(process.env.DB_CONNECTION);
    isConnected = !!conn.connections[0].readyState;

    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};