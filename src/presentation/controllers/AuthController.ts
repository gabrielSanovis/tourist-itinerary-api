import { Request, Response, NextFunction } from "express";
import {
  RegisterUserUseCase,
  RegisterUserInput,
} from "../../application/use-cases/RegisterUserUseCase";
import {
  LoginUserUseCase,
  LoginUserInput,
} from "../../application/use-cases/LoginUserUseCase";
import { GetMeUseCase } from "../../application/use-cases/GetMeUseCase";
import { AppError } from "../../shared/errors/AppError";

export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly getMeUseCase: GetMeUseCase
  ) {}

  public register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const input: RegisterUserInput = req.body as RegisterUserInput;
      const output = await this.registerUserUseCase.execute(input);
      res.status(201).json({ status: "success", data: output });
    } catch (err) {
      next(err);
    }
  };

  public login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const input: LoginUserInput = req.body as LoginUserInput;
      const output = await this.loginUserUseCase.execute(input);
      res.status(200).json({ status: "success", data: output });
    } catch (err) {
      next(err);
    }
  };

  public me = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user?.id) {
        throw new AppError("Unauthorized", 401);
      }
      const output = await this.getMeUseCase.execute(req.user.id);
      res.status(200).json({ status: "success", data: output });
    } catch (err) {
      next(err);
    }
  };
}
