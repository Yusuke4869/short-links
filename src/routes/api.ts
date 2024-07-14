import {
  disablePathController,
  getAllPathInfoController,
  getPathInfoController,
  getStatusController,
  updatePathController,
  updatePathStateController,
} from "../controllers/apiController";

import type { IAPIPathRequest, IAPIRequest } from "../types/api";
import type { FastifyInstance } from "fastify";

// eslint-disable-next-line @typescript-eslint/require-await
const APIRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/status", getStatusController);
  fastify.get<IAPIRequest>("/all", getAllPathInfoController);
  fastify.get<IAPIPathRequest>("/path/:path", getPathInfoController);
  fastify.put<IAPIPathRequest>("/path/:path", updatePathController);
  fastify.patch<IAPIPathRequest>("/path/:path", updatePathStateController);
  fastify.delete<IAPIPathRequest>("/path/:path", disablePathController);
};

export default APIRoutes;
