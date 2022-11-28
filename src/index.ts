import dotenv from "dotenv";
import Fastify, { FastifyInstance } from "fastify";
import type { FastifyReply, FastifyRequest } from "fastify";

import { DataBase } from "./db";

dotenv.config();

const TOKEN = process.env.TOKEN ?? null;

const server: FastifyInstance = Fastify({ logger: true });
const db = new DataBase();

server.all("/", async (req, res: FastifyReply) => {
  return res.status(200).send("Hello World!");
});

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
  if (requestMethod !== "GET") {
    if (!token || !TOKEN) return res.code(401).send("401 Unauthorized");
    if (token !== TOKEN) return res.code(403).send("403 Forbidden");
  }

  // リダイレクト先の作成または更新
  if (requestMethod === "PUT") {
    if (!url) return res.code(400).send("400 Bad Request");
    const data = await db.getPathData(path);
    const result = await db.updatePathData(path, {
      path: path,
      url: url,
      count: data?.count ?? 0,
      unavailable: false,
    });

    if (!result) return res.code(500).send("500 Internal Server Error");
    else if (!data) return res.code(201).send("201 Created");
    return res.code(200).send("200 OK");
  }
  // カウントのリセットまたはリダイレクトの有効化
  else if (requestMethod === "PATCH") {
    const data = await db.getPathData(path);
    if (!data) return res.code(404).send(`${req.url} Not Found`);
    const result = await db.updatePathData(path, {
      path: path,
      url: data.url,
      count: reset ? 0 : data.count,
      unavailable: false,
    });

    if (!result) return res.code(500).send("500 Internal Server Error");
    return res.code(200).send("200 OK");
  }
  // リダイレクトの無効化
  else if (requestMethod === "DELETE") {
    const data = await db.getPathData(path);
    if (!data) return res.code(404).send(`${req.url} Not Found`);
    const result = await db.updatePathData(path, {
      path: path,
      url: data.url,
      count: data.count,
      unavailable: true,
    });

    if (!result) return res.code(500).send("500 Internal Server Error");
    return res.code(200).send("200 OK");
  }

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

server.setNotFoundHandler(async (req: FastifyRequest, res: FastifyReply) => {
  return res.code(404).send(`${req.url} Not Found`);
});

const start = async () => {
  try {
    await server.listen({ port: 3000 });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
