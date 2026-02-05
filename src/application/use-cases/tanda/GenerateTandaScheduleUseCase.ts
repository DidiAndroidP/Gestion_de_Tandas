import { ParticipantRepository } from "../../../domain/ports/ParticipantRepository"
import { TurnService } from "../../../domain/services/TurnService"

export class GenerateTandaScheduleUseCase {
  constructor(
    private readonly participantRepository: ParticipantRepository,
    private readonly turnService: TurnService
  ) {}

  async execute(tandaId: number): Promise<void> {
    const participants = await this.participantRepository.findByTanda(tandaId)

    if (participants.length === 0) {
      throw new Error("No participants found")
    }

    let currentParticipants = [...participants]

    for (const participant of currentParticipants) {
      const turn = this.turnService.assignTurn(currentParticipants)
      participant.assignTurn(turn)
      await this.participantRepository.save(participant)
    }
  }
}
