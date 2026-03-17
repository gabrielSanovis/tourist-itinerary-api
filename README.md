# Tourist Itinerary API

Backend API in Node.js + TypeScript that generates structured tourist itineraries based on geolocation using OpenAI.

## Architecture

```
src/
├── domain/
│   ├── entities/          ← Geolocation (domain validation), Itinerary
│   └── interfaces/        ← AIProvider (contract)
│
├── application/
│   ├── use-cases/         ← GenerateItineraryUseCase
│   ├── dtos/              ← GenerateItineraryInput, GenerateItineraryOutput
│   └── prompt/            ← ItineraryPromptBuilder
│
├── infrastructure/
│   └── ai/                ← OpenAIProvider
│
├── presentation/
│   ├── controllers/       ← ItineraryController
│   ├── routes/            ← itinerary.routes.ts
│   └── middlewares/       ← errorHandler, validateBody, rateLimiter
│
└── shared/
    ├── config/            ← config.ts (validates envs on startup)
    ├── logger/            ← logger.ts (pino)
    └── errors/            ← AppError, ValidationError, NotFoundError
```

## Setup

```bash
# 1. Clone and install dependencies
npm install

# 2. Copy and fill in environment variables
cp .env.example .env

# 3. Start in development mode
npm run dev

# 4. Build for production
npm run build
npm start
```

## API Endpoints

### POST /api/itinerary
Generates a tourist itinerary based on coordinates.

**Request body:**
```json
{
  "lat": -23.5505,
  "lng": -46.6333
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "destination": "São Paulo, Brazil",
    "bestTimeToVisit": "April to June or August to October",
    "estimatedDuration": "4 to 5 days",
    "places": [
      {
        "name": "Ibirapuera Park",
        "description": "The largest park in São Paulo...",
        "category": "Park",
        "estimatedVisitTime": "3 hours"
      }
    ],
    "tips": [
      "Use the metro to avoid traffic jams"
    ],
    "generatedAt": "2026-03-16T12:00:00.000Z"
  }
}
```

### GET /health
Health check.

```json
{ "status": "ok", "timestamp": "2026-03-16T12:00:00.000Z" }
```

## Rate Limiting

The `/api/itinerary` route is limited to **10 requests per minute per IP** by default.  
This can be configured via `RATE_LIMIT_MAX_REQUESTS` and `RATE_LIMIT_WINDOW_MS` environment variables.
