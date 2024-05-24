import Fastify from "fastify";
import routes from "./routes/example";

export const fastify = Fastify({
  logger: true,
});

fastify.register(routes);
