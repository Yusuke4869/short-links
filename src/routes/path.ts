import { getPathRequestController } from "../controllers/pathController";

import type { IPathRequest } from "../types";
import type { FastifyInstance } from "fastify";

// eslint-disable-next-line @typescript-eslint/require-await
const PathRoutes = async (fastify: FastifyInstance) => {
  fastify.get<IPathRequest>("/:path", getPathRequestController);
};

export default PathRoutes;
