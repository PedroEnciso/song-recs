import type { Recommender } from "./Recommender";
import { Song } from "./Song";

export interface Recommendation {
  id: string;
  spotify_song_id: string;
  recommender: string;
  comment: string;
}

export interface RecommendationWithSong {
  id: string;
  song: Song;
  recommender: string;
  comment: string;
}
