import type { FastifyReply } from "fastify";

import { db } from "../../app";

export const getAllPathData = async (reply: FastifyReply) => {
  const data = await db.getData();
  return reply.status(200).send({ data: data?.data });
};
