import type { Recommender } from "./Recommender";

export interface Recommendation {
  id: string;
  spotify_song_id: string;
  recommender: Recommender;
  comment: string;
}
