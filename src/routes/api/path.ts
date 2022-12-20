import type { FastifyInstance, FastifyReply } from "fastify";

import { db } from "../../index";
import { auth, disablePath, updatePath, updatePathState } from "../../path";

const apiPathRoutes = (server: FastifyInstance) => {
  server.all<{
    Params: {
      path: string;
    };
    Querystring: {
      // アクセストークン
      token: string | undefined;
      // リダイレクト先URL
      url: string | undefined;
      // カウントをリセットするかどうか
      reset: boolean | undefined;
    };
  }>("/path/:path", async (req, res: FastifyReply) => {
    const { path } = req.params;
    const { token, url, reset } = req.query;
    const requestMethod = req.method;

    await auth(res, token);

    // リダイレクト先の作成または更新
    if (requestMethod === "PUT") await updatePath(res, path, url);
    // カウントのリセットまたはリダイレクトの有効化
    else if (requestMethod === "PATCH") await updatePathState(res, path, req.url, reset);
    // リダイレクトの無効化
    else if (requestMethod === "DELETE") await disablePath(res, path, req.url);

    const data = await db.getPathData(path);
    if (!data) return res.code(404).send(`${req.url} Not Found`);
    return res.code(200).send(data);
  });
};

export { apiPathRoutes };
