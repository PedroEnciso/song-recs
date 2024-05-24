import Fastify from "fastify";
import cookies from "@fastify/cookie";
// import fastifyEnv from "@fastify/env";
import env from "./plugins/env";
import userRoutes from "./routes/userRouter";

export const fastify = Fastify({
  logger: true,
});

// const schema = {
//   type: "object",
//   required: ["SPOTIFY_CLIENT_ID", "SPOTIFY_CLIENT_SECRET"],
//   properties: {
//     SPOTIFY_CLIENT_ID: {
//       type: "string",
//     },
//     SPOTIFY_CLIENT_SECRET: {
//       type: "string",
//     },
//   },
// };

// const options = {
//   confKey: "config",
//   schema,
//   dotenv: true,
//   data: process.env,
// };

const initialize = async () => {
  // plugins
  fastify.register(cookies, {
    secret: "my-secret",
    hook: "onRequest",
    parseOptions: {},
  });
  await fastify.register(env);
  // routes
  fastify.register(userRoutes);
};
initialize();
