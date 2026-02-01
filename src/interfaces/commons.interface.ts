import type { Request } from "express";

export type IGetResponse<T> = {
  results: T[];
  total: number;
};

export type BodyRequest<T> = Request<unknown, unknown, T>;
export type QueryRequest<T> = Request<unknown, unknown, unknown, T>;
