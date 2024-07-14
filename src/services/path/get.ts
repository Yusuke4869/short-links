import { db } from "../../app";

import type { FastifyReply } from "fastify";

export const getPathData = async (reply: FastifyReply, path: string) => {
  const data = await db.getPathData(path);
  if (!data) return reply.code(404).send(`${path} Not Found`);

  return reply.code(200).send(data);
};
