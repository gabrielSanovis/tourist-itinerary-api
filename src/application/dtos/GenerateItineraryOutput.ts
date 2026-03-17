import { ItineraryPlace } from "../../domain/entities/Itinerary";

export interface GenerateItineraryOutput {
  destination: string;
  bestTimeToVisit: string;
  estimatedDuration: string;
  places: ItineraryPlace[];
  tips: string[];
  generatedAt: string;
}
