import { Tanda } from "../../../domain/entities/Tanda"
import { CreateTandaDTO } from "../../dtos/tanda/CreateTandaDTO"
import { TandaRepository } from "../../../domain/ports/TandaRepository"

export class CreateTandaUseCase {
  constructor(private readonly tandaRepository: TandaRepository) {}

  async execute(dto: CreateTandaDTO): Promise<Tanda> {
    const tanda = new Tanda(
      0,
      dto.name,
      dto.contributionAmount,
      dto.paymentFrequency,
      dto.totalMembers,
      dto.delayToleranceDays,
      dto.penaltyPerDay,
      "created",
      dto.creatorId,
      new Date(),
      null, 
      []   
    )

    return this.tandaRepository.save(tanda)
  }
}