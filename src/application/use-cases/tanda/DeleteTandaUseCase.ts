import { TandaRepository } from "../../../domain/ports/TandaRepository"

export class DeleteTandaUseCase {
  constructor(
    private readonly tandaRepository: TandaRepository
  ) {}

  async execute(tandaId: number, userId: number): Promise<void> {
    const tanda = await this.tandaRepository.findById(tandaId)

    if (!tanda) {
      throw new Error("La tanda no existe")
    }

    if (tanda.creatorId !== userId) {
      throw new Error("Solo el creador puede eliminar la tanda")
    }

    if (tanda.status !== "created") {
      throw new Error(
        "Solo se pueden eliminar tandas que aún no han iniciado"
      )
    }

    await this.tandaRepository.deleteById(tandaId)
  }
}
