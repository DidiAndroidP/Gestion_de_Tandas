import { TandaRepository } from "../../../domain/ports/TandaRepository"

export class JoinTandaUseCase {
  constructor(private readonly tandaRepository: TandaRepository) {}

  async execute(tandaId: number, userId: number): Promise<void> {
    const tanda = await this.tandaRepository.findById(tandaId)
    if (!tanda) {
      throw new Error("Tanda not found")
    }

    tanda.addParticipant(userId)
    await this.tandaRepository.update(tanda)
  }
}
