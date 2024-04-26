import { Router } from "express";
import type { Request, Response } from "express";
import querystring from "querystring";
import generateRandomString from "../utils/generateRandomString";

const adminRouter = Router();

const stateKey = "spotify_auth_state";
const scope = "playlist-modify-public";

adminRouter.get("/login", (_req: Request, res: Response) => {
  // create secure state and save as a cookie
  const state = generateRandomString();
  res.cookie(stateKey, state);

  res.redirect(
    `https://accounts.spotify.com/authorize?${querystring.stringify({
      response_type: "code",
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope,
      redirect_uri: "http://localhost:5173/admin/authorize",
      state,
    })}`
  );
});

export default adminRouter;
