import mongoose from "mongoose";

const mongodbUri = process.env.NEXT_PUBLIC_MONGODB_URI || "";

async function connectDB(): Promise<void> {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("Already connected to MongoDB");
      return;
    }

    const db = await mongoose.connect(mongodbUri);
    console.log("MongoDB connected successfully: ", db.connection.host);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export default connectDB;
