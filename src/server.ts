import { config } from "dotenv";

import app from "./app";

config();

const HOST = process.env.HOST ?? "127.0.0.1";
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const start = async () => {
  try {
    await app.listen({ host: HOST, port: PORT });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

void start();
