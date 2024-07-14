import { db } from "../../app";

import type { FastifyReply } from "fastify";

export const disablePath = async (reply: FastifyReply, path: string) => {
  const data = await db.getPathData(path);
  if (!data) return reply.code(404).send(`${path} Not Found`);

  const result = await db.updatePathData(path, {
    path: path,
    description: data.description,
    url: data.url,
    count: data.count,
    unavailable: true,
  });

  if (!result?.acknowledged) return reply.code(500).send("500 Internal Server Error");
  return reply.code(200).send("200 OK");
};
