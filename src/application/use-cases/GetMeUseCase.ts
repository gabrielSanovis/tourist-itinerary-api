import { UserRepository } from "../../domain/interfaces/UserRepository";
import { AppError } from "../../shared/errors/AppError";

export type GetMeOutput = {
  id: string;
  name: string;
  username: string;
};

export class GetMeUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<GetMeOutput> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    return {
      id: user.id,
      name: user.name,
      username: user.username,
    };
  }
}
