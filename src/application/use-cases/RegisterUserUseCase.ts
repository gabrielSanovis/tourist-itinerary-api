import bcrypt from "bcryptjs";
import { UserRepository } from "../../domain/interfaces/UserRepository";
import { AppError } from "../../shared/errors/AppError";
import { config } from "../../shared/config/config";
import { signAuthToken } from "../../shared/auth/token";

export type RegisterUserInput = {
  name: string;
  username: string;
  password: string;
};

export type RegisterUserOutput = {
  token: string;
  user: {
    id: string;
    name: string;
    username: string;
  };
};

export class RegisterUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    const existing = await this.userRepository.findByUsername(input.username);
    if (existing) {
      throw new AppError("Username already in use", 409);
    }

    const passwordHash = await bcrypt.hash(
      input.password,
      config.BCRYPT_SALT_ROUNDS
    );

    const user = await this.userRepository.create({
      name: input.name,
      username: input.username,
      passwordHash,
    });

    const token = signAuthToken({ sub: user.id, username: user.username });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
      },
    };
  }
}
