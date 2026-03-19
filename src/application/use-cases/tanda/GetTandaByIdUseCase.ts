import { TandaRepository } from "../../../domain/ports/TandaRepository"
import { ParticipantRepository } from "../../../domain/ports/ParticipantRepository"
import {
  TandaResponseDTO,
  TandaStatusDTO
} from "../../dtos/tanda/TandaResponseDTO"

export class GetTandaByIdUseCase {
  constructor(
    private readonly tandaRepository: TandaRepository,
    private readonly participantRepository: ParticipantRepository
  ) {}

  private mapStatus(status: string): TandaStatusDTO {
    switch (status) {
      case "created":
        return "CREATED"
      case "in_progress":
        return "IN_PROGRESS"
      case "finished":
        return "FINISHED"
      default:
        throw new Error("Invalid tanda status")
    }
  }

  async execute(tandaId: number, userId: number): Promise<TandaResponseDTO> {
    const tanda = await this.tandaRepository.findById(tandaId)
    if (!tanda) {
      throw new Error("Tanda not found")
    }

    const participant =
      await this.participantRepository.findByUserAndTanda(userId, tandaId)

    return {
      id: tanda.id,
      name: tanda.name,
      contributionAmount: tanda.contributionAmount,
      paymentFrequency: tanda.paymentFrequency,
      totalMembers: tanda.totalMembers,
      currentMembers: tanda.currentParticipants(),
      status: this.mapStatus(tanda.status),
      isMember: participant !== null,
      creatorId: tanda.creatorId,
      isAdmin: tanda.creatorId === userId
    }
  }
}