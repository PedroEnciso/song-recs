import type { RecommendationWithoutId } from "src/../../backend/models/types";

export async function postRecommendation(
  recommendation: RecommendationWithoutId
) {
  const response = await fetch("http://localhost:3000/api/recommendations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recommendation),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`${response.status}`);
  }

  return response;
}
