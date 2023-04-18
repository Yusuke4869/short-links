import dotenv from "dotenv";

import app from "./app";

dotenv.config();

const PORT = Number(process.env.PORT) ?? 3000;

const start = async () => {
  try {
    await app.listen({ port: PORT });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
