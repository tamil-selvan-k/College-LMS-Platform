import { STATUS_CODE } from "../constants";

export class CustomError extends Error {
  statusCode: number;

  constructor({ message, statusCode = STATUS_CODE.BAD_REQUEST }: { message: string; statusCode?: number }) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace?.(this, this.constructor);
  }
}