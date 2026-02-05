import { UserRepository } from "../../../domain/ports/UserRepository"

export class ActivateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: number): Promise<void> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new Error("User not found")
    }

    user.activate()
    await this.userRepository.update(user)
  }
}
