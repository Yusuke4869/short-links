import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { db } from "../../index";
import { auth } from "../../path";
import { apiPathRoutes } from "./path";

const apiRoutes = (server: FastifyInstance, opts: { prefix: string }, next: () => void) => {
  server.get("/status", async (req: FastifyRequest, res: FastifyReply) => {
    await status(req, res);
  });
  server.get<{ Querystring: { token: string | undefined } }>("/all", async (req, res: FastifyReply) => {
    await showAllPath(req, res, req.query.token);
  });
  apiPathRoutes(server);

  next();
};

const status = async (req: FastifyRequest, res: FastifyReply) => {
  const s = await db.ping();
  if (s?.ok === 1) return res.status(200).send("200 OK");
  else return res.status(500).send("500 Internal Server Error");
};

const showAllPath = async (req: FastifyRequest, res: FastifyReply, token: string | undefined) => {
  await auth(res, token);
  const data = await db.getData();
  return res.status(200).send({ data: data?.data });
};

export { apiRoutes };
