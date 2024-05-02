import { RecommendationWithSong } from "./Recommendation";

export interface HistoryItem extends RecommendationWithSong {
  status: "pending" | "added" | "removed";
  response: {
    rate: boolean | null;
    comment: string | null;
  };
}
