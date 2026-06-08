# Product Overview: Tourist Itinerary API

## 1. What is the Tourist Itinerary API?

The **Tourist Itinerary API** is a backend service designed to power travel applications. Its primary capability is to automatically generate highly contextual, personalized, and AI-driven travel itineraries based on a specific geographic location (latitude and longitude). 

By combining real-world geospatial data with advanced generative AI, it builds out realistic, engaging, and ready-to-use travel plans, complete with destination overviews, best times to visit, duration estimates, detailed points of interest, and travel tips.

The API also provides a companion set of features allowing users to save their favorite itineraries to their personal profile for future reference.

---

## 2. Core Features & Functionality

### 2.1 AI-Powered Itinerary Generation
**Endpoint:** `POST /api/itinerary/generate` (Public)

- **How it works:** A user provides a geographic coordinate (`lat`, `lng`). The API does not rely purely on AI hallucinations; it performs "grounding" first.
- **Geospatial Grounding:** Before asking the AI to write the itinerary, the system:
  1. Performs reverse geocoding via **OpenStreetMap (Nominatim)** to figure out exactly what city, region, or landmark the coordinates represent.
  2. Queries the **Overpass API** to fetch real, existing Points of Interest (POIs) near that location (e.g., museums, parks, historical sites, restaurants).
- **AI Generation:** The context (location name + nearby POIs) is fed into the **OpenAI** language model, which synthesizes a structured, highly accurate travel itinerary. 
- **Output:** The API returns a comprehensive plan including:
  - Destination name.
  - The best time of year to visit.
  - Estimated duration needed for the trip.
  - A curated list of specific places to visit (with descriptions, categories, coordinates, and estimated time to spend at each).
  - General travel tips for the area.

### 2.2 User Authentication
The system integrates seamlessly with **Firebase Authentication**. Instead of handling passwords and sessions directly, the API accepts Firebase ID Tokens (JWT) from clients. This ensures secure, robust, and stateless authentication.

**Endpoint:** `GET /api/users/me` (Protected)
- Returns basic profile information extracted directly from the user's secure token.

### 2.3 Itinerary Persistence (The "Save" Feature)
Users can curate their own list of upcoming or past trips by saving the itineraries they generated.

- **Save an Itinerary:** (`POST /api/itineraries` - Protected)
  - Authenticated users can submit a generated itinerary payload alongside a custom title.
  - **Limit Enforced:** To manage storage and encourage curation, users are strictly limited to saving a maximum of **10 itineraries**. Attempting to save more results in a graceful error, prompting the user to delete older ones first.
  
- **View Saved Itineraries (Summary):** (`GET /api/itineraries` - Protected)
  - Returns a lightweight list of the user's saved trips. It intentionally omits heavy data (like the long list of places and tips) to ensure fast loading times on overview screens.
  
- **View Itinerary Details:** (`GET /api/itineraries/:id` - Protected)
  - Fetches the full, detailed version of a specific saved itinerary, perfect for an in-app "Trip Details" screen.

- **Delete an Itinerary:** (`DELETE /api/itineraries/:id` - Protected)
  - Allows users to remove itineraries they no longer need, freeing up space in their 10-trip quota.

---

## 3. The End-User Value Proposition

For a frontend application (like a mobile app or a web dashboard) built on top of this API, the value is clear:

1. **Zero-effort planning:** Users don't need to know the name of a city. They can drop a pin on a map or use their current location to instantly get a valid, actionable travel plan.
2. **Accuracy:** Because the AI is fed actual local data (via Overpass), the recommendations are grounded in reality, avoiding the common AI pitfall of recommending non-existent restaurants or attractions.
3. **Personal Curation:** The save functionality allows users to build a bucket list, manage their upcoming holidays, and keep their travel plans organized in the cloud without needing to copy-paste AI responses into a notes app.
