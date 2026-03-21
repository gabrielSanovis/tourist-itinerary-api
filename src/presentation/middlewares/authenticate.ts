import { Request, Response, NextFunction } from "express";
import { AppError } from "../../shared/errors/AppError";
import { verifyAuthToken } from "../../shared/auth/token";

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized", 401));
  }

  const token = header.slice("Bearer ".length).trim();
  if (!token) {
    return next(new AppError("Unauthorized", 401));
  }

  try {
    const payload = verifyAuthToken(token);
    if (!payload.sub || typeof payload.sub !== "string") {
      return next(new AppError("Unauthorized", 401));
    }

    req.user = {
      id: payload.sub,
      username: payload.username,
    };

    return next();
  } catch (err) {
    return next(new AppError("Unauthorized", 401));
  }
}
