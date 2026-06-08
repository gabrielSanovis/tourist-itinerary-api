import { Geolocation } from "../entities/Geolocation";
import { Itinerary } from "../entities/Itinerary";
import { NominatimResult } from "../../infrastructure/geocoding/nominatimService";

export interface AIProvider {
  generateItinerary(geolocation: Geolocation, addressInfo: NominatimResult | null): Promise<Itinerary>;
}
