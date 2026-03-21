import { Router } from "express";
import { z } from "zod";
import { validateBody } from "../middlewares/validateBody";
import { AuthController } from "../controllers/AuthController";
import { UserRepositoryPostgres } from "../../infrastructure/db/UserRepositoryPostgres";
import { RegisterUserUseCase } from "../../application/use-cases/RegisterUserUseCase";
import { LoginUserUseCase } from "../../application/use-cases/LoginUserUseCase";
import { GetMeUseCase } from "../../application/use-cases/GetMeUseCase";
import { authenticate } from "../middlewares/authenticate";

const registerSchema = z.object({
  name: z.string().min(1, "name is required"),
  username: z.string().min(3, "username must be at least 3 characters"),
  password: z.string().min(6, "password must be at least 6 characters"),
});

const loginSchema = z.object({
  username: z.string().min(1, "username is required"),
  password: z.string().min(1, "password is required"),
});

const userRepository = new UserRepositoryPostgres();
const registerUserUseCase = new RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository);
const getMeUseCase = new GetMeUseCase(userRepository);
const authController = new AuthController(
  registerUserUseCase,
  loginUserUseCase,
  getMeUseCase
);

export const authRouter = Router();

authRouter.post(
  "/register",
  validateBody(registerSchema),
  authController.register
);

authRouter.post("/login", validateBody(loginSchema), authController.login);

authRouter.get("/me", authenticate, authController.me);
