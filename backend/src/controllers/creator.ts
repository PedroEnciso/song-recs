import { Router } from "express";
import type { Request, Response } from "express";
import querystring from "querystring";
import generateRandomString from "../utils/generateRandomString";
import { SpotifySession } from "../utils/spotify";
import { checkAuth, getSpotifyId } from "../middleware";
import { RecommendationWithSong } from "../models/types";
import { accessTokenKey, refreshTokenKey } from "../utils/cookieKeys";
import type { InsertPlaylist, InsertRecommendation } from "../db/schema";
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

// get all recommendations with their song info from a specific playlist
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

// updates the status of a specific playlist
creatorRouter.patch(
  "/:playlistId/recommendations/:recommendationId",
  getSpotifyId,
  async (
    req: Request<
      { playlistId: string; recommendationId: string },
      {},
      { spotify_user_id: string; newStatus: "added" | "pending" | "rejected" }
    >,
    res: Response<InsertRecommendation | { error: string }>
  ) => {
    const { playlistId, recommendationId } = req.params;
    const { spotify_user_id, newStatus } = req.body;

    try {
      // get the playlist from the db
      const playlist = await dbAPI.getPlaylist(playlistId);
      // TODO: get the recommndation from db
      /* 
        const recommendation = dbAPI.getRecommendation(recommendationId) 
      */
      // validate the the user id in the db matches the current user
      if (playlist?.creatorId === spotify_user_id) {
        // add the song to the Spotify playlist if newStatus is "added"
        // remove the song from the Spotify playlist if newStatus is "rejected" and playlist.status is "added"
        if (newStatus === "added") {
          // TODO: Add the song to the spotify playlist
        } else if (
          newStatus === "rejected" &&
          /* recommendation.status === 'rejected */ true
        ) {
          // TODO: remove the song from the Spotify playlist
        }
        // update the status in db
        const updatedRecommendation = await dbAPI.updateRecommendationStatus(
          newStatus,
          parseInt(recommendationId)
        );
        res.status(204).json(updatedRecommendation[0]);
      } else {
        res.status(403).json({ error: "Not authorized to update resource." });
      }
    } catch (err) {
      res.status(500).json({ error: "Unable to update the recommendation." });
    }
  }
);

// receives a new playlist from the creator
creatorRouter.post(
  "/playlist",
  getSpotifyId,
  async (
    req: Request<
      {},
      {},
      { name: string; description: string; spotify_user_id: string }
    >,
    res: Response<InsertPlaylist | { error: string }>
  ) => {
    const { name, description, spotify_user_id } = req.body;
    try {
      // create a new playlist on the user's spotify account
      const spotify = await SpotifySession();
      const newPlaylist = await spotify.createNewPlaylist(
        spotify_user_id,
        name,
        description
      );
      // create a playlist in the db with the new spotify playlist id
      const response = await dbAPI.insertPlaylist({
        id: newPlaylist.id,
        name,
        creatorId: spotify_user_id,
      });
      // send success response with the new playlist
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
