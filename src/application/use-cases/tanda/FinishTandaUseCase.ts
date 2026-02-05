import { TandaRepository } from "../../../domain/ports/TandaRepository"

export class FinishTandaUseCase {
  constructor(private readonly tandaRepository: TandaRepository) {}

  async execute(tandaId: number): Promise<void> {
    const tanda = await this.tandaRepository.findById(tandaId)
    if (!tanda) throw new Error("Tanda not found")

    tanda.finish()
    await this.tandaRepository.update(tanda)
  }
}
