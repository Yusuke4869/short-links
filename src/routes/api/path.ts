import type { FastifyInstance, FastifyReply } from "fastify";

import { db } from "../../index";
import { authErrorReturn, checkToken, disablePath, updatePath, updatePathState } from "../../path";

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
    Headers: {
      token: string | undefined;
    };
  }>("/path/:path", async (req, res: FastifyReply) => {
    const { path } = req.params;
    const { token: queryToken, url, reset } = req.query;
    const { token: headerToken } = req.headers;
    const requestMethod = req.method;

    const token = typeof headerToken === "string" ? headerToken : queryToken;

    const authStatus = await checkToken(token);
    if (authStatus !== 200) return await authErrorReturn(res, authStatus);

    // リダイレクト先の作成または更新
    if (requestMethod === "PUT") return await updatePath(res, path, url);
    // カウントのリセットまたはリダイレクトの有効化
    else if (requestMethod === "PATCH") return await updatePathState(res, path, req.url, reset);
    // リダイレクトの無効化
    else if (requestMethod === "DELETE") return await disablePath(res, path, req.url);

    const data = await db.getPathData(path);
    if (!data) return res.code(404).send(`${req.url} Not Found`);
    return res.code(200).send(data);
  });
};

export { apiPathRoutes };
