import mongoose from "../utils/mongoose";
import type { Recommendation } from "./types";

const { Schema, model } = mongoose;

const recommendationSchema = new Schema<Recommendation>(
  {
    spotify_song_id: String,
    comment: String,
    recommender: String,
    user_id: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create a virtual field 'id' that gets the `_id` value
recommendationSchema.virtual("id").get(function () {
  return this._id.toString();
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
