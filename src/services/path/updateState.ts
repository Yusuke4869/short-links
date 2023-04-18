import type { FastifyReply } from "fastify";

import { db } from "../../app";

export const updatePathState = async (
  reply: FastifyReply,
  path: string,
  redirectUrl: string | undefined,
  description: string | undefined,
  reset: boolean | undefined,
) => {
  const data = await db.getPathData(path);
  if (!data) return reply.code(404).send(`${path} Not Found`);

  const result = await db.updatePathData(path, {
    path: path,
    url: redirectUrl ?? data.url,
    description: description ?? data.description,
    count: reset ? 0 : data.count,
    unavailable: false,
  });

  if (!result) return reply.code(500).send("500 Internal Server Error");
  return reply.code(200).send("200 OK");
};
