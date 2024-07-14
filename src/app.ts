import Fastify from "fastify";

import { DataBase } from "./db/db";
import APIRoutes from "./routes/api";
import PathRoutes from "./routes/path";

import type { FastifyReply, FastifyRequest, FastifyInstance } from "fastify";

export const db = new DataBase();

const app: FastifyInstance = Fastify({ logger: true });
void app.register(PathRoutes);
void app.register(APIRoutes, { prefix: "/api" });

app.all("/", async (req, res: FastifyReply) => {
  return res.status(200).send("Hello World!");
});

app.setNotFoundHandler(async (req: FastifyRequest, res: FastifyReply) => {
  return res.code(404).send(`${req.url} Not Found`);
});

export default app;
