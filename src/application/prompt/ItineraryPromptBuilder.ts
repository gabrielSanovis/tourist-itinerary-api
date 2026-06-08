import { Geolocation } from "../../domain/entities/Geolocation";
import { NominatimResult } from "../../infrastructure/geocoding/nominatimService";
import { OverpassResult } from "../../infrastructure/geocoding/overpassService";

export class ItineraryPromptBuilder {
  private readonly SYSTEM_PROMPT = `You are an expert travel guide with extensive knowledge of tourist destinations worldwide.
Your role is to create detailed, practical, and engaging tourist itineraries.
You MUST always respond with valid JSON only — no markdown, no prose outside the JSON object.`;

  public buildSystemPrompt(): string {
    return this.SYSTEM_PROMPT;
  }

  public buildUserPrompt(
    geolocation: Geolocation,
    addressInfo: NominatimResult | null,
    overpassResult: OverpassResult | null
  ): string {
    let addressBlock = "";
    if (addressInfo) {
      const parts: string[] = [
        `Full address: ${addressInfo.displayName}`,
      ];
      if (addressInfo.city) parts.push(`City: ${addressInfo.city}`);
      if (addressInfo.state) parts.push(`State: ${addressInfo.state}`);
      if (addressInfo.country) parts.push(`Country: ${addressInfo.country}`);
      if (addressInfo.district) parts.push(`District/Neighbourhood: ${addressInfo.district}`);
      if (addressInfo.locationType) parts.push(`Location type: ${addressInfo.locationType}`);
      addressBlock = `\n\nReverse-geocoded address information for these coordinates:\n${parts.join("\n")}`;
    }

    let poiBlock = "";
    if (overpassResult && overpassResult.pois.length > 0) {
      const poiLines = overpassResult.pois.map(
        (poi, i) => `${i + 1}. ${poi.name} — ${poi.category} (${poi.type}) — ${poi.distanceMeters}m away — lat: ${poi.lat}, lng: ${poi.lng}`
      );
      poiBlock = `\n\nNearby points of interest found via OpenStreetMap (within ${overpassResult.radiusMeters}m radius, ${overpassResult.totalFound} total elements found):\n${poiLines.join("\n")}`;
    }

    return `Generate a comprehensive tourist itinerary for the location at coordinates:
Latitude: ${geolocation.lat}
Longitude: ${geolocation.lng}${addressBlock}${poiBlock}

Use the address and nearby points of interest above to accurately identify the location and create a rich tourist itinerary.
Prioritize real places from the POI list when building the itinerary.

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
      "estimatedVisitTime": "string — e.g. '2 hours'",
      "lat": "number — latitude of the place",
      "lng": "number — longitude of the place"
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
- Be specific and accurate to the real location
- For each place, provide accurate lat/lng coordinates. Use the POI coordinates when available.`;
  }
}
