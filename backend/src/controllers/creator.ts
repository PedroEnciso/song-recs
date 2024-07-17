import { Router } from "express";
import type { Request, Response } from "express";
import querystring from "querystring";
import generateRandomString from "../utils/generateRandomString";
import { SpotifySession } from "../utils/spotify";
import { checkAuth, getSpotifyId } from "../middleware";
import { RecommendationWithSong } from "../models/types";
import { accessTokenKey, refreshTokenKey } from "../utils/cookieKeys";
import type { InsertPlaylist } from "../db/schema";
import dbAPI from "../utils/dbAPI";

const creatorRouter = Router();

const stateKey = "spotify_auth_state";

const scope = "playlist-modify-public";
const redirect_uri = "http://localhost:5173/admin/authorize";
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

creatorRouter.get("/login", (_req: Request, res: Response) => {
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

creatorRouter.get(
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

    // TODO: Create a new creator in db

    // set cookies for new access & refresh token
    res.cookie(accessTokenKey, responseBody.access_token);
    res.cookie(refreshTokenKey, responseBody.refresh_token);

    res.status(204).send();
  }
);

creatorRouter.get(
  "/:playlistId/recommendations",
  checkAuth,
  async (
    req: Request<{ playlistId: string }>,
    res: Response<RecommendationWithSong[] | { error: string }>
  ) => {
    const { playlistId } = req.params;
    try {
      const recommendations = await dbAPI.getPlaylistRecommendations(
        parseInt(playlistId)
      );
      const spotify = await SpotifySession();
      const recommendationsWithSpotifyData: RecommendationWithSong[] = [];
      for (const rec of recommendations) {
        const songData = await spotify.getSongById(rec.spotifySongId);
        recommendationsWithSpotifyData.push({
          id: rec.id,
          recommenderId: rec.recommenderId,
          song: songData,
          status: rec.status,
        });
      }
      res.json(recommendationsWithSpotifyData);
    } catch (error) {
      res.status(500).json({ error: "Unable to find recommendations." });
    }
  }
);

creatorRouter.post(
  "/playlist",
  getSpotifyId,
  async (
    req: Request<{}, {}, { name: string; spotify_user_id: string }>,
    res: Response<InsertPlaylist | { error: string }>
  ) => {
    const { name, spotify_user_id } = req.body;
    try {
      const response = await dbAPI.insertPlaylist({
        name,
        creatorId: spotify_user_id,
      });
      res.status(201).json(response[0]);
    } catch (error) {
      res.status(500).json({ error: "Unable to create playlist." });
    }
  }
);

export default creatorRouter;

interface AuthorizeQueryParams {
  code: string;
  state: string;
}
