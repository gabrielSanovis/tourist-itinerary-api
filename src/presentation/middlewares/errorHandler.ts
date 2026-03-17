import { Request, Response, NextFunction } from "express";
import { AppError } from "../../shared/errors/AppError";
import { logger } from "../../shared/logger/logger";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError && err.isOperational) {
    logger.warn({ err, path: req.path, method: req.method }, "Operational error");
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
    return;
  }

  logger.error({ err, path: req.path, method: req.method }, "Unexpected error");
  res.status(500).json({
    status: "error",
    message: "An unexpected internal error occurred. Please try again later.",
  });
}
