import type { FastifyReply } from "fastify";

import { db } from "../../app";

export const redirect = async (reply: FastifyReply, path: string) => {
  const redirectUrl = await db.getUrl(path);
  if (!redirectUrl) return reply.code(404).send(`${path} Not Found`);

  return reply.redirect(302, redirectUrl);
};
