import { User } from "../entities/User"

export interface UserRepository {
  save(user: User): Promise<void>
  update(user: User): Promise<void>
  findById(id: number): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
}