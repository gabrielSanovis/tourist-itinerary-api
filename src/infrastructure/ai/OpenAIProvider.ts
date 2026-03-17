import OpenAI from "openai";
import { z } from "zod";
import { AIProvider } from "../../domain/interfaces/AIProvider";
import { Geolocation } from "../../domain/entities/Geolocation";
import { Itinerary } from "../../domain/entities/Itinerary";
import { ItineraryPromptBuilder } from "../../application/prompt/ItineraryPromptBuilder";
import { AppError } from "../../shared/errors/AppError";
import { logger } from "../../shared/logger/logger";
import { config } from "../../shared/config/config";

const itineraryResponseSchema = z.object({
  destination: z.string().min(1),
  bestTimeToVisit: z.string().min(1),
  estimatedDuration: z.string().min(1),
  places: z
    .array(
      z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        category: z.string().min(1),
        estimatedVisitTime: z.string().min(1),
      })
    )
    .min(1),
  tips: z.array(z.string().min(1)).min(1),
});

export class OpenAIProvider implements AIProvider {
  private readonly client: OpenAI;
  private readonly promptBuilder: ItineraryPromptBuilder;

  constructor() {
    this.client = new OpenAI({ apiKey: config.OPENAI_API_KEY });
    this.promptBuilder = new ItineraryPromptBuilder();
  }

  public async generateItinerary(geolocation: Geolocation): Promise<Itinerary> {
    logger.info(
      { lat: geolocation.lat, lng: geolocation.lng },
      "Requesting itinerary from OpenAI"
    );

    let rawContent: string | null;

    try {
      const completion = await this.client.chat.completions.create({
        model: config.OPENAI_MODEL,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: this.promptBuilder.buildSystemPrompt(),
          },
          {
            role: "user",
            content: this.promptBuilder.buildUserPrompt(geolocation),
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      rawContent = completion.choices[0]?.message?.content ?? null;
    } catch (err) {
      logger.error({ err }, "OpenAI API call failed");
      throw new AppError("Failed to communicate with the AI provider", 502);
    }

    if (!rawContent) {
      throw new AppError("AI provider returned an empty response", 502);
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      logger.error({ rawContent }, "AI response is not valid JSON");
      throw new AppError("AI provider returned malformed JSON", 502);
    }

    const validation = itineraryResponseSchema.safeParse(parsed);
    if (!validation.success) {
      logger.error({ issues: validation.error.issues }, "AI response schema mismatch");
      throw new AppError("AI provider response does not match expected schema", 502);
    }

    const data = validation.data;

    logger.info({ destination: data.destination }, "Itinerary generated successfully");

    return new Itinerary({
      destination: data.destination,
      bestTimeToVisit: data.bestTimeToVisit,
      estimatedDuration: data.estimatedDuration,
      places: data.places,
      tips: data.tips,
      generatedAt: new Date(),
    });
  }
}
