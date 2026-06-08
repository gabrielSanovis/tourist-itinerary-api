import express, { Request, Response } from "express";
import cors from "cors";
import { itineraryRouter } from "./presentation/routes/itinerary.routes";
import { itinerariesRouter } from "./presentation/routes/itineraries.routes";
import { usersRouter } from "./presentation/routes/users.routes";
import { errorHandler } from "./presentation/middlewares/errorHandler";
import { config } from "./shared/config/config";

const app = express();

app.use(cors({
  origin: config.CORS_ORIGIN,
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Accept", "Authorization"],
}));

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Rota pública — gerar itinerário (sem autenticação)
app.use("/api/itinerary", itineraryRouter);

// Rotas protegidas — usuário autenticado
app.use("/api/users", usersRouter);
app.use("/api/itineraries", itinerariesRouter);

app.use(errorHandler);

export { app };

