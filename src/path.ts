import dotenv from "dotenv";
import type { FastifyReply } from "fastify";

import { db } from "./index";

dotenv.config();

const TOKEN = process.env.TOKEN?.split(",") ?? null;

const auth = async (res: FastifyReply, token: string | undefined) => {
  if (!token || !TOKEN) return res.code(401).send("401 Unauthorized");
  if (!TOKEN.includes(token ?? "")) return res.code(403).send("403 Forbidden");
};

const updatePath = async (res: FastifyReply, path: string, redirectUrl: string | undefined) => {
  if (!redirectUrl) return res.code(400).send("400 Bad Request");
  const data = await db.getPathData(path);
  const result = await db.updatePathData(path, {
    path: path,
    url: redirectUrl,
    count: data?.count ?? 0,
    unavailable: false,
  });

  if (!result) return res.code(500).send("500 Internal Server Error");
  else if (!data) return res.code(201).send("201 Created");
  return res.code(200).send("200 OK");
};

const updatePathState = async (res: FastifyReply, path: string, url: string, reset: boolean | undefined) => {
  const data = await db.getPathData(path);
  if (!data) return res.code(404).send(`${url} Not Found`);
  const result = await db.updatePathData(path, {
    path: path,
    url: data.url,
    count: reset ? 0 : data.count,
    unavailable: false,
  });

  if (!result) return res.code(500).send("500 Internal Server Error");
  return res.code(200).send("200 OK");
};

const disablePath = async (res: FastifyReply, path: string, url: string) => {
  const data = await db.getPathData(path);
  if (!data) return res.code(404).send(`${url} Not Found`);
  const result = await db.updatePathData(path, {
    path: path,
    url: data.url,
    count: data.count,
    unavailable: true,
  });

  if (!result) return res.code(500).send("500 Internal Server Error");
  return res.code(200).send("200 OK");
};

export { auth, updatePath, updatePathState, disablePath };
