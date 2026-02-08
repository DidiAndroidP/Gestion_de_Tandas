import { TandaRepository } from "../../../domain/ports/TandaRepository"

export class UpdateTandaStatusUseCase {
  constructor(
    private readonly tandaRepository: TandaRepository
  ) {}

  async execute(
    tandaId: number,
    userId: number,
    status: "CREATED" | "IN_PROGRESS" | "FINISHED"
  ): Promise<void> {

    const tanda = await this.tandaRepository.findById(tandaId)
    if (!tanda) throw new Error("Tanda not found")

    if (tanda.creatorId !== userId) {
      throw new Error("Only admin can update status")
    }

    if (status === "IN_PROGRESS") {
      if (tanda.currentParticipants() !== tanda.totalMembers) {
        throw new Error("Tanda is not full")
      }
      tanda.start()
    }

    if (status === "FINISHED") {
      tanda.finish()
    }

    await this.tandaRepository.update(tanda)
  }
}
