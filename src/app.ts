import express, { Request, Response } from "express";
import cors from "cors";
import { itineraryRouter } from "./presentation/routes/itinerary.routes";
import { authRouter } from "./presentation/routes/auth.routes";
import { errorHandler } from "./presentation/middlewares/errorHandler";
import { config } from "./shared/config/config";

const app = express();

app.use(cors({
  origin: config.CORS_ORIGIN,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Accept", "Authorization"],
}));

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/itinerary", itineraryRouter);
app.use("/api/auth", authRouter);

app.use(errorHandler);

export { app };
