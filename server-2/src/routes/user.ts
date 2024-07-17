import { Router } from "express";
import type { Response, Request } from "express";
import querystring from "querystring";
import { generateRandomString } from "../utils/generateRandomString";

const userRouter = Router();

const stateKey = "spotify_auth_state";
const scope = "playlist-modify-public";
const redirect_uri = "http://localhost:5173/admin/authorize";
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

userRouter.get("/api/user/login", (req: Request, res: Response) => {
  // save state in cookie, used later for authorization
  const state = generateRandomString(16);
  res.cookie(stateKey, state, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  // create a new spotify login url
  const url = `https://accounts.spotify.com/authorize?${querystring.stringify({
    response_type: "code",
    client_id,
    scope,
    redirect_uri,
    state,
  })}`;

  res.json({ url });
});

userRouter.get("/api/user/login", async (req: Request, res: Response) => {
  const code = req.query.code as string;
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

  // set cookies for new access & refresh token
  res.cookie(accessTokenKey, responseBody.access_token);
  res.cookie(refreshTokenKey, responseBody.refresh_token);

  res.status(204).send();
});

// userRouter.get("/api/user/login", (req: Request, res: Response) => {});
