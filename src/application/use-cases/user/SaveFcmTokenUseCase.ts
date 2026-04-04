import { UserRepository } from "../../../domain/ports/UserRepository";

export class SaveFcmTokenUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: number, token: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error("User not found");

    await this.userRepository.updateFcmToken(userId, token); 
  }
}