import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

import { SpotifySession } from "./utils/spotify";
import Recommendation from "./models/Recommendation";
import { recommendationsPostValidator } from "./utils/validators/recommendations";
import type { Recommendation as IRecommendation } from "./models/types";

export const app: Express = express();
app.use(express.json());

let recommendations: IRecommendation[] = [
  {
    id: "1",
    spotify_song_id: "123",
    recommender: "anon user",
    comment: "this song rules!",
  },
  {
    id: "2",
    spotify_song_id: "123",
    recommender: "anon user",
    comment: "this song makes me smile!",
  },
  {
    id: "3",
    spotify_song_id: "123",
    recommender: "anon user",
    comment: "this song reminds me of my friend!",
  },
];

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/api/recommendations", (req: Request, res: Response) => {
  res.json(recommendations);
});

app.post(
  "/api/recommendations",
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

app.get("/api/recommendations/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const recommendation = recommendations.find((rec) => rec.id === id);

  if (recommendation) {
    res.json(recommendation);
  } else {
    res.status(404).json({ error: "This resource does not exist." });
  }
});

app.get("/api/songs", async (req: Request, res: Response) => {
  const query = req.query.song as string;
  const spotifySession = await SpotifySession();
  const songs = await spotifySession.getSongsByQuery(query);
  // TEST, delete later
  const song = await spotifySession.getSongById("4EEjMyQub6tgFVshlM9j1M");
  console.log("got song by id", song);
  // ENDTEST
  res.json(songs);
});
