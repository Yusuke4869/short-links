import { db } from "../../app";

import type { FastifyReply } from "fastify";

export const deletePath = async (reply: FastifyReply, path: string) => {
  const data = await db.getPathData(path);
  if (!data) return reply.code(404).send(`${path} Not Found`);

  const result = await db.deletePathData(path);
  if (!result?.acknowledged) return reply.code(500).send("500 Internal Server Error");
  return reply.code(200).send("200 OK");
};
