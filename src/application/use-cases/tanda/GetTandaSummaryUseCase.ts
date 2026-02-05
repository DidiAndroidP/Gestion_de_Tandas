import { TandaRepository } from "../../../domain/ports/TandaRepository"
import { ParticipantRepository } from "../../../domain/ports/ParticipantRepository"
import { PaymentRepository } from "../../../domain/ports/PaymentRepository"
import { TandaSummaryDTO } from "../../dtos/tanda/TandaSummaryDTO"

export class GetTandaSummaryUseCase {
  constructor(
    private readonly tandaRepository: TandaRepository,
    private readonly participantRepository: ParticipantRepository,
    private readonly paymentRepository: PaymentRepository
  ) {}

  async execute(tandaId: number): Promise<TandaSummaryDTO> {
    const tanda = await this.tandaRepository.findById(tandaId)
    if (!tanda) throw new Error("Tanda not found")

    const participants = await this.participantRepository.findByTanda(tandaId)

    let totalCollected = 0
    for (const participant of participants) {
      const payments = await this.paymentRepository.findByParticipant(participant.id)
      payments.forEach(p => totalCollected += p.amount)
    }

    return {
      tandaId: tanda.id,
      name: tanda.name,
      totalMembers: tanda.totalMembers,
      activeMembers: participants.length,
      totalCollected,
      status: tanda.status
    }
  }
}
