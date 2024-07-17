import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_DB_URI =
  process.env.NODE_ENV === "test"
    ? (process.env.MONGODB_TEST_URL as string)
    : (process.env.MONGODB_URL as string);

try {
  mongoose.connect(MONGO_DB_URI);
} catch (err) {
  console.log("Could not connect to mongoDB", err);
}

export default mongoose;
