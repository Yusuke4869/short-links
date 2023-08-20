import type { FastifyReply, FastifyRequest } from "fastify";

import { getAllPathData, status } from "../services/api";
import { authError, tokenAuth } from "../services/auth";
import { deletePath, disablePath, getPathData, updatePath, updatePathState } from "../services/path";
import type { IAPIPathRequest, IAPIRequest } from "../types/api";

const APIController = {
  async getStatus(request: FastifyRequest, reply: FastifyReply) {
    try {
      await status(reply);
    } catch (error) {
      console.error(error);
      reply.status(500).send("500 Internal Server Error");
    }
  },
  async getAllPathInfo(request: FastifyRequest<IAPIRequest>, reply: FastifyReply) {
    try {
      const { token: queryToken } = request.query;
      const { token: headerToken } = request.headers;
      const token = headerToken ?? queryToken;

      const statusCode = await tokenAuth(token);
      if (statusCode !== 200) {
        await authError(reply, statusCode);
        return;
      }

      await getAllPathData(reply);
    } catch (error) {
      console.error(error);
      reply.status(500).send("500 Internal Server Error");
    }
  },
  async getPathInfo(request: FastifyRequest<IAPIPathRequest>, reply: FastifyReply) {
    try {
      const { path } = request.params;
      const { token: queryToken } = request.query;
      const { token: headerToken } = request.headers;
      const token = headerToken ?? queryToken;

      const statusCode = await tokenAuth(token);
      if (statusCode !== 200) {
        await authError(reply, statusCode);
        return;
      }

      await getPathData(reply, path);
    } catch (error) {
      console.error(error);
      reply.status(500).send("500 Internal Server Error");
    }
  },
  async updatePath(request: FastifyRequest<IAPIPathRequest>, reply: FastifyReply) {
    try {
      const { path } = request.params;
      const { token: queryToken, url, description } = request.query;
      const { token: headerToken } = request.headers;
      const token = headerToken ?? queryToken;

      const statusCode = await tokenAuth(token);
      if (statusCode !== 200) {
        await authError(reply, statusCode);
        return;
      }

      await updatePath(reply, path, url, description);
    } catch (error) {
      console.error(error);
      reply.status(500).send("500 Internal Server Error");
    }
  },
  async updatePathState(request: FastifyRequest<IAPIPathRequest>, reply: FastifyReply) {
    try {
      const { path } = request.params;
      const { token: queryToken, url, description, reset } = request.query;
      const { token: headerToken } = request.headers;
      const token = headerToken ?? queryToken;

      const statusCode = await tokenAuth(token);
      if (statusCode !== 200) {
        await authError(reply, statusCode);
        return;
      }

      await updatePathState(reply, path, url, description, reset);
    } catch (error) {
      console.error(error);
      reply.status(500).send("500 Internal Server Error");
    }
  },
  async disablePath(request: FastifyRequest<IAPIPathRequest>, reply: FastifyReply) {
    try {
      const { path } = request.params;
      const { token: queryToken, delete: del } = request.query;
      const { token: headerToken } = request.headers;
      const token = headerToken ?? queryToken;

      const statusCode = await tokenAuth(token);
      if (statusCode !== 200) {
        await authError(reply, statusCode);
        return;
      }

      if (String(del) === "true") await deletePath(reply, path);
      else await disablePath(reply, path);
    } catch (error) {
      console.error(error);
      reply.status(500).send("500 Internal Server Error");
    }
  },
};

export default APIController;
