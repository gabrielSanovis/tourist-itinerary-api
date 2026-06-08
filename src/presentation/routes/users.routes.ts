import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { UserController } from "../controllers/UserController";

const controller = new UserController();

export const usersRouter = Router();

// GET /api/users/me — Retorna dados do usuário autenticado
usersRouter.get("/me", authMiddleware, controller.getMe);
