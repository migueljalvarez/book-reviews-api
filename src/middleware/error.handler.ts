import { NextFunction, Request, Response } from "express";

import { NotFoundException } from "../exceptions/not-found.exception";
import { BadRequestException } from "../exceptions/bad-request.exception";
import { InternalServerException } from "../exceptions/internal-server.exception";
import Logger from "../provider/logger";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  Logger.info(errorHandler.name, "Catching error exception");
  let statusCode: number = 500;
  let message: string = "Internal Server Error";
  let name: string = "Error";
  if (
    err instanceof BadRequestException ||
    err instanceof NotFoundException ||
    err instanceof InternalServerException
  ) {
    statusCode = err.status;
    message = err.message;
    name = err.name;
  } else if (err instanceof Error) {
    name = err.name;
    message = err.message;
  }

  res.status(statusCode).json({
    statusCode,
    name,
    message,
  });
}
