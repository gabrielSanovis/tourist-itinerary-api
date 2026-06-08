import { ItineraryRepository } from "../../domain/interfaces/ItineraryRepository";
import { SavedItinerary } from "../../domain/entities/SavedItinerary";

export class ListSavedItinerariesUseCase {
  constructor(private readonly repository: ItineraryRepository) {}

  public async execute(userId: string): Promise<SavedItinerary[]> {
    return this.repository.findAllByUser(userId);
  }
}
