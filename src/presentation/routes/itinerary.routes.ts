import { Router } from "express";
import { z } from "zod";
import { ItineraryController } from "../controllers/ItineraryController";
import { validateBody } from "../middlewares/validateBody";
import { rateLimiter } from "../middlewares/rateLimiter";
import { authenticate } from "../middlewares/authenticate";
import { GenerateItineraryUseCase } from "../../application/use-cases/GenerateItineraryUseCase";
import { OpenAIProvider } from "../../infrastructure/ai/OpenAIProvider";

const generateItinerarySchema = z.object({
  lat: z
    .number({ error: "lat must be a number" })
    .min(-90, "lat must be >= -90")
    .max(90, "lat must be <= 90"),
  lng: z
    .number({ error: "lng must be a number" })
    .min(-180, "lng must be >= -180")
    .max(180, "lng must be <= 180"),
});

const aiProvider = new OpenAIProvider();
const generateItineraryUseCase = new GenerateItineraryUseCase(aiProvider);
const itineraryController = new ItineraryController(generateItineraryUseCase);

export const itineraryRouter = Router();

itineraryRouter.post(
  "/",
  authenticate,
  rateLimiter,
  validateBody(generateItinerarySchema),
  itineraryController.generate
);
