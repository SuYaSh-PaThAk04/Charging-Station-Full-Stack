import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

const connectDB = async () => {
  try {

    const connectionInstance = await mongoose.connect(process.env.mongodb_URI);
    console.log(`MongoDB Connected! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export { connectDB };
