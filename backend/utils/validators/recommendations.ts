import type { Recommendation } from "../../models/types";

export function recommendationsPostValidator(
  recommendation: Recommendation
): Recommendation {
  if (!recommendation.spotify_song_id) {
    throw new Error("Spotify song is not defined.");
  }
  if (!recommendation.recommender) {
    throw new Error("Recommender is not defined");
  }
  if (!recommendation.comment) {
    throw new Error("Comment is not defined");
  }
  return recommendation;
}
