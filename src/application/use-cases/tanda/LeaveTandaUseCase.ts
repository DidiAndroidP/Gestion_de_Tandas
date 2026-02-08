import { ParticipantRepository } from "../../../domain/ports/ParticipantRepository";
import { TandaRepository } from "../../../domain/ports/TandaRepository";

export class LeaveTandaUseCase {
  constructor(
    private readonly participantRepository: ParticipantRepository,
    private readonly tandaRepository: TandaRepository
  ) { }

  async execute(userId: number, tandaId: number): Promise<void> {
    const tanda = await this.tandaRepository.findById(tandaId)
    if (!tanda) throw new Error("Tanda not found")

    if (tanda.status !== "created") {
      throw new Error("No puedes salir de una tanda iniciada")
    }

    if (tanda.creatorId === userId) {
      throw new Error("El creador no puede salirse de la tanda")
    }

    await this.participantRepository.delete(userId, tandaId)
  }
}
