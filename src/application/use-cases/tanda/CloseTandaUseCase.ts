import { TandaRepository } from "../../../domain/ports/TandaRepository"

export class CloseTandaUseCase {
  constructor(
    private readonly tandaRepository: TandaRepository
  ) {}

  async execute(tandaId: number): Promise<void> {
    const tanda = await this.tandaRepository.findById(tandaId)
    if (!tanda) {
      throw new Error("Tanda not found")
    }

    if (tanda.status !== "in_progress") {
      throw new Error("Only an active tanda can be closed")
    }

    tanda.finish()
    await this.tandaRepository.update(tanda)
  }
}