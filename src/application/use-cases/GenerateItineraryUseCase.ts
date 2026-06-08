import { AIProvider } from "../../domain/interfaces/AIProvider";
import { Geolocation } from "../../domain/entities/Geolocation";
import { Itinerary } from "../../domain/entities/Itinerary";
import { GenerateItineraryInput } from "../dtos/GenerateItineraryInput";
import { GenerateItineraryOutput } from "../dtos/GenerateItineraryOutput";
import { reverseGeocode, NominatimResult } from "../../infrastructure/geocoding/nominatimService";
import { logger } from "../../shared/logger/logger";

export class GenerateItineraryUseCase {
  constructor(private readonly aiProvider: AIProvider) {}

  public async execute(
    input: GenerateItineraryInput
  ): Promise<GenerateItineraryOutput> {
    const geolocation = new Geolocation({ lat: input.lat, lng: input.lng });

    let addressInfo: NominatimResult | null = null;
    try {
      addressInfo = await reverseGeocode(input.lat, input.lng);
      logger.info({ address: addressInfo.displayName }, "Reverse geocoding succeeded");
    } catch (err) {
      logger.warn({ err }, "Reverse geocoding failed, proceeding without address data");
    }

    const itinerary: Itinerary =
      await this.aiProvider.generateItinerary(geolocation, addressInfo);

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
