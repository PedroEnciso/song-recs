import mongoose from "mongoose";

try {
  mongoose.connect(process.env.MONGODB_URL as string);
} catch (err) {
  console.log("Could not connect to mongoDB", err);
}

export default mongoose;
