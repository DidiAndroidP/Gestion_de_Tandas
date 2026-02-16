import { UserRepository } from "../../../domain/ports/UserRepository"
import { UserResponseDTO } from "../../dtos/user/UserResponseDTO"

export class GetUserByIdUseCase {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async execute(id: number): Promise<UserResponseDTO> {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new Error("User not found")
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      photo: user.photo,
      role: user.role,
      active: user.active,
      createdAt: user.createdAt
    }
  }
}
