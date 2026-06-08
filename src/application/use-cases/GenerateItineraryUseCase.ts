import { AIProvider } from "../../domain/interfaces/AIProvider";
import { Geolocation } from "../../domain/entities/Geolocation";
import { Itinerary } from "../../domain/entities/Itinerary";
import { GenerateItineraryInput } from "../dtos/GenerateItineraryInput";
import { GenerateItineraryOutput } from "../dtos/GenerateItineraryOutput";
import { reverseGeocode, NominatimResult } from "../../infrastructure/geocoding/nominatimService";
import { fetchNearbyPOIs, OverpassResult } from "../../infrastructure/geocoding/overpassService";
import { logger } from "../../shared/logger/logger";

export class GenerateItineraryUseCase {
  constructor(private readonly aiProvider: AIProvider) {}

  public async execute(
    input: GenerateItineraryInput
  ): Promise<GenerateItineraryOutput> {
    const geolocation = new Geolocation({ lat: input.lat, lng: input.lng });

    const [nominatimSettled, overpassSettled] = await Promise.allSettled([
      reverseGeocode(input.lat, input.lng),
      fetchNearbyPOIs(input.lat, input.lng),
    ]);

    let addressInfo: NominatimResult | null = null;
    if (nominatimSettled.status === "fulfilled") {
      addressInfo = nominatimSettled.value;
      logger.info({ address: addressInfo.displayName }, "Reverse geocoding succeeded");
    } else {
      logger.warn({ err: nominatimSettled.reason }, "Reverse geocoding failed, proceeding without address data");
    }

    let overpassResult: OverpassResult | null = null;
    if (overpassSettled.status === "fulfilled") {
      overpassResult = overpassSettled.value;
      logger.info({ totalPOIs: overpassResult.pois.length }, "Overpass POI fetch succeeded");
    } else {
      logger.warn({ err: overpassSettled.reason }, "Overpass POI fetch failed, proceeding without POI data");
    }

    const itinerary: Itinerary =
      await this.aiProvider.generateItinerary(geolocation, addressInfo, overpassResult);

    return this.toOutput(itinerary);
  }

  private toOutput(itinerary: Itinerary): GenerateItineraryOutput {
    return {
      destination: itinerary.destination,
      bestTimeToVisit: itinerary.bestTimeToVisit,
      estimatedDuration: itinerary.estimatedDuration,
      places: [...itinerary.places],
      tips: [...itinerary.tips],
      generatedAt: itinerary.generatedAt.toISOString(),
    };
  }
}
