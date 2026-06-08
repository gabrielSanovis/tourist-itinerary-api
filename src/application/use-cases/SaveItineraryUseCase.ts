import { ItineraryRepository } from "../../domain/interfaces/ItineraryRepository";
import { SavedItinerary } from "../../domain/entities/SavedItinerary";
import { SaveItineraryInput } from "../dtos/SaveItineraryInput";
import { LimitExceededError } from "../../shared/errors/LimitExceededError";

const ITINERARY_LIMIT = 10;

export class SaveItineraryUseCase {
  constructor(private readonly repository: ItineraryRepository) {}

  public async execute(input: SaveItineraryInput): Promise<SavedItinerary> {
    const count = await this.repository.countByUser(input.userId);

    if (count >= ITINERARY_LIMIT) {
      throw new LimitExceededError(ITINERARY_LIMIT);
    }

    const itineraryProps = {
      ...input.itinerary,
      generatedAt: new Date(input.itinerary.generatedAt),
    };

    return this.repository.save(input.userId, itineraryProps, input.title);
  }
}
