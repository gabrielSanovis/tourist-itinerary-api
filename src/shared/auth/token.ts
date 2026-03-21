import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config/config";

export type AuthTokenPayload = {
  sub: string;
  username: string;
};

export function signAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
}

export function verifyAuthToken(token: string): JwtPayload & AuthTokenPayload {
  return jwt.verify(token, config.JWT_SECRET) as JwtPayload & AuthTokenPayload;
}
