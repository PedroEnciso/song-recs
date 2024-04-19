import { Router, Request, Response } from "express";
import { SpotifySession } from "../utils/spotify";

const songsRouter = Router();

songsRouter.get("/", async (req: Request, res: Response) => {
  const query = req.query.song as string;
  if (!query || query === "") {
    res.status(400).json({ message: "No query was defined" });
  }
  try {
    const spotifySession = await SpotifySession();
    const songs = await spotifySession.getSongsByQuery(query);
    res.json(songs);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error });
    } else {
      res.status(500).json({ message: "Could not find songs." });
    }
  }
});

export default songsRouter;
