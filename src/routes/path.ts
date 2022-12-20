import dotenv from "dotenv";
import type { FastifyInstance, FastifyReply } from "fastify";

import { db } from "../index";
import { auth, disablePath, updatePath, updatePathState } from "../path";

dotenv.config();

const TOKEN = process.env.TOKEN ?? null;

const pathRoutes = (server: FastifyInstance) => {
  server.all<{
    Params: {
      path: string;
    };
    Querystring: {
      // アクセストークン
      token: string | undefined;
      // ブラウザから操作できるようmethodを指定可能に
      method: string | undefined;
      // Pathに関する情報を表示するかどうか
      info: boolean | undefined;
      // リダイレクト先URL
      url: string | undefined;
      // カウントをリセットするかどうか
      reset: boolean | undefined;
    };
  }>("/:path", async (req, res: FastifyReply) => {
    const { path } = req.params;
    const { token, method, info, url, reset } = req.query;
    const requestMethod = method ? method.toUpperCase() : req.method;

    // GETリクエスト以外はすべてトークン認証を行うため確認
    if (requestMethod !== "GET") await auth(res, token);
    // リダイレクト先の作成または更新
    if (requestMethod === "PUT") await updatePath(res, path, url);
    // カウントのリセットまたはリダイレクトの有効化
    else if (requestMethod === "PATCH") await updatePathState(res, path, req.url, reset);
    // リダイレクトの無効化
    else if (requestMethod === "DELETE") await disablePath(res, path, req.url);

    // Pathに関する情報を見る
    if (info && TOKEN && token === TOKEN) {
      const data = await db.getPathData(path);
      if (!data) return res.code(404).send(`${req.url} Not Found`);
      return res.code(200).send(data);
    }

    const redirectUrl = await db.getUrl(path);
    if (!redirectUrl) return res.code(404).send(`${req.url} Not Found`);
    return res.redirect(302, redirectUrl);
  });
};

export { pathRoutes };
