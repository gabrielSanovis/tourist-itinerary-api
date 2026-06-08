import { ItineraryRepository } from "../../domain/interfaces/ItineraryRepository";
import { SavedItinerary } from "../../domain/entities/SavedItinerary";
import { AppError } from "../../shared/errors/AppError";

export class GetSavedItineraryUseCase {
  constructor(private readonly repository: ItineraryRepository) {}

  public async execute(userId: string, id: string): Promise<SavedItinerary> {
    const itinerary = await this.repository.findById(userId, id);
    if (!itinerary) {
      throw new AppError("Itinerary not found", 404);
    }
    return itinerary;
  }
}
