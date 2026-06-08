import { Geolocation } from "../entities/Geolocation";
import { Itinerary } from "../entities/Itinerary";
import { NominatimResult } from "../../infrastructure/geocoding/nominatimService";
import { OverpassResult } from "../../infrastructure/geocoding/overpassService";

export interface AIProvider {
  generateItinerary(
    geolocation: Geolocation,
    addressInfo: NominatimResult | null,
    overpassResult: OverpassResult | null
  ): Promise<Itinerary>;
}
