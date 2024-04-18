import mongoose from "../utils/mongoose";
import type { Recommendation } from "./types";

const { Schema, model } = mongoose;

const recommendationSchema = new Schema<Recommendation>({
  spotify_song_id: String,
  comment: String,
  recommender: String,
});

recommendationSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Recommendation = model<Recommendation>(
  "Recommendation",
  recommendationSchema
);
export default Recommendation;
