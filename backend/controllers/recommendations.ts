import { Router, Request, Response } from "express";
import Recommendation from "../models/Recommendation";
import { recommendationsPostValidator } from "../utils/validators/recommendations";
import { checkUser } from "../middleware";
import type { Recommendation as IRecommendation } from "../models/types";
import { recommendationRateLimit } from "../middleware/recommendationRateLimit";

const recommendationsRouter = Router();

recommendationsRouter.post(
  "/",
  recommendationRateLimit,
  checkUser,
  async (req: Request<{}, {}, IRecommendation>, res: Response) => {
    let recommendation = req.body;
    try {
      recommendation = recommendationsPostValidator(recommendation);
      const newRecommendation = await Recommendation.create({
        spotify_song_id: recommendation.spotify_song_id,
        recommender: recommendation.recommender,
        user_id: recommendation.user_id,
        comment: recommendation.comment,
      });
      res.status(201).json(newRecommendation);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Unable to create resource" });
      }
    }
  }
);

export default recommendationsRouter;
