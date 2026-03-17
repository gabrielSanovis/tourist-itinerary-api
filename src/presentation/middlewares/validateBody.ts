import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ValidationError } from "../../shared/errors/ValidationError";

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      const field = firstIssue?.path.join(".");
      const message = firstIssue?.message ?? "Invalid request body";
      return next(new ValidationError(message, field));
    }

    req.body = result.data as T;
    next();
  };
}
