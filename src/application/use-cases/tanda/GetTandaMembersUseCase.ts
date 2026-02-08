import { ParticipantRepository } from "../../../domain/ports/ParticipantRepository"
import { UserRepository } from "../../../domain/ports/UserRepository"

export class GetTandaMembersUseCase {
  constructor(
    private readonly participantRepository: ParticipantRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(tandaId: number) {
    const participants = await this.participantRepository.findByTanda(tandaId)

    const users = await Promise.all(
      participants.map(async p => {
        const user = await this.userRepository.findById(p.userId)
        if (!user) throw new Error("User not found")

        return {
          id: user.id,
          name: user.name,
          photo: null,
          alreadyPaid: p.alreadyPaid
        }
      })
    )

    return users
  }
}
