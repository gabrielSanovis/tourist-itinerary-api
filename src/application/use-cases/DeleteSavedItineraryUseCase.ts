import { ItineraryRepository } from "../../domain/interfaces/ItineraryRepository";

export class DeleteSavedItineraryUseCase {
  constructor(private readonly repository: ItineraryRepository) {}

  public async execute(userId: string, itineraryId: string): Promise<void> {
    // O repositório valida se o documento existe e pertence ao userId
    await this.repository.delete(userId, itineraryId);
  }
}
