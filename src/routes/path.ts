import type { FastifyInstance } from "fastify";

import PathController from "../controllers/pathController";
import type { IPathRequest } from "../types";

const PathRoutes = async (fastify: FastifyInstance) => {
  fastify.get<IPathRequest>("/:path", PathController.getPathRequest);
};

export default PathRoutes;
