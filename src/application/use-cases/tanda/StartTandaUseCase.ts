import { TandaRepository } from "../../../domain/ports/TandaRepository"
import { ParticipantRepository } from "../../../domain/ports/ParticipantRepository"

export class StartTandaUseCase {
  constructor(
    private readonly tandaRepository: TandaRepository,
    private readonly participantRepository: ParticipantRepository
  ) {}

  async execute(tandaId: number, userId: number): Promise<void> {
    const tanda = await this.tandaRepository.findById(tandaId)

    if (!tanda) {
      throw new Error("La tanda no existe.")
    }

    if (tanda.creatorId !== userId) {
      throw new Error("Solo el creador puede iniciar la tanda.")
    }

    const participants = await this.participantRepository.findByTanda(tandaId)

    if (!tanda.canStartWith(participants.length)) {
      throw new Error(
        `No se puede iniciar la tanda.
Se requieren ${tanda.totalMembers} participantes y actualmente hay ${participants.length}.`
      )
    }

    tanda.start()
    await this.tandaRepository.update(tanda)
  }
}
