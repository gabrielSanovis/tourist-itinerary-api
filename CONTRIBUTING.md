# Contributing to Tourist Itinerary API

Thank you for your interest in contributing! This document outlines the standards, best practices, and developer guidelines for this project.

## 1. Local Environment Setup
1. Clone the repository and run `npm install`.
2. Copy `.env.example` to `.env` and fill in your local API keys:
   - **OpenAI**: Requires `OPENAI_API_KEY`.
   - **Firebase**: Requires `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` (obtained from a Firebase Service Account).
3. Run `npm run dev` to start the development server using `tsx`.

## 2. Architecture & Code Organization
This project strictly follows **Clean Architecture**. When adding new features, you must respect the layer boundaries:
- **Domain (`/domain`)**: Place core business entities and interfaces here. No framework or external library imports allowed.
- **Application (`/application`)**: Place your Use Cases here. Use Cases orchestrate logic using interfaces from the domain. Do not import Express or Firebase here.
- **Infrastructure (`/infrastructure`)**: Place third-party integrations here (e.g., Firebase SDK, OpenAI API, external HTTP clients).
- **Presentation (`/presentation`)**: Place your Express routes, controllers, and middlewares here. Controllers should only handle HTTP concerns and delegate logic to Use Cases.

## 3. Coding Guidelines
- **TypeScript**: Use strict typing. Avoid `any` whenever possible. Always run `npm run type-check` before committing.
- **Validation**: Use **Zod** for all input validation (request bodies, query params, environment variables). Never trust client input.
- **Logging**: Use the configured **Pino** logger (`src/shared/logger/logger.ts`) instead of `console.log`. Log operational errors as warnings and unexpected exceptions as errors.
- **Error Handling**: Throw `AppError` (or subclasses like `NotFoundError`, `LimitExceededError`) for operational errors. The global `errorHandler` middleware will automatically map these to correct HTTP responses.

## 4. Pull Request Process
1. Create a feature branch from `main` (e.g., `feat/add-new-provider`, `fix/auth-middleware`).
2. Keep your PRs focused on a single feature or fix.
3. Ensure the project builds successfully (`npm run build`) and passes type checking (`npm run type-check`).
4. Update or create necessary documentation (e.g., updating `ARCHITECTURE.md` or `README.md`) if your PR introduces significant structural changes.
5. Request a review from at least one core maintainer before merging.
