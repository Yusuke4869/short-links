import { getAllPathData, status } from "../services/api";
import { authError, tokenAuth } from "../services/auth";
import { deletePath, disablePath, getPathData, updatePath, updatePathState } from "../services/path";

import type { IAPIPathRequest, IAPIRequest } from "../types/api";
import type { FastifyReply, FastifyRequest } from "fastify";

export const getStatusController = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await status(reply);
  } catch (error) {
    console.error(error);
    await reply.status(500).send("500 Internal Server Error");
  }
};

export const getAllPathInfoController = async (request: FastifyRequest<IAPIRequest>, reply: FastifyReply) => {
  try {
    const { token: queryToken } = request.query;
    const { token: headerToken } = request.headers;
    const token = headerToken ?? queryToken;

    const statusCode = tokenAuth(token);
    if (statusCode !== 200) {
      await authError(reply, statusCode);
      return;
    }

    await getAllPathData(reply);
  } catch (error) {
    console.error(error);
    await reply.status(500).send("500 Internal Server Error");
  }
};

export const getPathInfoController = async (request: FastifyRequest<IAPIPathRequest>, reply: FastifyReply) => {
  try {
    const { path } = request.params;
    const { token: queryToken } = request.query;
    const { token: headerToken } = request.headers;
    const token = headerToken ?? queryToken;

    const statusCode = tokenAuth(token);
    if (statusCode !== 200) {
      await authError(reply, statusCode);
      return;
    }

    await getPathData(reply, path);
  } catch (error) {
    console.error(error);
    await reply.status(500).send("500 Internal Server Error");
  }
};

export const updatePathController = async (request: FastifyRequest<IAPIPathRequest>, reply: FastifyReply) => {
  try {
    const { path } = request.params;
    const { token: queryToken, url, description } = request.query;
    const { token: headerToken } = request.headers;
    const token = headerToken ?? queryToken;

    const statusCode = tokenAuth(token);
    if (statusCode !== 200) {
      await authError(reply, statusCode);
      return;
    }

    await updatePath(reply, path, url, description);
  } catch (error) {
    console.error(error);
    await reply.status(500).send("500 Internal Server Error");
  }
};

export const updatePathStateController = async (request: FastifyRequest<IAPIPathRequest>, reply: FastifyReply) => {
  try {
    const { path } = request.params;
    const { token: queryToken, url, description, reset } = request.query;
    const { token: headerToken } = request.headers;
    const token = headerToken ?? queryToken;

    const statusCode = tokenAuth(token);
    if (statusCode !== 200) {
      await authError(reply, statusCode);
      return;
    }

    await updatePathState(reply, path, url, description, reset);
  } catch (error) {
    console.error(error);
    await reply.status(500).send("500 Internal Server Error");
  }
};

export const disablePathController = async (request: FastifyRequest<IAPIPathRequest>, reply: FastifyReply) => {
  try {
    const { path } = request.params;
    const { token: queryToken, delete: del } = request.query;
    const { token: headerToken } = request.headers;
    const token = headerToken ?? queryToken;

    const statusCode = tokenAuth(token);
    if (statusCode !== 200) {
      await authError(reply, statusCode);
      return;
    }

    if (String(del) === "true") await deletePath(reply, path);
    else await disablePath(reply, path);
  } catch (error) {
    console.error(error);
    await reply.status(500).send("500 Internal Server Error");
  }
};
