import { config } from "dotenv";

config();

const TOKEN = process.env.TOKEN?.split(",") ?? null;

export const tokenAuth = (token: string | undefined) => {
  if (!token || !TOKEN) return 401;
  if (TOKEN.includes(token)) return 200;
  return 403;
};
