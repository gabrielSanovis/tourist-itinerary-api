import { Request, Response, NextFunction } from "express";

export class UserController {
  /**
   * GET /api/users/me
   * Retorna os dados do usuário autenticado extraídos do token Firebase.
   * Não faz chamada ao Firestore — os dados vêm do próprio JWT.
   */
  public getMe = (
    req: Request,
    res: Response,
    _next: NextFunction
  ): void => {
    res.status(200).json({
      status: "success",
      data: {
        uid: req.user!.uid,
        email: req.user!.email ?? null,
        name: req.user!.name ?? null,
      },
    });
  };
}
