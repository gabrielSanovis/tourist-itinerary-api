import { User } from "../entities/User";

export interface UserRepository {
  findByUsername(username: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(input: {
    name: string;
    username: string;
    passwordHash: string;
  }): Promise<User>;
}
