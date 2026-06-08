import { ItineraryPlace } from "../../domain/entities/Itinerary";

export interface SaveItineraryInput {
  userId: string;
  title?: string;
  itinerary: {
    destination: string;
    bestTimeToVisit: string;
    estimatedDuration: string;
    places: ItineraryPlace[];
    tips: string[];
    generatedAt: string; // ISO string vinda do output do /generate
  };
}
