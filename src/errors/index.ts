import type { StatusCodes } from "http-status-codes";

export class ErrorMessage {
  constructor(
    public message: string | string[],
    public statusCode: StatusCodes,
  ) {
    this.message = message;
    this.statusCode = statusCode;
  }
}
