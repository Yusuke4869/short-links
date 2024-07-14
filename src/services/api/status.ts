import { db } from "../../app";

import type { FastifyReply } from "fastify";

export const status = async (reply: FastifyReply) => {
  const s = await db.ping();
  if (s?.ok === 1) return reply.status(200).send("200 OK");
  else return reply.status(500).send("500 Internal Server Error");
};
