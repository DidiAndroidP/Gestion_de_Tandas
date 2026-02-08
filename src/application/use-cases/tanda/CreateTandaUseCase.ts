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

    const tandaId = await this.tandaRepository.save(tanda)

    tanda.setId(tandaId)

    const creatorParticipant = new Participant(
      0,
      dto.creatorId,
      tandaId,
      0,
      false,
      false,
      new Date()
    )

    await this.participantRepository.save(creatorParticipant)

    tanda.incrementParticipants()

    return tanda
  }
}
