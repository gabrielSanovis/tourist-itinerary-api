import { Geolocation } from "../../domain/entities/Geolocation";

export class ItineraryPromptBuilder {
  private readonly SYSTEM_PROMPT = `You are an expert travel guide with extensive knowledge of tourist destinations worldwide.
Your role is to create detailed, practical, and engaging tourist itineraries.
You MUST always respond with valid JSON only — no markdown, no prose outside the JSON object.`;

  public buildSystemPrompt(): string {
    return this.SYSTEM_PROMPT;
  }

  public buildUserPrompt(geolocation: Geolocation): string {
    return `Generate a comprehensive tourist itinerary for the location at coordinates:
Latitude: ${geolocation.lat}
Longitude: ${geolocation.lng}

Identify the nearest city or region for these coordinates and create a rich tourist itinerary.

Respond STRICTLY with a JSON object matching this exact schema (no extra fields, no markdown):
{
  "destination": "string — city and country name",
  "bestTimeToVisit": "string — recommended season and months",
  "estimatedDuration": "string — suggested number of days for the trip",
  "places": [
    {
      "name": "string — place name",
      "description": "string — 2-3 sentence description",
      "category": "string — one of: Museum, Park, Restaurant, Monument, Beach, Market, Religious Site, Entertainment, Nature",
      "estimatedVisitTime": "string — e.g. '2 hours'"
    }
  ],
  "tips": [
    "string — practical travel tip"
  ]
}

Requirements:
- Include at least 5 places and at most 10
- Include at least 4 practical tips
- All text must be in Brazilian Portuguese (pt-BR)
- Be specific and accurate to the real location`;
  }
}
