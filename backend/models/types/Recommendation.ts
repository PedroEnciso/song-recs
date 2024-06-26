import type { Recommender } from "./Recommender";
import { Song } from "./Song";

export interface Recommendation {
  id: string;
  spotify_song_id: string;
  recommender: string;
  user_id: string;
  comment: string;
}

export interface RecommendationWithSong {
  id: string;
  song: Song;
  recommender: string;
  comment: string;
}

export interface RecommendationWithoutId {
  spotify_song_id: string;
  recommender: string;
  comment: string;
}
