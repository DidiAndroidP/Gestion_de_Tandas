import { User } from "../../../domain/entities/User"
import { CreateUserDTO } from "../../dtos/user/CreateUserDTO"
import { UserRepository } from "../../../domain/ports/UserRepository"
import { AuthRepository } from "../../../domain/ports/AuthRepository"

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository
  ) {}

  async execute(dto: CreateUserDTO): Promise<User> {
    const exists = await this.userRepository.findByEmail(dto.email)
    if (exists) {
      throw new Error("Email already registered")
    }

    const hashedPassword = await this.authRepository.hashPassword(dto.password)

    const user = new User(
      0,
      dto.name,
      dto.email,
      hashedPassword, 
      dto.phone ?? null,
      dto.photo ?? null,
      "user",
      true,
      0,
      new Date()
    )

    return this.userRepository.save(user).then(() => user)
  }
}