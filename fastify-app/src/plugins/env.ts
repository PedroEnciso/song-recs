import fastifyEnv from "@fastify/env";
import fp from "fastify-plugin";
import { type FastifyEnvOptions } from "@fastify/env";

const schema = {
  type: "object",
  required: ["SPOTIFY_CLIENT_ID", "SPOTIFY_CLIENT_SECRET"],
  properties: {
    SPOTIFY_CLIENT_ID: {
      type: "string",
    },
    SPOTIFY_CLIENT_SECRET: {
      type: "string",
    },
  },
};

const options = {
  confKey: "config",
  schema,
  dotenv: true,
  data: process.env,
};

export default fp<FastifyEnvOptions>(async (fastify) => {
  await fastify.register(fastifyEnv, options);
});
