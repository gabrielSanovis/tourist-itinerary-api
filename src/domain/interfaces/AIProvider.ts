import { Geolocation } from "../entities/Geolocation";
import { Itinerary } from "../entities/Itinerary";

export interface AIProvider {
  generateItinerary(geolocation: Geolocation): Promise<Itinerary>;
}
