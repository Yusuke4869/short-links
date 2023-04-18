import type { FastifyReply } from "fastify";

export const authError = async (reply: FastifyReply, statusCode: number) => {
  if (statusCode === 401) return reply.code(401).send("401 Unauthorized");
  return reply.code(403).send("403 Forbidden");
};
