import { AppError } from "./AppError";

export class ValidationError extends AppError {
  public readonly field?: string;

  constructor(message: string, field?: string) {
    super(message, 422);
    this.field = field;
  }
}
