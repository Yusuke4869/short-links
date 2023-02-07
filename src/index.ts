import Fastify, { FastifyInstance } from "fastify";
import type { FastifyReply, FastifyRequest } from "fastify";

import { DataBase } from "./db";
import { apiRoutes } from "./routes/api";
import { pathRoutes } from "./routes/path";

const PORT = Number(process.env.PORT) ?? 3000;

export const db = new DataBase();

const server: FastifyInstance = Fastify({ logger: true });
server.register(apiRoutes, { prefix: "/api" });
pathRoutes(server);

server.all("/", async (req, res: FastifyReply) => {
  return res.status(200).send("Hello World!");
});

server.setNotFoundHandler(async (req: FastifyRequest, res: FastifyReply) => {
  return res.code(404).send(`${req.url} Not Found`);
});

const start = async () => {
  try {
    await server.listen({ port: PORT });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
