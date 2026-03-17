import { AIProvider } from "../../domain/interfaces/AIProvider";
import { Geolocation } from "../../domain/entities/Geolocation";
import { Itinerary } from "../../domain/entities/Itinerary";
import { GenerateItineraryInput } from "../dtos/GenerateItineraryInput";
import { GenerateItineraryOutput } from "../dtos/GenerateItineraryOutput";

export class GenerateItineraryUseCase {
  constructor(private readonly aiProvider: AIProvider) {}

  public async execute(
    input: GenerateItineraryInput
  ): Promise<GenerateItineraryOutput> {
    const geolocation = new Geolocation({ lat: input.lat, lng: input.lng });

    const itinerary: Itinerary =
      await this.aiProvider.generateItinerary(geolocation);

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
