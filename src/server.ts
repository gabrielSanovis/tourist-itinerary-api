import { app } from "./app";
import { config } from "./shared/config/config";
import { logger } from "./shared/logger/logger";
import { initDb } from "./infrastructure/db/postgres";

let server: ReturnType<typeof app.listen> | null = null;

const start = async (): Promise<void> => {
  await initDb();
  server = app.listen(config.PORT, () => {
    logger.info(
      { port: config.PORT, env: config.NODE_ENV },
      "🚀 Tourist Itinerary API is running"
    );
  });
};

const shutdown = (signal: string): void => {
  logger.info({ signal }, "Shutdown signal received, closing server gracefully");
  if (!server) {
    process.exit(0);
  }
  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("uncaughtException", (err: Error) => {
  logger.fatal({ err }, "Uncaught exception — shutting down");
  process.exit(1);
});

process.on("unhandledRejection", (reason: unknown) => {
  logger.fatal({ reason }, "Unhandled promise rejection — shutting down");
  process.exit(1);
});

start().catch((err) => {
  logger.fatal({ err }, "Failed to start server");
  process.exit(1);
});
