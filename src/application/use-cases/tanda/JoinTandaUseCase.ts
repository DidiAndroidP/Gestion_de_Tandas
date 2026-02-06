import { TandaRepository } from "../../../domain/ports/TandaRepository";
import { ParticipantRepository } from "../../../domain/ports/ParticipantRepository";
import { Participant } from "../../../domain/entities/Participant";

export class JoinTandaUseCase {
  constructor(
    private readonly tandaRepository: TandaRepository,
    private readonly participantRepository: ParticipantRepository
  ) {}

  async execute(tandaId: number, userId: number): Promise<void> {
    const tanda = await this.tandaRepository.findById(tandaId);

    if (!tanda) {
      throw new Error("La tanda no existe");
    }

    if (tanda.status !== "created") {
      throw new Error("No puedes unirte a una tanda que ya inició o terminó");
    }

    const existingParticipant =
      await this.participantRepository.findByUserAndTanda(userId, tandaId);

    if (existingParticipant) {
      throw new Error("Ya estás inscrito en esta tanda");
    }

    const participants = await this.participantRepository.findByTanda(tandaId);

    if (participants.length >= tanda.totalMembers) {
      throw new Error("La tanda ya alcanzó el número máximo de participantes");
    }

    const participant = new Participant(
      0,
      userId,
      tandaId,
      participants.length + 1,
      false,
      false,
      new Date()
    );

    await this.participantRepository.save(participant);
  }
}
