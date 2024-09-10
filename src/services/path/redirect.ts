import { db } from "../../app";

import type { FastifyReply } from "fastify";

export const redirect = async (reply: FastifyReply, path: string) => {
  const redirectUrl = await db.getUrl(path);
  if (!redirectUrl) return reply.code(404).send(`${path} Not Found`);

  return reply.redirect(redirectUrl, 302);
};
