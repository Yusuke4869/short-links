import type { FastifyReply } from "fastify";

import { db } from "../../app";

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

  if (!result) return reply.code(500).send("500 Internal Server Error");
  return reply.code(200).send("200 OK");
};
