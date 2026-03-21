import bcrypt from "bcryptjs";
import { UserRepository } from "../../domain/interfaces/UserRepository";
import { AppError } from "../../shared/errors/AppError";
import { signAuthToken } from "../../shared/auth/token";

export type LoginUserInput = {
  username: string;
  password: string;
};

export type LoginUserOutput = {
  token: string;
  user: {
    id: string;
    name: string;
    username: string;
  };
};

export class LoginUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: LoginUserInput): Promise<LoginUserOutput> {
    const user = await this.userRepository.findByUsername(input.username);

    if (!user) {
      throw new AppError("Invalid username or password", 401);
    }

    const isValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isValid) {
      throw new AppError("Invalid username or password", 401);
    }

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
