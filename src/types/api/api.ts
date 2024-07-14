interface IQuerystring {
  token: string | undefined;
}

interface IHeaders {
  token: string | undefined;
}

export interface IAPIRequest {
  Querystring: IQuerystring;
  Headers: IHeaders;
}
