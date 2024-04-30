import type { RecommendationWithSong } from "../../../backend/models/types";

export async function getRecommendations(): Promise<RecommendationWithSong[]> {
  const response = await fetch(
    `http://localhost:3000/api/admin/recommendations`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }
  return response.json();
}
