import { db } from "../../app";

import type { FastifyReply } from "fastify";

export const getAllPathData = async (reply: FastifyReply) => {
  const data = await db.getData();
  return reply.status(200).send(data);
};
