import { TandaRepository } from "../../../domain/ports/TandaRepository"
import { ParticipantRepository } from "../../../domain/ports/ParticipantRepository"
import { Tanda } from "../../../domain/entities/Tanda"
import { Participant } from "../../../domain/entities/Participant"

export class CreateTandaUseCase {
  constructor(
    private readonly tandaRepository: TandaRepository,
    private readonly participantRepository: ParticipantRepository
  ) {}

  async execute(dto: {
    name: string
    contributionAmount: number
    paymentFrequency: string
    totalMembers: number
    delayToleranceDays: number
    penaltyPerDay: number
    creatorId: number
  }): Promise<Tanda> {

    const tanda = Tanda.create(dto)

    await this.tandaRepository.save(tanda)

    const creatorParticipant = new Participant(
      0,
      dto.creatorId,
      tanda.id,
      0,
      false,
      false,
      new Date()
    )

    await this.participantRepository.save(creatorParticipant)

    return tanda
  }
}
