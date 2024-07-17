import type { Recommender } from "./Recommender";
import { Song } from "./Song";

interface RecommendationBase {
  id: string;
  recommenderId: string;
  status: "pending" | "added" | "rejected";
}

// recommendation submitted by anon users
export interface Recommendation extends RecommendationBase {
  spotify_song_id: string;
}

// recommendation returned to creators
export interface RecommendationWithSong extends RecommendationBase {
  song: Song;
}

// unedited
export interface RecommendationWithoutId {
  spotify_song_id: string;
  recommender: string;
  comment: string;
}
