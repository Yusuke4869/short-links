import { IAPIPathQuerystring } from "./api";

export interface IPath {
  path: string;
  description: string | undefined;
  url: string;
  count: number;
  unavailable: boolean;
}

interface IParams {
  path: string;
}

interface IQuerystring extends IAPIPathQuerystring {
  // ブラウザから操作できるようmethodを指定可能に
  method: string | undefined;
  // Pathに関する情報を表示するかどうか
  info: boolean | undefined;
}

export interface IPathRequest {
  Params: IParams;
  Querystring: IQuerystring;
}
