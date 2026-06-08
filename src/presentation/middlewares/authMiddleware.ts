import { Request, Response, NextFunction } from "express";
import { auth } from "../../infrastructure/firebase/firebaseAdmin";
import { AppError } from "../../shared/errors/AppError";

// Extensão do tipo Request para incluir o usuário autenticado
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email?: string;
        name?: string;
      };
    }
  }
}

export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(
        "Missing or invalid Authorization header. Expected: Bearer <idToken>",
        401
      );
    }

    const idToken = authHeader.split("Bearer ")[1]!.trim();

    if (!idToken) {
      throw new AppError("ID Token is empty", 401);
    }

    const decodedToken = await auth.verifyIdToken(idToken);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
    };

    next();
  } catch (err) {
    // Erros do Firebase Auth (token expirado, inválido, etc.)
    if (err instanceof AppError) {
      next(err);
      return;
    }

    next(new AppError("Invalid or expired authentication token", 401));
  }
}
