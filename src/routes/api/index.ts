import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { db } from "../../index";
import { authErrorReturn, checkToken } from "../../path";
import { apiPathRoutes } from "./path";

const apiRoutes = (server: FastifyInstance, opts: { prefix: string }, next: () => void) => {
  server.get("/status", async (req: FastifyRequest, res: FastifyReply) => {
    await status(req, res);
  });
  server.get<{
    Querystring: { token: string | undefined };
    Headers: {
      token: string | undefined;
    };
  }>("/all", async (req, res: FastifyReply) => {
    const { token: queryToken } = req.query;
    const { token: headerToken } = req.headers;

    const token = typeof headerToken === "string" ? headerToken : queryToken;
    await showAllPath(req, res, token);
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
  const authStatus = await checkToken(token);
  console.log(token, authStatus);
  if (authStatus !== 200) return await authErrorReturn(res, authStatus);

  const data = await db.getData();
  return res.status(200).send({ data: data?.data });
};

export { apiRoutes };
