import express, { Express, Request, Response } from "express";

export const app: Express = express();

const recommendations = [
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

app.get("/api/recommendations/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const recommendation = recommendations.find((rec) => rec.id === id);

  if (recommendation) {
    res.json(recommendation);
  } else {
    res.statusMessage = "This resource does not exist.";
    res.status(404).end();
  }
});
