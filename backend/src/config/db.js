import mongoose from "mongoose";

// This function will connect to the MongoDB database.
const connectDB = async () => {
  try {
    // Mongoose.connect returns a promise, so we use await.
    // We get the connection string from our environment variables.
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // If the connection is successful, log it to the console.
    console.log(`🔌 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If there's an error, log it and exit the process.
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with a failure code.
  }
};

export default connectDB;
