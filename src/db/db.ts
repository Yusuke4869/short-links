import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import type { Collection, Db, ObjectId } from "mongodb";
import { exit } from "process";

import type { IPath } from "../types/path";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI ?? "";
const DB_NAME = process.env.DB_NAME ?? "data";
const DB_COLLECTION_NAME = process.env.DB_COLLECTION_NAME ?? "short-links";

interface IPathData extends IPath {
  _id?: ObjectId;
}

export class DataBase {
  client: MongoClient;
  db: Db | undefined;
  collection: Collection<IPathData> | undefined;
  #isConnected: boolean;

  constructor() {
    this.client = new MongoClient(MONGODB_URI);
    this.#isConnected = false;
    this.#init();
  }

  async #init() {
    await this.client
      .connect()
      .then(() => {
        this.#isConnected = true;
      })
      .catch((e) => {
        console.error(e);
        console.error("Could Not Connected Mongodb");
        exit(1);
      });
    this.db = this.client.db(DB_NAME);
    this.collection = this.db.collection(DB_COLLECTION_NAME);
    console.info("Connected Mongodb");
  }

  #wait() {
    return new Promise((resolve, reject) => {
      try {
        if (this.#isConnected) {
          resolve("connected");
          return;
        }

        const interval = setInterval(() => {
          if (this.#isConnected) {
            resolve("connected");
            clearInterval(interval);
          }
        }, 100);
      } catch (e) {
        reject(e);
      }
    });
  }

  async ping() {
    await this.#wait();
    const ping = await this.db?.admin().ping();
    return ping;
  }

  async getData() {
    try {
      await this.#wait();
      const res = await this.collection?.find().toArray();
      return res;
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Pathに応じたデータを返します
   * @param path
   * @returns PathData | undefined
   */
  async getPathData(path: string) {
    const data = await this.collection?.findOne({ path: path });
    return data;
  }

  /**
   * 特定のPathのデータを更新します
   * @param path
   * @param pathData
   * @returns UpdateResult
   */
  async updatePathData(path: string, pathData: IPath) {
    try {
      const res = await this.collection?.updateOne({ path: path }, { $set: { ...pathData } }, { upsert: true });
      return res;
    } catch (e) {
      console.error(e);
    }
  }

  async #incrementCount(data: IPath) {
    const res = await this.updatePathData(data.path, {
      path: data.path,
      description: data.description,
      url: data.url,
      count: data.count + 1,
      unavailable: false,
    });
    return res;
  }

  /**
   * Pathに応じたURLを返し、カウントを更新します
   * @param path
   * @returns Redirect URL | undefined
   */
  async getUrl(path: string) {
    const data = await this.getPathData(path);
    if (!data) return undefined;
    if (data.unavailable) return undefined;

    await this.#incrementCount(data);
    return data.url;
  }
}
