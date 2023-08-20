import type { FastifyReply, FastifyRequest } from "fastify";

import { authError, tokenAuth } from "../services/auth";
import { deletePath, disablePath, getPathData, redirect, updatePath, updatePathState } from "../services/path";
import type { IPathRequest } from "../types";

const PathController = {
  async getPathRequest(request: FastifyRequest<IPathRequest>, reply: FastifyReply) {
    try {
      const { path } = request.params;
      const { token, method, info, url, description, reset, delete: del } = request.query;
      const requestMethod = method ? method.toUpperCase() : request.method;

      if (requestMethod !== "GET" || info) {
        const statusCode = await tokenAuth(token);
        if (statusCode !== 200) {
          await authError(reply, statusCode);
          return;
        }
      }

      if (requestMethod === "PUT") return await updatePath(reply, path, url, description);
      else if (requestMethod === "PATCH") return await updatePathState(reply, path, url, description, reset);
      else if (requestMethod === "DELETE") {
        if (del) return await deletePath(reply, path);
        return await disablePath(reply, path);
      }

      if (info) return await getPathData(reply, path);

      await redirect(reply, path);
    } catch (error) {
      console.error(error);
      reply.status(500).send("500 Internal Server Error");
    }
  },
};

export default PathController;
