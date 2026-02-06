import { ParticipantRepository } from "../../../domain/ports/ParticipantRepository";
import { TandaRepository } from "../../../domain/ports/TandaRepository";

export class LeaveTandaUseCase {
  constructor(
    private readonly participantRepository: ParticipantRepository,
    private readonly tandaRepository: TandaRepository
  ) {}

  async execute(userId: number, tandaId: number): Promise<void> {
    const tanda = await this.tandaRepository.findById(tandaId);

    if (!tanda) {
      throw new Error("La tanda no existe");
    }

    if (tanda.isStarted()) {
      throw new Error("No puedes salir de una tanda iniciada");
    }

    const participant =
      await this.participantRepository.findByUserAndTanda(userId, tandaId);

    if (!participant) {
      throw new Error("No perteneces a esta tanda");
    }

    await this.participantRepository.delete(userId, tandaId);
  }
}
