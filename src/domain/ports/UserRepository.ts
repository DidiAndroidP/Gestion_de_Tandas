import { User } from "../entities/User"

export interface UserRepository {
  save(user: User): Promise<User>;
  update(user: User): Promise<void>
  findById(id: number): Promise<User | null>
  findByEmail(email: string): Promise<User | null>;
}