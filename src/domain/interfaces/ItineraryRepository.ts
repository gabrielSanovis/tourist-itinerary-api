import { ItineraryProps } from "../entities/Itinerary";
import { SavedItinerary } from "../entities/SavedItinerary";

export interface ItineraryRepository {
  save(
    userId: string,
    itinerary: ItineraryProps,
    title?: string
  ): Promise<SavedItinerary>;

  findAllByUser(userId: string): Promise<SavedItinerary[]>;

  findById(userId: string, id: string): Promise<SavedItinerary | null>;

  delete(userId: string, id: string): Promise<void>;

  countByUser(userId: string): Promise<number>;
}
