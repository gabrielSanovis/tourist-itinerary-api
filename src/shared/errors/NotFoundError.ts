export class NotFoundError extends Error {
  public readonly statusCode = 404;
  public readonly isOperational = true;

  constructor(resource: string) {
    super(`${resource} not found`);
    this.name = "NotFoundError";
  }
}
