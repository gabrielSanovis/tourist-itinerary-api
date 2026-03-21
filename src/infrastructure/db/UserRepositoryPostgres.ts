import { db } from "./postgres";
import { UserRepository } from "../../domain/interfaces/UserRepository";
import { User } from "../../domain/entities/User";

type UserRow = {
  id: string;
  name: string;
  username: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
};

const mapRow = (row: UserRow): User => ({
  id: row.id,
  name: row.name,
  username: row.username,
  passwordHash: row.password_hash,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export class UserRepositoryPostgres implements UserRepository {
  async findByUsername(username: string): Promise<User | null> {
    const result = await db.query<UserRow>(
      `SELECT id, name, username, password_hash, created_at, updated_at
       FROM users
       WHERE username = $1
       LIMIT 1`,
      [username]
    );
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }

  async findById(id: string): Promise<User | null> {
    const result = await db.query<UserRow>(
      `SELECT id, name, username, password_hash, created_at, updated_at
       FROM users
       WHERE id = $1
       LIMIT 1`,
      [id]
    );
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }

  async create(input: {
    name: string;
    username: string;
    passwordHash: string;
  }): Promise<User> {
    const result = await db.query<UserRow>(
      `INSERT INTO users (name, username, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, username, password_hash, created_at, updated_at`,
      [input.name, input.username, input.passwordHash]
    );

    return mapRow(result.rows[0]);
  }
}
