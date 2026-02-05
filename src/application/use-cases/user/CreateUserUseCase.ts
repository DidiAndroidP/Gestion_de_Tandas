import { User } from "../../../domain/entities/User"
import { CreateUserDTO } from "../../dtos/user/CreateUserDTO"
import { UserRepository } from "../../../domain/ports/UserRepository"

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: CreateUserDTO): Promise<User> {
    const exists = await this.userRepository.findByEmail(dto.email)
    if (exists) {
      throw new Error("Email already registered")
    }

    const user = new User(
      0,
      dto.name,
      dto.email,
      this.hashPassword(dto.password),
      dto.phone ?? null,
      "user",
      true,
      0,
      new Date()
    )

    return this.userRepository.save(user)
  }

  private hashPassword(password: string): string {
    return `hashed_${password}`
  }
}
