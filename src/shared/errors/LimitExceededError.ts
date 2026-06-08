import { AppError } from "./AppError";

export class LimitExceededError extends AppError {
  constructor(limit: number = 10) {
    super(
      `You have reached the maximum limit of ${limit} saved itineraries. Please delete one before saving a new one.`,
      403
    );
    this.name = "LimitExceededError";
  }
}
