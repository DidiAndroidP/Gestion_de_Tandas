import { TandaRepository } from "../../../domain/ports/TandaRepository"
import { TandaResponseDTO } from "../../dtos/tanda/TandaResponseDTO"

export class GetTandaByIdUseCase {
  constructor(private readonly tandaRepository: TandaRepository) {}

  async execute(id: number): Promise<TandaResponseDTO> {
    const tanda = await this.tandaRepository.findById(id)
    if (!tanda) throw new Error("Tanda not found")

    const statusMap: Record<string, "CREATED" | "IN_PROGRESS" | "FINISHED"> = {
      created: "CREATED",
      in_progress: "IN_PROGRESS",
      finished: "FINISHED"
    }

    return {
      id: tanda.id,
      name: tanda.name,
      contributionAmount: tanda.contributionAmount,
      totalMembers: tanda.totalMembers,
      currentMembers: tanda.currentParticipants(),
      status: statusMap[tanda.status]
    }
  }
}
