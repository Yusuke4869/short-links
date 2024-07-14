import { db } from "../../app";

import type { FastifyReply } from "fastify";

export const updatePath = async (
  reply: FastifyReply,
  path: string,
  redirectUrl: string | undefined,
  description: string | undefined
) => {
  if (!redirectUrl) return reply.code(400).send("400 Bad Request");
  const data = await db.getPathData(path);
  const result = await db.updatePathData(path, {
    path: path,
    description: description,
    url: redirectUrl,
    count: data?.count ?? 0,
    unavailable: false,
  });

  if (!result?.acknowledged) return reply.code(500).send("500 Internal Server Error");
  else if (!data) return reply.code(201).send("201 Created");
  return reply.code(200).send("200 OK");
};
