import { UserRepository } from "../../../domain/ports/UserRepository"
import { AuthRepository } from "../../../domain/ports/AuthRepository"
import { LoginDTO } from "../../dtos/auth/LoginDTO"
import { AuthResponseDTO } from "../../dtos/auth/AuthResponseDTO"

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository
  ) {}

  async execute(dto: LoginDTO): Promise<AuthResponseDTO> {
    const user = await this.userRepository.findByEmail(dto.email)
    if (!user) {
      throw new Error("Invalid credentials")
    }

    const isValid = await this.authRepository.comparePassword(
      dto.password,
      user.passwordHash
    )

    if (!isValid) {
      user.registerFailedAttempt()
      await this.userRepository.update(user)
      throw new Error("Invalid credentials")
    }

    if (!user.active) {
      throw new Error("User is inactive")
    }

    const token = this.authRepository.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    if (user.failedAttempts > 0) {
      user.activate()
      await this.userRepository.update(user)
    }

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        active: user.active,
        createdAt: user.createdAt
      }
    }
  }
}
