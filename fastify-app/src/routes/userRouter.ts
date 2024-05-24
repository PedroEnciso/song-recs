import fastify from "fastify";
import type {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions,
} from "fastify";
import querystring from "querystring";
import { generateRandomString } from "../utils/generateRandomString";

const stateKey = "spotify_auth_state";
const scope = "playlist-modify-public";
const spotifyClientId = process.env.SPOTIFY_CLIENT_ID as string;

const userRoutes: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  fastify.get("/api/user/login", {}, async (req, reply) => {
    // generate a random string to useas state
    const state = generateRandomString(16);
    console.log("created state", state);
    // set a cookie with the state
    reply.setCookie(stateKey, state);
    // check for env variable
    console.log("client id", spotifyClientId);
    // respond with Spotify's login url contianing state
    return {
      url:
        "https://accounts.spotify.com/authorize?" +
        querystring.stringify({
          response_type: "code",
          client_id: spotifyClientId,
          scope,
          redirect_uri: "http://localhost:5173/error",
          state: state,
        }),
    };
  });
};

export default userRoutes;
