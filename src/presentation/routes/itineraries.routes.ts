import { Router } from "express";
import { z } from "zod";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateBody } from "../middlewares/validateBody";
import { SavedItineraryController } from "../controllers/SavedItineraryController";
import { FirestoreItineraryRepository } from "../../infrastructure/firebase/FirestoreItineraryRepository";
import { SaveItineraryUseCase } from "../../application/use-cases/SaveItineraryUseCase";
import { ListSavedItinerariesUseCase } from "../../application/use-cases/ListSavedItinerariesUseCase";
import { GetSavedItineraryUseCase } from "../../application/use-cases/GetSavedItineraryUseCase";
import { DeleteSavedItineraryUseCase } from "../../application/use-cases/DeleteSavedItineraryUseCase";

// Composição de dependências
const repository = new FirestoreItineraryRepository();
const saveUseCase = new SaveItineraryUseCase(repository);
const listUseCase = new ListSavedItinerariesUseCase(repository);
const getUseCase = new GetSavedItineraryUseCase(repository);
const deleteUseCase = new DeleteSavedItineraryUseCase(repository);
const controller = new SavedItineraryController(saveUseCase, listUseCase, getUseCase, deleteUseCase);

// Schema de validação do body para salvar
const itineraryPlaceSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  estimatedVisitTime: z.string().min(1),
  lat: z.number(),
  lng: z.number(),
});

const saveItinerarySchema = z.object({
  title: z.string().max(100).optional(),
  itinerary: z.object({
    destination: z.string().min(1),
    bestTimeToVisit: z.string().min(1),
    estimatedDuration: z.string().min(1),
    places: z.array(itineraryPlaceSchema).min(1),
    tips: z.array(z.string()).min(1),
    generatedAt: z.string().datetime(),
  }),
});

export const itinerariesRouter = Router();

// Todas as rotas exigem autenticação
itinerariesRouter.use(authMiddleware);

// GET /api/itineraries — Lista itinerários salvos do usuário (resumo)
itinerariesRouter.get("/", controller.list);

// GET /api/itineraries/:id — Retorna os detalhes de um itinerário salvo
itinerariesRouter.get("/:id", controller.getById);

// POST /api/itineraries — Salva um novo itinerário
itinerariesRouter.post("/", validateBody(saveItinerarySchema), controller.save);

// DELETE /api/itineraries/:id — Remove um itinerário salvo
itinerariesRouter.delete("/:id", controller.delete);
