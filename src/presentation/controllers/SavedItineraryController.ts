import { Request, Response, NextFunction } from "express";
import { SaveItineraryUseCase } from "../../application/use-cases/SaveItineraryUseCase";
import { ListSavedItinerariesUseCase } from "../../application/use-cases/ListSavedItinerariesUseCase";
import { GetSavedItineraryUseCase } from "../../application/use-cases/GetSavedItineraryUseCase";
import { DeleteSavedItineraryUseCase } from "../../application/use-cases/DeleteSavedItineraryUseCase";
import { SavedItinerary } from "../../domain/entities/SavedItinerary";
import { AppError } from "../../shared/errors/AppError";

interface SavedItineraryResponse {
  id: string;
  userId: string;
  title?: string;
  savedAt: string;
  destination: string;
  bestTimeToVisit: string;
  estimatedDuration: string;
  places: SavedItinerary["places"];
  tips: SavedItinerary["tips"];
  generatedAt: string;
}

function toResponse(si: SavedItinerary): SavedItineraryResponse {
  return {
    id: si.id,
    userId: si.userId,
    title: si.title,
    savedAt: si.savedAt.toISOString(),
    destination: si.destination,
    bestTimeToVisit: si.bestTimeToVisit,
    estimatedDuration: si.estimatedDuration,
    places: [...si.places],
    tips: [...si.tips],
    generatedAt: si.generatedAt.toISOString(),
  };
}

interface SavedItinerarySummaryResponse {
  id: string;
  userId: string;
  title?: string;
  savedAt: string;
  destination: string;
  bestTimeToVisit: string;
  estimatedDuration: string;
  generatedAt: string;
}

function toSummaryResponse(si: SavedItinerary): SavedItinerarySummaryResponse {
  return {
    id: si.id,
    userId: si.userId,
    title: si.title,
    savedAt: si.savedAt.toISOString(),
    destination: si.destination,
    bestTimeToVisit: si.bestTimeToVisit,
    estimatedDuration: si.estimatedDuration,
    generatedAt: si.generatedAt.toISOString(),
  };
}

export class SavedItineraryController {
  constructor(
    private readonly saveUseCase: SaveItineraryUseCase,
    private readonly listUseCase: ListSavedItinerariesUseCase,
    private readonly getUseCase: GetSavedItineraryUseCase,
    private readonly deleteUseCase: DeleteSavedItineraryUseCase
  ) {}

  public save = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.uid;

      const saved = await this.saveUseCase.execute({
        userId,
        itinerary: req.body.itinerary,
        title: req.body.title,
      });

      res.status(201).json({
        status: "success",
        data: toResponse(saved),
      });
    } catch (err) {
      next(err);
    }
  };

  public list = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.uid;
      const itineraries = await this.listUseCase.execute(userId);

      res.status(200).json({
        status: "success",
        count: itineraries.length,
        data: itineraries.map(toSummaryResponse),
      });
    } catch (err) {
      next(err);
    }
  };

  public getById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.uid;
      const { id } = req.params as { id: string };

      if (!id) {
        throw new AppError("Itinerary ID is required", 400);
      }

      const itinerary = await this.getUseCase.execute(userId, id);

      res.status(200).json({
        status: "success",
        data: toResponse(itinerary),
      });
    } catch (err) {
      next(err);
    }
  };

  public delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.uid;
      const { id } = req.params as { id: string };

      if (!id) {
        throw new AppError("Itinerary ID is required", 400);
      }

      await this.deleteUseCase.execute(userId, id);

      res.status(200).json({
        status: "success",
        message: "Itinerary deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  };
}
