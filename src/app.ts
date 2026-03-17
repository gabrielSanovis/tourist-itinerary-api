import express, { Request, Response } from "express";
import { itineraryRouter } from "./presentation/routes/itinerary.routes";
import { errorHandler } from "./presentation/middlewares/errorHandler";

const app = express();

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/itinerary", itineraryRouter);

app.use(errorHandler);

export { app };
