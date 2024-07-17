import type { Request, Response, NextFunction } from "express";
import { accessTokenKey, refreshTokenKey } from "../utils/cookieKeys";
import { SpotifySession } from "../utils/spotify";

export async function getSpotifyId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const access_token = req.cookies ? req.cookies[accessTokenKey] : null;
  const refresh_token = req.cookies ? req.cookies[refreshTokenKey] : null;
  if (access_token && refresh_token) {
    try {
      const spotify = await SpotifySession();
      const user = await spotify.getUser();
      req.body.spotify_user_id = user.id;
    } catch (error) {
      res.status(500).json({ error: "Could not log in to Spotify." });
    }
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}
