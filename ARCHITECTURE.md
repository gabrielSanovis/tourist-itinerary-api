# Architecture Overview: Tourist Itinerary API

This document provides a high-level overview of the architecture of the **Tourist Itinerary API**. The project is built with **Node.js, TypeScript, and Express**, and strictly adheres to **Clean Architecture** principles to separate concerns, ensure testability, and decouple the core business logic from external dependencies (frameworks, databases, third-party APIs).

---

## 1. Core Principles
- **Separation of Concerns**: The codebase is divided into distinct layers. Dependencies point inwards towards the Domain layer.
- **Dependency Inversion**: High-level modules (Use Cases) do not depend on low-level modules (Infrastructure). Instead, both depend on abstractions (Interfaces) defined in the Domain layer.
- **Single Responsibility**: Each class, function, or layer has one primary reason to change.

---

## 2. Directory Structure & Layers

The `src/` directory is organized into the following architectural layers:

### 2.1 Domain Layer (`/domain`)
The innermost layer. It contains the core business rules and logic. It has zero external dependencies (no Express, no Firebase, no OpenAI).
- **Entities**: Pure TypeScript classes representing core business concepts (`Itinerary`, `SavedItinerary`, `Geolocation`).
- **Interfaces**: Contracts for repositories and external services that the Application layer needs, but whose implementation details reside in the Infrastructure layer (`AIProvider`, `ItineraryRepository`).

### 2.2 Application Layer (`/application`)
Contains the application-specific business rules. It orchestrates the flow of data to and from the domain entities.
- **Use Cases**: Classes representing a single action or feature of the system (e.g., `GenerateItineraryUseCase`, `SaveItineraryUseCase`, `GetSavedItineraryUseCase`). They coordinate between the Domain and Infrastructure via abstractions.
- **DTOs**: Data Transfer Objects defining the shape of data passed into and out of the use cases.

### 2.3 Infrastructure Layer (`/infrastructure`)
The outermost layer that implements the Domain interfaces. It contains all the concrete technical details for external services, databases, and APIs.
- **AI**: Implementation of the `AIProvider` using the **OpenAI API** (`OpenAIProvider`).
- **Geocoding**: Integration with external mapping APIs like **Nominatim** (Reverse Geocoding) and **Overpass API** (Points of Interest).
- **Firebase**: Integration with **Firebase Admin SDK**. Contains the `FirestoreItineraryRepository` which implements the `ItineraryRepository` interface to persist data in Firestore.

### 2.4 Presentation Layer (`/presentation`)
Responsible for handling HTTP requests, validating input, and returning responses. It depends on the Application layer to execute business logic.
- **Routes**: Express routers defining the API endpoints (`itineraries.routes.ts`, `users.routes.ts`).
- **Controllers**: Express controllers that extract data from HTTP requests, invoke the appropriate Use Case, and format the HTTP response (`ItineraryController`, `SavedItineraryController`).
- **Middlewares**: Request interceptors for cross-cutting concerns like authentication (`authMiddleware` via Firebase JWT), rate limiting, error handling, and request body validation (using **Zod**).

### 2.5 Shared Layer (`/shared`)
Contains common utilities and configurations used across multiple layers.
- **Config**: Environment variable validation and loading using **Zod**.
- **Errors**: Custom error classes (`AppError`, `LimitExceededError`) to standardize error handling across the application.
- **Logger**: Structured logging utility using **Pino**.

---

## 3. Technology Stack

- **Runtime & Framework**: Node.js, Express, TypeScript.
- **Authentication**: Firebase Authentication (ID Tokens validated via Firebase Admin SDK).
- **Database**: Firebase Firestore (NoSQL Document database).
- **AI Integration**: OpenAI SDK (`gpt-4o-mini` or similar models).
- **External APIs**: OpenStreetMap (Nominatim for address, Overpass for POIs).
- **Validation**: Zod.
- **Logging**: Pino.

---

## 4. Key Request Flows

### 4.1 Generating an Itinerary (`POST /api/itinerary`)
1. **Presentation**: Route intercepts the request, validates body (lat/lng), hits `ItineraryController`.
2. **Application**: `GenerateItineraryUseCase` is invoked.
3. **Infrastructure**: Use case calls Nominatim/Overpass (via functions) to fetch local context, then calls `OpenAIProvider` to generate the itinerary.
4. **Domain**: The AI provider constructs and returns an `Itinerary` entity.
5. **Presentation**: Controller formats the `Itinerary` entity to JSON and returns it to the client.

### 4.2 Saving an Itinerary (`POST /api/itineraries`)
1. **Presentation**: `authMiddleware` validates the Firebase JWT and injects `req.user`. Controller extracts body and user ID.
2. **Application**: `SaveItineraryUseCase` is invoked. It uses `ItineraryRepository` to check the total count of saved itineraries for the user.
3. **Domain/Shared**: If count >= 10, a `LimitExceededError` (403) is thrown.
4. **Infrastructure**: `FirestoreItineraryRepository` saves the itinerary into the user's Firestore subcollection (`users/{uid}/itineraries`).
5. **Presentation**: Returns 201 Created with the saved itinerary summary.

---

## 5. Security & Access Control

- **Stateless Authentication**: The backend does not store passwords or session states. It strictly relies on client-provided Firebase ID tokens (`Bearer <token>`).
- **Data Isolation**: Firestore documents are stored in subcollections namespaced by the user's Firebase UID (`users/{uid}/itineraries`). The `FirestoreItineraryRepository` enforces ownership dynamically based on the requested UID.
- **Rate Limiting**: Applied to public endpoints like generation to prevent abuse.
