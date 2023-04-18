import type { IAPIRequest } from "./api";

interface IParams {
  path: string;
}

export interface IQuerystring {
  // アクセストークン
  token: string | undefined;
  // リダイレクト先URL
  url: string | undefined;
  // 説明
  description: string | undefined;
  // カウントをリセットするかどうか
  reset: boolean | undefined;
}

export interface IAPIPathRequest extends IAPIRequest {
  Params: IParams;
  Querystring: IQuerystring;
}
