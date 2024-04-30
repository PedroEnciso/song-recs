import { Router } from "express";
import type { Request, Response } from "express";
import querystring from "querystring";
import generateRandomString from "../utils/generateRandomString";
import Recommendation from "../models/Recommendation";
import { SpotifySession } from "../utils/spotify";
import { checkAuth } from "../middleware";
import { RecommendationWithSong } from "../models/types";

const adminRouter = Router();

const stateKey = "spotify_auth_state";
export const accessTokenKey = "spotify_access_token";
export const refreshTokenKey = "spotify_refresh_token";
const scope = "playlist-modify-public";
const redirect_uri = "http://localhost:5173/admin/authorize";
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

adminRouter.get("/login", (_req: Request, res: Response) => {
  // create secure state and save as a cookie
  const state = generateRandomString();
  res.cookie(stateKey, state, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  const url = `https://accounts.spotify.com/authorize?${querystring.stringify({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope,
    redirect_uri,
    state,
  })}`;

  res.json({ url });
});

adminRouter.get(
  "/authorize",
  async (req: Request<{}, {}, {}, AuthorizeQueryParams>, res: Response) => {
    const code = req.query.code;
    const state = req.query.state;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    // no access code or previous state: 401
    if (!code || !storedState) {
      res.status(401).json({ error: "No access code provided" });
      return;
    }
    // no state, incorrect state: 403
    if (!state || state !== storedState) {
      res.status(403).json({ error: "State mismatch" });
      return;
    }
    // TODO: spotify user is not me: 403

    // clear the cookie, no longer needed
    res.clearCookie(stateKey);
    // Convert an object to a URL-encoded string
    interface Data {
      code: string;
      redirect_uri: string;
      grant_type: string;
    }
    function urlEncode(data: Data) {
      return (Object.keys(data) as Array<keyof typeof data>)
        .map(
          (key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
        )
        .join("&");
    }

    const body = urlEncode({
      code: code,
      redirect_uri: redirect_uri,
      grant_type: "authorization_code",
    });

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          client_id + ":" + client_secret
        ).toString("base64")}`,
      },
      body,
    });

    const responseBody = await response.json();

    if (responseBody.hasOwnProperty("error")) {
      res.status(500).json({ error: responseBody.error_description });
    }

    // set cookies for new access & refresh token
    res.cookie(accessTokenKey, responseBody.access_token);
    res.cookie(refreshTokenKey, responseBody.refresh_token);

    res.status(204).send();
  }
);

adminRouter.get(
  "/recommendations",
  checkAuth,
  async (req: Request, res: Response) => {
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
      res.status(500).json({ error: "Unable to find recommendations." });
    }
  }
);

export default adminRouter;

interface AuthorizeQueryParams {
  code: string;
  state: string;
}
