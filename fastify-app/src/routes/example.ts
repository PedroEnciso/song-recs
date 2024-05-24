import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions,
} from "fastify";

const routes: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  fastify.get("/hello", {}, async (request, reply) => {
    return { hello: "world" };
  });
};

export default routes;
