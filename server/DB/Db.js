import mongoose from "mongoose";
const connectDB = async () => {
  try {
    console.log(process.env.MONGO_URL);
    const connectionInstance = await mongoose.connect(`${process.env.MONGO_URL}`);
    console.log(`MongoDB Connected: Host - ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export { connectDB };