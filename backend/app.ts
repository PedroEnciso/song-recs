import express, { Express, Request, Response } from "express";
import { generateRandomNumber } from "./utils/generateRandomNumber";
import type { Recommendation } from "./models/types";

export const app: Express = express();

app.use(express.json());

let recommendations: Recommendation[] = [
  {
    id: "1",
    spotify_song_id: "123",
    recommender: {
      id: "user_1",
      name: "anon user",
    },
    comment: "this song rules!",
  },
  {
    id: "2",
    spotify_song_id: "123",
    recommender: {
      id: "user_2",
      name: "anon user",
    },
    comment: "this song makes me smile!",
  },
  {
    id: "3",
    spotify_song_id: "123",
    recommender: {
      id: "user_3",
      name: "anon user",
    },
    comment: "this song reminds me of my friend!",
  },
];

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/api/recommendations", (req: Request, res: Response) => {
  res.json(recommendations);
});

app.post("/api/recommendations", (req: Request, res: Response) => {
  const recommendation = req.body;

  console.log("received a recomendation:", recommendation);

  const newRecommendation: Recommendation = {
    id: generateRandomNumber(),
    spotify_song_id: recommendation.spotify_song_id,
    recommender: {
      id: generateRandomNumber(),
      name: recommendation.recommender.name,
    },
    comment: recommendation.comment,
  };

  recommendations = recommendations.concat(newRecommendation);
  res.status(201).json(recommendation);
});

app.get("/api/recommendations/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const recommendation = recommendations.find((rec) => rec.id === id);

  if (recommendation) {
    res.json(recommendation);
  } else {
    res.status(404).json({ error: "This resource does not exist." });
  }
});
