import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import type { Collection, Db, ObjectId } from "mongodb";

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL ?? "";
const DB_NAME = process.env.DB_NAME ?? "data";
const DB_COLLECTION_NAME = process.env.DB_COLLECTION_NAME ?? "short-link";
const DATA_NAME = process.env.DATA_NAME ?? "short-link";

type Data = {
  _id?: ObjectId;
  name: string;
  data: PathData[];
};

type PathData = {
  path: string;
  url: string;
  count: number;
  unavailable: boolean;
};

export class DataBase {
  client: MongoClient;
  db: Db | undefined;
  collection: Collection<Data> | undefined;
  #isConnected: boolean;

  constructor() {
    this.client = new MongoClient(MONGODB_URL);
    this.#isConnected = false;
    this.#init();
  }

  async #init() {
    await this.client.connect().then().catch(console.error);
    this.db = this.client.db(DB_NAME);
    this.collection = this.db.collection(DB_COLLECTION_NAME);
    this.#isConnected = true;
    console.info("Connected Mongodb.");
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
      const res = await this.collection?.findOne({ name: DATA_NAME });
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
    const data = await this.getData();
    const res = data?.data.find((v) => v.path === path);
    return res;
  }

  /**
   * 特定のPathのデータを更新します
   * @param path
   * @param newPathData
   * @returns Result | undefined
   */
  async updatePathData(path: string, newPathData: PathData) {
    try {
      const getData = await this.getData();
      const data = getData?.data.filter((v) => v.path !== path);
      if (!data) return;

      const setData = [...data, newPathData];
      const res = await this.collection?.updateOne({ name: DATA_NAME }, { $set: { data: setData } });
      return res;
    } catch (e) {
      console.error(e);
    }
  }

  async #incrementCount(data: PathData) {
    const res = await this.updatePathData(data.path, {
      path: data.path,
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
