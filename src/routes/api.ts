import type { FastifyInstance } from "fastify";

import APIController from "../controllers/apiController";
import type { IAPIPathRequest, IAPIRequest } from "../types/api";

const APIRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/status", APIController.getStatus);
  fastify.get<IAPIRequest>("/all", APIController.getAllPathInfo);
  fastify.get<IAPIPathRequest>("/path/:path", APIController.getPathInfo);
  fastify.put<IAPIPathRequest>("/path/:path", APIController.updatePath);
  fastify.patch<IAPIPathRequest>("/path/:path", APIController.updatePathState);
  fastify.delete<IAPIPathRequest>("/path/:path", APIController.disablePath);
};

export default APIRoutes;
