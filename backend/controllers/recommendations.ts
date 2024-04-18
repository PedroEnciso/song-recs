import { Router, Request, Response } from "express";
import Recommendation from "../models/Recommendation";
import { recommendationsPostValidator } from "../utils/validators/recommendations";
import type {
  Recommendation as IRecommendation,
  RecommendationWithSong,
} from "../models/types";
import { SpotifySession } from "../utils/spotify";

const recommendationsRouter = Router();

recommendationsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const recommendations = await Recommendation.find({});
    const spotify = await SpotifySession();
    const recommendationsWithSpotifyData: RecommendationWithSong[] = [];
    for (const rec of recommendations) {
      const songData = await spotify.getSongById(rec.spotify_song_id);
      recommendationsWithSpotifyData.push({
        id: rec.id,
        recommender: rec.recommender,
        comment: rec.comment,
        song: songData,
      });
    }
    res.json(recommendationsWithSpotifyData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to find recommendations." });
  }
});

recommendationsRouter.post(
  "/",
  async (req: Request<{}, {}, IRecommendation>, res: Response) => {
    let recommendation = req.body;
    try {
      recommendation = recommendationsPostValidator(recommendation);
      const newRecommendation = await Recommendation.create({
        spotify_song_id: recommendation.spotify_song_id,
        recommender: recommendation.recommender,
        comment: recommendation.comment,
      });
      res.status(201).json(newRecommendation);
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(500)
          .json({ error: error.message || "Unable to create resource" });
      } else {
        res.status(500).json({ error: "Unable to create resource" });
      }
    }
  }
);

export default recommendationsRouter;
