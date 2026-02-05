import { UserRepository } from "../../../domain/ports/UserRepository"
import { UpdateUserDTO } from "../../dtos/user/UpdateUserDTO"

export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: number, dto: UpdateUserDTO): Promise<void> {
    const user = await this.userRepository.findById(userId)
    if (!user) throw new Error("User not found")

    if (dto.name !== undefined) user.name = dto.name
    if (dto.active !== undefined) user.active = dto.active

    await this.userRepository.update(user)
  }
}